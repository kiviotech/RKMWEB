import React, { useState } from "react";
import "./Login.scss";
import { icons } from "../../../constants";
import CommonButton from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../../services/auth";
import { useAuthStore } from "../../../../store/authStore";
import RMK from "../../../assets/image/RMK_Logo.png"

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
        setIsLoading(true);
        const response = await loginUser({
          identifier: formValues.username,
          password: formValues.password,
        });

        setUser(response.user);
        setToken(response.jwt);

        if (response.user.user_role === "admin") {
          navigate("/dashboard");
        } else if (response.user.user_role === "deeksha") {
          navigate("/deeksha");
        } else {
          setFormErrors({
            ...formErrors,
            password: "Invalid user role or permissions",
          });
        }
      } catch (error) {
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
          <img src={RMK} alt="RMK Logo" />
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
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                <img src={icons.eyeIcon} alt="password-toggler" />
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
              backgroundColor: "#EA7704",
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
            Don’t have an account?{" "}
            <span
              style={{
                cursor: "pointer",
                color: "#EA7704",
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
