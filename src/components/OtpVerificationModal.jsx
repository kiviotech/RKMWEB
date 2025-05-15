import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useOtpVerificationStore } from '../../store/otpVerificationStore';
import './OtpVerificationModal.scss';

/**
 * OTP Verification Modal Component
 * Used for verifying account-admin users before allowing donation/receipt edits
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onVerified - Callback after successful verification
 */
const OtpVerificationModal = ({ isOpen, onClose, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Get current user from auth store
  const user = useAuthStore(state => state.user);
  
  // Get OTP verification methods from store
  const {
    requestOtp,
    verifyOtp,
    otpRequestInProgress,
    otpVerificationInProgress,
    isSessionValid,
    resetVerification
  } = useOtpVerificationStore();

  // Auto-send OTP when modal opens if not already verified
  useEffect(() => {
    if (isOpen && user && !isSessionValid() && !otpSent) {
      handleSendOtp();
    }
    
    // If user is already verified, call the success callback and close modal
    if (isOpen && isSessionValid()) {
      onVerified();
      onClose();
    }
  }, [isOpen, user, isSessionValid]);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOtp('');
      setError('');
      setOtpSent(false);
    }
  }, [isOpen]);

  const handleSendOtp = async () => {
    if (!user?.id) {
      setError('User not found. Please try logging in again.');
      return;
    }
    
    setError('');
    const result = await requestOtp(user.id);
    
    if (result.success) {
      setOtpSent(true);
    } else {
      setError(result.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerify = async () => {
    // Input validation
    if (!otp.trim()) {
      setError('Please enter the OTP sent to your mobile.');
      return;
    }
    
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits.');
      return;
    }
    
    setError('');
    const result = await verifyOtp(otp);
    
    if (result.success) {
      if (onVerified) {
        onVerified();
      }
      onClose();
    } else {
      setError(result.error || 'Invalid OTP. Please try again.');
    }
  };

  const handleOtpChange = (e) => {
    // Allow only numbers and limit to 6 characters
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
    setOtp(value);
  };

  if (!isOpen) return null;

  return (
    <div className="otp-verification-overlay">
      <div className="otp-verification-modal">
        <div className="otp-modal-header">
          <h2>Verification Required</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div className="otp-modal-body">
          <p className="verification-info">
            For security reasons, we need to verify your identity before you can modify donation records.
          </p>
          
          {otpSent ? (
            <>
              <p className="otp-sent-message">
                OTP has been sent to your registered mobile number ending with {user?.phoneNumber ? `****${user.phoneNumber.slice(-4)}` : '****'}.
              </p>
              
              <div className="otp-input-container">
                <label htmlFor="otp-input">Enter OTP</label>
                <input
                  id="otp-input"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="resend-otp">
                Didn't receive OTP? <button 
                  onClick={handleSendOtp}
                  disabled={otpRequestInProgress}
                  className="resend-button"
                >
                  Resend OTP
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Please click the button below to receive a One-Time Password (OTP) on your registered mobile number.</p>
              {error && <div className="error-message">{error}</div>}
            </>
          )}
        </div>
        
        <div className="otp-modal-footer">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            Cancel
          </button>
          
          {otpSent ? (
            <button 
              className="verify-button" 
              onClick={handleVerify}
              disabled={otpVerificationInProgress || otp.length !== 6}
            >
              {otpVerificationInProgress ? 'Verifying...' : 'Verify'}
            </button>
          ) : (
            <button 
              className="send-otp-button" 
              onClick={handleSendOtp}
              disabled={otpRequestInProgress}
            >
              {otpRequestInProgress ? 'Sending...' : 'Send OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
