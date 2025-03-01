import React, { useState, useEffect } from "react";
import "./Signup.scss";
import CommonButton from "../../../components/ui/Button";
import { icons } from "../../../constants";
import { signUpUser } from "../../../../services/auth"; // Adjust path if necessary
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUsers } from "../../../../services/src/services/userServices";

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

  const [isLoading, setIsLoading] = useState(false);

  const [existingUsers, setExistingUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const userData = await fetchUsers();
        setExistingUsers(userData);
        console.log("All Users Data:", userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getAllUsers();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateUsername = (value) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_\.\s]/g, '');
    if (value !== sanitizedValue) {
      setUsernameError("Only letters, numbers, dots, spaces, and underscores are allowed");
      return false;
    }
    if (value.trim() === "") {
      setUsernameError("Username is required");
      return false;
    }

    const usernameExists = existingUsers.some(
      user => user.username.toLowerCase() === value.toLowerCase()
    );
    if (usernameExists) {
      setUsernameError("Username already exists");
      return false;
    }

    setUsernameError("");
    return true;
  };

  const validateEmail = (value = email) => {
    // Basic email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format.");
      return false;
    }

    // Additional validation rules
    if (/^[0-9]+@/.test(value)) {
      setEmailError("Email cannot start with numbers only");
      return false;
    }

    if (/^[A-Z]+@/.test(value)) {
      setEmailError("Email cannot contain only uppercase letters");
      return false;
    }

    if (/[#$%^&*()+=\[\]{};':"\\|,<>\/?]+/.test(value)) {
      setEmailError("Email contains invalid special characters");
      return false;
    }

    const emailExists = existingUsers.some(
      user => user.email.toLowerCase() === value.toLowerCase()
    );
    if (emailExists) {
      setEmailError("Email already exists");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (/\s/.test(value)) {
      setPasswordError("Password cannot contain spaces");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    if (/\s/.test(value)) {
      setConfirmPasswordError("Password cannot contain spaces");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const isValidUsername = validateUsername(username);
    const isValidEmail = validateEmail();
    const isValidPassword = validatePassword(password);
    const isValidConfirmPassword = validateConfirmPassword(confirmPassword);

    if (!isValidUsername || !isValidEmail || !isValidPassword || !isValidConfirmPassword) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await signUpUser({ username, email, password });

      // Show success toast message
      toast.success("Sign up successful! Please login to continue.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Short delay before navigation to allow toast to be visible
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      setError("Sign-up failed. Please try again.");
      // Show error toast message
      toast.error("Sign up failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup">
      <div className="signup-box">
        <div className="logo">
          <img
            width="150px"
            src="https://kamarpukur.rkmm.org/Logo%201-2.png"
            alt=""
          />
        </div>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="username">
              Username <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              value={username}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9_\.\s]/g, '');
                setUsername(sanitizedValue);
                validateUsername(sanitizedValue);
              }}
              onBlur={() => validateUsername(username)}
              pattern="[a-zA-Z0-9_\.\s]+"
              title="Username can only contain letters, numbers, dots, spaces, and underscores"
              required
              disabled={isLoading}
            />
            {usernameError && <p className="error-message">{usernameError}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="email">
              Email <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                validateEmail(newEmail);
              }}
              onBlur={() => validateEmail(email)}
              required
              disabled={isLoading}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="input-group">
            <div className="filed-tip">
              <label htmlFor="password">
                Password <span style={{ color: 'red' }}>*</span>
              </label>
              {/* <img src={icons.fieldTip} alt="fieldTip" /> */}
            </div>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/\s/g, '');
                  setPassword(sanitizedValue);
                  validatePassword(sanitizedValue);
                  if (confirmPassword) {
                    validateConfirmPassword(confirmPassword);
                  }
                }}
                onBlur={() => validatePassword(password)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {showPassword ? (
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                      fill="#666666"
                    />
                  ) : (
                    <path
                      d="M12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
                      fill="#666666"
                      opacity="0.3"
                    />
                  )}
                </svg>
              </button>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <div className="input-group">
            <div className="filed-tip">
              <label htmlFor="ConfirmPassword">
                Confirm Password <span style={{ color: 'red' }}>*</span>
              </label>
              {/* <img src={icons.fieldTip} alt="fieldTip" /> */}
            </div>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="ConfirmPassword"
                name="ConfirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/\s/g, '');
                  setConfirmPassword(sanitizedValue);
                  validateConfirmPassword(sanitizedValue);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={toggleConfirmPasswordVisibility}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {showConfirmPassword ? (
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                      fill="#666666"
                    />
                  ) : (
                    <path
                      d="M12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5ZM12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
                      fill="#666666"
                      opacity="0.3"
                    />
                  )}
                </svg>
              </button>
            </div>
            {confirmPasswordError && (
              <p className="error-message">{confirmPasswordError}</p>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}

          <CommonButton
            buttonName={isLoading ? "Signing Up..." : "Sign Up"}
            buttonWidth="100%"
            style={{
              backgroundColor: "#ea7704",
              fontSize: "16px",
              borderRadius: "16px",
              borderWidth: 0,
              padding: "10px 20px",
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onClick={handleSignup}
            disabled={isLoading}
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
                color: "#ea7704",
                fontWeight: "bold",
              }}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
