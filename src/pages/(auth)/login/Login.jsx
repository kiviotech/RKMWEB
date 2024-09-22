import React, { useState } from "react";
import "./Login.scss";
import { icons } from "../../../constants";
import CommonButton from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../../services/auth"; // Assuming loginUser is in authService.js

const Login = () => {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formValues.password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Hide error message when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      try {
        // Make the login API call
        await loginUser({
          identifier: formValues.username,
          password: formValues.password,
        });
        navigate("/check-in");
      } catch (error) {
        // Handle API errors
        setFormErrors({
          ...formErrors,
          password: "Invalid username or password", // Set API error message
        });
      }
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <div className="logo">LOGO</div>
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
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
              >
                <img src={icons.eyeIcon} alt="password-toggler" />
              </button>
            </div>
            {formErrors.password && (
              <p className="error-text">{formErrors.password}</p>
            )}
          </div>
          <CommonButton
            buttonName="Sign In"
            buttonWidth="100%"
            style={{
              backgroundColor: "#9866E9",
              fontSize: "16px",
              borderRadius: "16px",
              borderWidth: 0,
              padding: "10px 20px",
            }}
          />
        </form>
        <div className="or">
          OR <p>Sign In with</p>
        </div>
        <div className="social-login">
          <button className="social-btn google">
            <img src={icons.googleIcon} alt="google" />
          </button>
          <button className="social-btn facebook">
            <img src={icons.facebookIcon} alt="facebook" />
          </button>
          <button className="social-btn apple">
            <img src={icons.appleIcon} alt="apple" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
