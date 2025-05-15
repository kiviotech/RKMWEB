import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useOtpVerificationStore } from '../../store/otpVerificationStore';
import OtpVerificationModal from './OtpVerificationModal';
import { ROLES } from '../constants/permissions';

/**
 * Higher-order component that adds OTP verification
 * specifically for account-admin users when they attempt to edit 
 * donation records or receipts
 * 
 * @param {React.Component} WrappedComponent - Component to wrap with OTP verification
 * @returns {React.Component} - Enhanced component with OTP verification
 */
const withOtpVerification = (WrappedComponent) => {
  return function WithOtpVerification(props) {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    
    // Get user role from auth store
    const user = useAuthStore(state => state.user);
    const isAccountAdmin = user?.role?.type === ROLES.ACCOUNT_ADMIN;
    
    // Get OTP verification state from store
    const { isSessionValid, setPendingEdit, clearPendingEdit } = useOtpVerificationStore();
    
    // This function intercepts edit/update actions and shows OTP modal if needed
    const handleAction = (actionType, actionData, originalFunction) => {
      // If user is not an account admin, or session is valid, process normally
      if (!isAccountAdmin || isSessionValid()) {
        return originalFunction(actionData);
      }
      
      // Otherwise, save the pending action and show OTP modal
      setPendingAction({
        type: actionType,
        data: actionData,
        callback: originalFunction
      });
      
      // Also store in the global store for persistence
      setPendingEdit({
        type: actionType,
        data: actionData
      });
      
      setShowOtpModal(true);
      return null;
    };
    
    // Called after successful OTP verification
    const handleVerified = () => {
      if (pendingAction && pendingAction.callback) {
        // Execute the pending action
        pendingAction.callback(pendingAction.data);
        
        // Clear the pending action
        setPendingAction(null);
        clearPendingEdit();
      }
    };
    
    // Functions to be passed to the wrapped component
    const verificationHandlers = {
      handleEdit: (data, originalCallback) => 
        handleAction('edit', data, originalCallback),
      
      handleUpdate: (data, originalCallback) => 
        handleAction('update', data, originalCallback),
      
      handleReceiptEdit: (data, originalCallback) => 
        handleAction('receipt.edit', data, originalCallback)
    };
    
    return (
      <>
        <WrappedComponent 
          {...props} 
          verificationHandlers={verificationHandlers}
        />
        
        <OtpVerificationModal 
          isOpen={showOtpModal}
          onClose={() => {
            setShowOtpModal(false);
            setPendingAction(null);
            // Don't clear from the store to allow resuming later
          }}
          onVerified={handleVerified}
        />
      </>
    );
  };
};

export default withOtpVerification;
