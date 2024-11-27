import React, { useState } from "react";
import "./Signup.scss";
import CommonButton from "../../../components/ui/Button";
import { icons } from "../../../constants";
import { signUpUser } from "../../../../services/auth"; // Adjust path if necessary
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateUsername = () => {
    if (username.trim() === "") {
      setUsernameError("Username is required.");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const isValidUsername = validateUsername();
    const isValidEmail = validateEmail();
    const isValidPassword = validatePassword();
    const isValidConfirmPassword = validateConfirmPassword();

    if (
      !isValidUsername ||
      !isValidEmail ||
      !isValidPassword ||
      !isValidConfirmPassword
    ) {
      return;
    }

    try {
      const response = await signUpUser({ username, email, password });
      console.log("Sign-up successful", response);

      // Redirect to login page after successful sign-up
      navigate("/");
    } catch (err) {
      console.error("Error during sign-up:", err);
      setError("Sign-up failed. Please try again.");
    }
  };

  return (
    <div className="signup">
      <div className="signup-box">
        <div className="logo">LOGO</div>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameError) validateUsername();
              }}
              onBlur={validateUsername}
              required
            />
            {usernameError && <p className="error-message">{usernameError}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail();
              }}
              onBlur={validateEmail}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="input-group">
            <div className="filed-tip">
              <label htmlFor="password">Password</label>
              <img src={icons.fieldTip} alt="fieldTip" />
            </div>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword();
                }}
                onBlur={validatePassword}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
              >
                <img src={icons.eyeIcon} alt="password-toggler" />
              </button>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <div className="input-group">
            <div className="filed-tip">
              <label htmlFor="ConfirmPassword">Confirm Password</label>
              <img src={icons.fieldTip} alt="fieldTip" />
            </div>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="ConfirmPassword"
                name="ConfirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) validateConfirmPassword();
                }}
                onBlur={validateConfirmPassword}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={toggleConfirmPasswordVisibility}
              >
                <img src={icons.eyeIcon} alt="password-toggler" />
              </button>
            </div>
            {confirmPasswordError && (
              <p className="error-message">{confirmPasswordError}</p>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}

          <CommonButton
            buttonName="Sign Up"
            buttonWidth="100%"
            style={{
              backgroundColor: "#9866E9",
              fontSize: "16px",
              borderRadius: "16px",
              borderWidth: 0,
              padding: "10px 20px",
            }}
            onClick={handleSignup}
          />
        </form>
        <div className="already-account">
          <p>
            {" "}
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              style={{
                cursor: "pointer",
                color: "#9866E9",
                fontWeight: "bold",
              }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
