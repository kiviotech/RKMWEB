import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { icons } from "../../../constants";
import { useAuthStore } from "../../../../store/authStore";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <>
      <div className="hamburger" onClick={toggleSidebar}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-bars"></i>
        )}
      </div>
      <div
        className={`sidebar ${isDashboard ? "dashboard" : ""} ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="close-btn" onClick={toggleSidebar}>
          <i className="fas fa-times"></i>
        </div>
        <NavLink to="/dashboard" activeclassname="active">
          <img src={icons.Home} alt="home" />
          <span className="label">Guest House</span>
        </NavLink>
        <NavLink to="/newDonation" activeclassname="active">
          <img src={icons.Donation} alt="donation" />
          <span className="label" style={{ paddingTop: "5px" }}>
            Donations
          </span>
        </NavLink>
        <NavLink to="/deeksha" activeclassname="active">
          <img src={icons.Deeksha} alt="welcome" />
          <span className="label">Deeksha</span>
        </NavLink>
        <NavLink to="/coupons" activeclassname="active">
          <img src={icons.Frame} alt="welcome" />
          <span className="label">Meals</span>
        </NavLink>
        <NavLink
          to="/book-room-management"
          className="settings"
          activeclassname="active"
        >
          <img src={icons.settings} alt="settings" />
          <span className="label">Settings</span>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;
