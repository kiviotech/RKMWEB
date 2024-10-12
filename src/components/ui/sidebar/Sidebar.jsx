import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { icons } from "../../../constants";

const Sidebar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className={`sidebar ${isDashboard ? "dashboard" : ""}`}>
      <NavLink to="/dashboard" activeclassname="active">
        <img src={icons.house} alt="home" />
        <span className="label">Guest House</span>
      </NavLink>
      <NavLink to="/donation" activeclassname="active">
        <img src={icons.rupee} alt="donation" />
        <span className="label" style={{ paddingTop: "5px" }}>
          Donations
        </span>
      </NavLink>
      <NavLink to="/details" activeclassname="active">
        <img src={icons.welcome} alt="welcome" />
        <span className="label">Deeksha</span>
      </NavLink>
      <NavLink to="/settings" className="settings" activeclassname="active">
        <img src={icons.settings} alt="settings" />
        <span className="label">Settings</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
