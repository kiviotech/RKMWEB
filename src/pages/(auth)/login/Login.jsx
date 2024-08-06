import React, { useState } from 'react';
import './Login.scss';
import { icons } from '../../../constants';
import CommonButton from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClick = () => {
        navigate('/check-in');
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
                        <label htmlFor="password">Password</label>
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
                    {/* <p className="assistive-text">Assistive text</p> */}
                    <CommonButton
                        buttonName="Sign In"
                        buttonWidth="100%"
                        style={{ backgroundColor: '#9866E9',fontSize: '16px', broderRadius: '16px', borderWidth: 0, padding: '10px 20px'  }}
                        onClick={handleClick}
                    />
                    {/* <button type="submit" className="sign-in-btn">Sign In</button> */}
                </form>
                <div className="or">OR <p>Sign In with</p></div>
                <div className="social-login">
                    <button className="social-btn google"><img src={icons.googleIcon} alt="google" /></button>
                    <button className="social-btn facebook"><img src={icons.facebookIcon} alt="facebook" /></button>
                    <button className="social-btn apple"><img src={icons.appleIcon} alt="apple" /></button>
                </div>
            </div>
        </div>
    );
}

export default Login;