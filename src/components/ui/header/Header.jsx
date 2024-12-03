import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";
import icons from "../../../constants/icons";
import { useAuthStore } from "../../../../store/authStore";

const Header = ({ hideElements }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);

  // Add ref for dropdown container
  const dropdownRef = React.useRef(null);
  // Add ref for notification popup
  const notificationRef = React.useRef(null);

  // Update effect to handle outside clicks for both dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={icons.RMK_Logo} alt="Logo" />
      </div>
      <ul className="nav-links">  
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        {/* Conditionally render Home, Check-in, Check-out, and Requests based on hideElements prop */}
        {!hideElements && (
          <>
            <li>
              <NavLink
                to="/check-in"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Check-in Details
                {location.pathname === "/check-in" && (
                  <button className="close-button" style={{ fontSize: "18px" }}>
                    &times;
                  </button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/check-out"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Check-out Details
                {location.pathname === "/check-out" && (
                  <button className="close-button" style={{ fontSize: "18px" }}>
                    &times;
                  </button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Requests"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Requests
                {location.pathname === "/Requests" && (
                  <button className="close-button" style={{ fontSize: "18px" }}>
                    &times;
                  </button>
                )}
              </NavLink>
            </li>
          </>
        )}

        {/* Allocate Rooms item, shown conditionally based on path */}
        {location.pathname === "/book-room" && (
          <li>
            <NavLink
              to="/book-room"
              className={({ isActive }) =>
                isActive ||
                  location.pathname === "/approve-guests" ||
                  location.pathname === "/book-room"
                  ? "active"
                  : ""
              }
            >
              Allocate rooms
              {(location.pathname === "/approve-guests" ||
                location.pathname === "/book-room") && (
                  <button className="close-button" style={{ fontSize: "18px" }}>
                    &times;
                  </button>
                )}
            </NavLink>
          </li>
        )}
      </ul>
      <div className="notification-icon">
        <div className="notification-container" ref={notificationRef}>
          <img
            className="notification"
            src={icons.notification}
            alt="Notifications"
            onClick={() => setShowNotification(!showNotification)}
          />
          {showNotification && (
            <div className="notification-popup">
              <p>No notifications</p>
            </div>
          )}
        </div>
        <div className="user-profile" ref={dropdownRef}>
          <img 
            className="user-image" 
            src={icons.dummyUser} 
            alt="User" 
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
