import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../../../components/ui/Button';
import { changePassword } from '../../../../services/auth';
import { ROLES } from '../../../constants/permissions';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Reset message when user types
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Reset message when user types
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSuperAdminCheck = async () => {
    try {
      setIsLoading(true);
      
      // This is a simple check - actual implementation should verify with the backend
      // For demo purposes, we're checking if the email contains "admin" or "superadmin"
      const isSuperAdminEmail = email.toLowerCase().includes('admin') || 
                               username.toLowerCase().includes('admin');
      
      setIsSuperAdmin(isSuperAdminEmail);
      
      if (isSuperAdminEmail) {
        // If super admin, we'll continue with the password reset process
        const response = await changePassword({ email, username });
        setMessage({ 
          type: 'success', 
          text: 'Password reset link has been sent to your email address.' 
        });
      } else {
        // For non-admin users, show contact message
        setMessage({ 
          type: 'info', 
          text: 'For security reasons, please contact the system administrator to reset your password.' 
        });
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email && !username) {
      setMessage({ type: 'error', text: 'Please enter your email or username' });
      return;
    }
    
    await handleSuperAdminCheck();
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password-box">
        <div className="logo">
          <img
            width="150px"
            src="https://kamarpukur.rkmm.org/Logo%201-2.png"
            alt="Logo"
          />
        </div>
        <h2>Forgot Password</h2>
        <p className="instructions">
          Please enter your email address or username. 
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <CommonButton
            buttonName={isLoading ? "Processing..." : "Reset Password"}
            buttonWidth="100%"
            disabled={isLoading}
            style={{
              backgroundColor: "#ea7704",
              fontSize: "16px",
              borderRadius: "16px",
              borderWidth: 0,
              padding: "10px 20px",
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
              marginTop: "20px",
            }}
          />
        </form>
        
        <div className="actions">
          <p>
            Remember your password?{" "}
            <span
              style={{
                cursor: "pointer",
                color: "#ea7704",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
