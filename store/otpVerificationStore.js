import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as services from '../services/auth';

/**
 * Store for managing OTP verification state for account-admin users
 */
export const useOtpVerificationStore = create(
  persist(
    (set, get) => ({
      // User verification state
      isVerified: false,
      verificationTime: null,
      accountAdminId: null, // Keep track of which admin is verified
      
      // In-progress verification
      otpRequestInProgress: false,
      otpVerificationInProgress: false,
      
      // Store for pending edit after OTP verification
      pendingEditAction: null,
      
      // Reset verification after session timeout (4 hours)
      sessionTimeout: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
      
      // Request OTP to be sent to user's mobile
      requestOtp: async (userId) => {
        try {
          set({ otpRequestInProgress: true });
          
          // Call API to request OTP
          const response = await services.requestOtp(userId);
          
          if (response.success) {
            set({ 
              accountAdminId: userId,
              otpRequestInProgress: false 
            });
            return { success: true };
          } else {
            throw new Error(response.message || 'Failed to send OTP');
          }
        } catch (error) {
          console.error('[OTP] Error requesting OTP:', error);
          set({ otpRequestInProgress: false });
          return { 
            success: false, 
            error: error.message || 'Failed to send OTP. Please try again.'
          };
        }
      },
      
      // Verify the OTP code entered by user
      verifyOtp: async (otp) => {
        try {
          const userId = get().accountAdminId;
          
          if (!userId) {
            throw new Error('User ID not found. Please request a new OTP.');
          }
          
          set({ otpVerificationInProgress: true });
          
          // Hardcoded OTP for testing - always allow 123456
          if (otp === '123456') {
            console.log('[OTP] Using hardcoded test OTP');
            // Set verification state with timestamp
            set({ 
              isVerified: true,
              verificationTime: new Date().getTime(),
              otpVerificationInProgress: false 
            });
            return { success: true };
          }
          
          // Call API to verify OTP for real verification
          const response = await services.verifyOtp(userId, otp);
          
          if (response.success) {
            // Set verification state with timestamp
            set({ 
              isVerified: true,
              verificationTime: new Date().getTime(),
              otpVerificationInProgress: false 
            });
            return { success: true };
          } else {
            throw new Error(response.message || 'Invalid OTP');
          }
        } catch (error) {
          console.error('[OTP] Error verifying OTP:', error);
          set({ otpVerificationInProgress: false });
          return { 
            success: false, 
            error: error.message || 'OTP verification failed. Please try again.'
          };
        }
      },
      
      // Store pending edit action for after OTP verification
      setPendingEdit: (action) => {
        set({ pendingEditAction: action });
      },
      
      // Clear pending edit action
      clearPendingEdit: () => {
        set({ pendingEditAction: null });
      },
      
      // Check if user is verified and not timed out
      isSessionValid: () => {
        const { isVerified, verificationTime, sessionTimeout } = get();
        
        if (!isVerified || !verificationTime) return false;
        
        const currentTime = new Date().getTime();
        const elapsed = currentTime - verificationTime;
        
        return elapsed < sessionTimeout;
      },
      
      // Reset verification state
      resetVerification: () => {
        set({
          isVerified: false,
          verificationTime: null,
          accountAdminId: null,
          pendingEditAction: null
        });
      }
    }),
    {
      name: 'otp-verification-storage',
      // Only persist these fields
      partialize: (state) => ({
        isVerified: state.isVerified,
        verificationTime: state.verificationTime,
        accountAdminId: state.accountAdminId
      })
    }
  )
);

export default useOtpVerificationStore;
