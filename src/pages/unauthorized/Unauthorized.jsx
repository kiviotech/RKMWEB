import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import "./Unauthorized.scss";

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const from = location.state?.from?.pathname || "/dashboard";

  // Determine appropriate redirect based on user role
  const getRedirectPath = () => {
    if (!user) return "/login";
    
    switch (user.user_role) {
      case "super-admin":
      case "admin":
        return "/dashboard";
      case "donation":
        return "/newDonation";
      case "guest-house":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate(getRedirectPath());
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="icon-container">
          <i className="fas fa-lock"></i>
        </div>
        <h1>Access Denied</h1>
        <p>
          You don't have permission to access this page. This area is restricted
          based on your current role and permissions.
        </p>
        <div className="user-info">
          <p>
            <strong>Username:</strong> {user?.username || "Not logged in"}
          </p>
          <p>
            <strong>Role:</strong> {user?.role?.name || user?.user_role || "None"}
          </p>
        </div>
        <div className="actions">
          <button className="back-button" onClick={handleGoBack}>
            Go Back
          </button>
          <button className="home-button" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
        <p className="contact-info">
          If you believe you should have access to this page, please contact the
          system administrator.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
