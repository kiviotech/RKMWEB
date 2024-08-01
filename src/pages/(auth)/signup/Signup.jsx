import React, { useState } from 'react';
import './Signup.scss';
import CommonButton from '../../../components/ui/Button';
import { icons } from '../../../constants';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="login">
      <div className="login-box">
        <div className="logo">LOGO</div>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="User Name" />
          </div>
          <div className="input-group">
            <div className='filed-tip'>
              <label htmlFor="password">Password</label>
              <img src={icons.fieldTip} alt="fieldTip" />
            </div>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
              />
              <button type="button" className="show-password-btn" onClick={togglePasswordVisibility}>
                <img src={icons.eyeIcon} alt="password-toggler" />
              </button>
            </div>
          </div>

          <div className="input-group">
            <div className='filed-tip'>
              <label htmlFor="ConfirmPassword">Confirm Password</label>
              <img src={icons.fieldTip} alt="fieldTip" />
            </div>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="ConfirmPassword"
                name="ConfirmPassword"
                placeholder="Confirm Password"
              />
              <button type="button" className="show-password-btn" onClick={toggleConfirmPasswordVisibility}>
                <img src={icons.eyeIcon} alt="password-toggler" />
              </button>
            </div>
          </div>
          {/* <p className="assistive-text">Assistive text</p> */}
          <CommonButton
            buttonName="Sign Up"
            buttonWidth="100%"
            style={{ backgroundColor: '#9866E9' }}
            onClick={handleClick}
          />
          {/* <button type="submit" className="sign-in-btn">Sign In</button> */}
        </form>
        <div className="or">OR <p>Sign Up with</p></div>
        <div className="social-login">
          <button className="social-btn google"><img src={icons.googleIcon} alt="google" /></button>
          <button className="social-btn facebook"><img src={icons.facebookIcon} alt="facebook" /></button>
          <button className="social-btn apple"><img src={icons.appleIcon} alt="apple" /></button>
        </div>
      </div>
    </div>
  );
};

export default Signup;