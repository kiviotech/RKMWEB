import React, { useState } from 'react';

const UserForm = ({ 
  user, 
  roles, 
  onSubmit, 
  onCancel, 
  onPasswordReset,
  onRoleAssign
}) => {
  const isNewUser = !!user.isNew;
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
    confirmPassword: '',
    role: user.role?.id || '',
    blocked: user.blocked || false,
    stopCommunication: user.stopCommunication || false,
    communicationStopReason: user.communicationStopReason || ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear errors when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (isNewUser || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required for new users';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    // Add validation for communication stop reason
    if (formData.stopCommunication && !formData.communicationStopReason) {
      newErrors.communicationStopReason = 'Please select a reason for stopping communication';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });
    
    try {
      // Prepare data for submission
      const userData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        blocked: formData.blocked,
        stopCommunication: formData.stopCommunication,
        communicationStopReason: formData.communicationStopReason
      };
      
      // Add password only if provided (for new users or when changing password)
      if (formData.password) {
        userData.password = formData.password;
      }
      
      const result = await onSubmit(userData);
      
      if (result.success) {
        setFeedback({ 
          type: 'success', 
          message: `User ${isNewUser ? 'created' : 'updated'} successfully!`
        });
        
        // Reset form if successful and new user
        if (isNewUser) {
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
            blocked: false,
            stopCommunication: false,
            communicationStopReason: ''
          });
        }
      } else {
        setFeedback({ 
          type: 'error', 
          message: result.error || `Failed to ${isNewUser ? 'create' : 'update'} user.`
        });
      }
    } catch (error) {
      console.error('Error submitting user form:', error);
      setFeedback({ 
        type: 'error', 
        message: error.message || `An error occurred while ${isNewUser ? 'creating' : 'updating'} the user.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }
    
    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await onPasswordReset(user.id, formData.password);
      
      if (result.success) {
        setFeedback({ 
          type: 'success', 
          message: 'Password reset successfully!'
        });
        setFormData({
          ...formData,
          password: '',
          confirmPassword: ''
        });
        setShowPasswordReset(false);
      } else {
        setFeedback({ 
          type: 'error', 
          message: result.error || 'Failed to reset password.'
        });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setFeedback({ 
        type: 'error', 
        message: error.message || 'An error occurred while resetting the password.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role change - don't immediately update in backend to avoid excessive API calls
  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    
    // Just update form data - the role will be saved when the form is submitted
    setFormData({
      ...formData,
      role: roleId
    });
    
    // Clear any existing errors for the role field
    if (errors.role) {
      setErrors({
        ...errors,
        role: ''
      });
    }
  };

  return (
    <div className="user-form">
      <h3>{isNewUser ? 'Create New User' : 'Edit User'}</h3>
      
      {feedback.message && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      
      {!showPasswordReset ? (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              disabled={isSubmitting}
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
          
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          
          {isNewUser && (
            <>
              <div className="form-row">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className="material-icons">
                      {showPassword ? "visibility_off" : "visibility"}
                    </i>
                  </button>
                </div>
                {errors.password && <div className="error">{errors.password}</div>}
              </div>
              
              <div className="form-row">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
              </div>
            </>
          )}
          
          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              disabled={isSubmitting}
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && <div className="error">{errors.role}</div>}
          </div>
          
          <div className="form-row checkbox-row">
            <label htmlFor="blocked" className="checkbox-label">
              <input
                type="checkbox"
                id="blocked"
                name="blocked"
                checked={formData.blocked}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Block User
            </label>
            <div className="helper-text">
              If checked, this user will not be able to log in.
            </div>
          </div>
          
          <div className="form-row checkbox-row">
            <label htmlFor="stopCommunication">
              <input
                type="checkbox"
                id="stopCommunication"
                name="stopCommunication"
                checked={formData.stopCommunication}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Stop Communication
            </label>
            <div className="helper-text">
              If checked, this user will not receive any communications.
            </div>
          </div>
          
          {formData.stopCommunication && (
            <div className="form-row">
              <label htmlFor="communicationStopReason">Reason for Stopping Communication</label>
              <select
                id="communicationStopReason"
                name="communicationStopReason"
                value={formData.communicationStopReason}
                onChange={handleChange}
                disabled={isSubmitting}
                required={formData.stopCommunication}
              >
                <option value="">Select a reason</option>
                <option value="Unsubscribed">Unsubscribed</option>
                <option value="Bounced Email">Bounced Email</option>
                <option value="Complaint">Complaint</option>
                <option value="Invalid Contact">Invalid Contact</option>
                <option value="Requested Removal">Requested Removal</option>
                <option value="Other">Other</option>
              </select>
              {errors.communicationStopReason && (
                <div className="error">{errors.communicationStopReason}</div>
              )}
            </div>
          )}
          
          <div className="form-buttons">
            <div className="left-buttons">
              <button
                type="button"
                className="cancel"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              {!isNewUser && (
                <button
                  type="button"
                  className="reset-password"
                  onClick={() => setShowPasswordReset(true)}
                  disabled={isSubmitting}
                >
                  Reset Password
                </button>
              )}
            </div>
            <button
              type="submit"
              className="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isNewUser ? 'Create User' : 'Update User'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordResetSubmit}>
          <h4>Reset Password for {user.username}</h4>
          
          <div className="form-row">
            <label htmlFor="reset-password">New Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="reset-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <i className="material-icons">
                  {showPassword ? "visibility_off" : "visibility"}
                </i>
              </button>
            </div>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          
          <div className="form-row">
            <label htmlFor="reset-confirmPassword">Confirm New Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="reset-confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-buttons">
            <button
              type="button"
              className="cancel"
              onClick={() => setShowPasswordReset(false)}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="submit"
              className="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserForm;