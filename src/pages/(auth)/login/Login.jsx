import React, { useState } from "react";
import "./Login.scss";
import CommonButton from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../../services/auth";
import { useAuthStore } from "../../../../store/authStore";
import { ROLES } from "../../../constants/permissions";

const Login = () => {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      // Allow letters, numbers, underscores, dots, and spaces
      const sanitizedValue = value.replace(/[^a-zA-Z0-9_\.\s]/g, '');
      setFormValues({ ...formValues, [name]: sanitizedValue });

      // Show error if user tries to enter other special characters
      if (value !== sanitizedValue) {
        setFormErrors({
          ...formErrors,
          username: "Only letters, numbers, dots, spaces, and underscores are allowed"
        });
      } else {
        setFormErrors({
          ...formErrors,
          username: ""
        });
      }
    } else if (name === 'password') {
      // Remove spaces from password
      const sanitizedValue = value.replace(/\s/g, '');
      setFormValues({ ...formValues, [name]: sanitizedValue });

      // Show error if user tries to enter spaces
      if (value !== sanitizedValue) {
        setFormErrors({
          ...formErrors,
          password: "Spaces are not allowed in password"
        });
      } else {
        setFormErrors({
          ...formErrors,
          password: ""
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.username.trim()) {
      errors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_\.\s]+$/.test(formValues.username)) {
      errors.username = "Username can only contain letters, numbers, dots, spaces, and underscores";
    }
    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (/\s/.test(formValues.password)) {
      errors.password = "Password cannot contain spaces";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      try {
        setIsLoading(true);
        // Clear any previous errors
        setFormErrors({})
        
        // Get browser and device information for logging
        const userAgent = navigator.userAgent;
        const browserInfo = {
          userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screenSize: `${window.screen.width}x${window.screen.height}`
        };
        
        console.log('[LOGIN] Login attempt from browser:', browserInfo);

        // Check if user needs to verify OTP
        let response;
        try {
          response = await loginUser({ 
            identifier: formValues.username, 
            password: formValues.password,
            // Pass additional info for logging
            browserInfo 
          });
        } catch (err) {
          console.error("Error during login:", err);
          setIsLoading(false);
          setFormErrors({
            ...formErrors,
            password: err.message || "Failed to login",
          });
          return;
        }

        // User and token are already set in the loginUser function
        // This is redundant but kept for backward compatibility
        setUser(response.user);
        setToken(response.jwt);
        
        console.log("[LOGIN DEBUG] Login successful, determining redirect");
        console.log("[LOGIN DEBUG] User role info:", {
          role_type: response.user.role?.type,
          user_role: response.user.user_role
        });
        
        // Use the same hasRole function as the rest of the app
        const hasRole = useAuthStore.getState().hasRole;
        
        // Special handling for donation_admin since it's a common case
        if (response.user?.role?.type === 'donation_admin' || response.user?.user_role === 'donation_admin') {
          console.log("[LOGIN DEBUG] Donation Admin role detected directly, redirecting to donations");
          navigate("/newDonation");
        }
        // Standard role checks
        else if (hasRole(ROLES.SUPER_ADMIN)) {
          console.log("[LOGIN DEBUG] Super Admin role detected, redirecting to Super Admin Dashboard");
          navigate("/super-admin-dashboard");
        } else if (hasRole(ROLES.ADMIN)) {
          console.log("[LOGIN DEBUG] Admin role detected, redirecting to donations");
          navigate("/newDonation");
        } else if (hasRole(ROLES.DEEKSHA) || hasRole('deeksha')) {
          console.log("[LOGIN DEBUG] Deeksha role detected, redirecting to deeksha");
          navigate("/deeksha");
        } else if (hasRole(ROLES.DONATION) || hasRole(ROLES.DONATION_ADMIN)) {
          console.log("[LOGIN DEBUG] Donation role detected, redirecting to donations");
          navigate("/newDonation");
        } else if (hasRole(ROLES.GUEST_HOUSE)) {
          console.log("[LOGIN DEBUG] Guest House role detected, redirecting to dashboard");
          navigate("/dashboard");
        } else {
          console.log("[LOGIN DEBUG] Unknown role, showing error"); 
          console.log("[LOGIN DEBUG] Role data:", {
            role_object: response.user?.role,
            user_role: response.user?.user_role,
            has_donation_admin: hasRole(ROLES.DONATION_ADMIN)
          });
          setFormErrors({
            ...formErrors,
            password: "Invalid user role or permissions",
          });
        }
      } catch (error) {
        console.error("[LOGIN DEBUG] Login failed:", error);
        setFormErrors({
          ...formErrors,
          password: "Invalid username or password",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <div className="logo">
          <img
            width="150px"
            src="https://kamarpukur.rkmm.org/Logo%201-2.png"
            alt=""
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="User Name"
              disabled={isLoading}
              pattern="[a-zA-Z0-9_\.\s]+" // Updated HTML5 pattern validation to include spaces
              title="Username can only contain letters, numbers, dots, spaces, and underscores"
            />
            {formErrors.username && (
              <p className="error-text">{formErrors.username}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={isLoading}
                autocomplete="current-password"
              />
              <div className="forgot-password-link">
                <span
                  onClick={() => !isLoading && navigate('/forgot-password')}
                  style={{
                    cursor: isLoading ? 'default' : 'pointer',
                    color: '#ea7704',
                    fontSize: '14px',
                    textAlign: 'right',
                    display: 'block',
                    marginTop: '8px',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  Forgot Password?
                </span>
              </div>
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {showPassword ? (
                    // Eye open icon
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                      fill="#666666"
                    />
                  ) : (
                    // Eye closed icon
                    <path
                      d="M12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
                      fill="#666666"
                      opacity="0.3"
                    />
                  )}
                </svg>
              </button>
            </div>
            {formErrors.password && (
              <p className="error-text">{formErrors.password}</p>
            )}
          </div>
          <CommonButton
            buttonName={isLoading ? "Signing In..." : "Sign In"}
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
            }}
          />
        </form>
        <div className="signup-prompt">
          <p>
            Don't have an account?{" "}
            <span
              style={{
                cursor: "pointer",
                color: "#ea7704",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
