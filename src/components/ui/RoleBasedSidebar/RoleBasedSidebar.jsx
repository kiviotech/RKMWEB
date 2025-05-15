import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { icons } from "../../../constants";
import { useAuthStore } from "../../../../store/authStore";
import PermissionGuard from "../../guards/PermissionGuard";
import RoleGuard from "../../guards/RoleGuard";
import "./RoleBasedSidebar.scss";

const RoleBasedSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userToken");
    navigate("/");
  };

  // Define navigation items with permission/role requirements
  const navigationItems = [
    {
      path: "/dashboard",
      label: "Guest House",
      icon: icons.Home,
      permission: "guest.read",
      roles: ["super-admin", "admin", "guest-house"],
    },
    {
      path: "/newDonation",
      label: "Donations",
      icon: icons.Donation,
      permission: "donation.read",
      roles: ["super-admin", "admin", "donation"],
    },
    {
      path: "/deeksha",
      label: "Deeksha",
      icon: icons.Deeksha,
      permission: null, // No specific permission needed
      roles: ["super-admin", "admin", "deeksha"],
    },
    {
      path: "/coupons",
      label: "Meals",
      icon: icons.Frame,
      permission: null, // No specific permission needed
      roles: ["super-admin", "admin"],
    },
    {
      path: "/book-room-management",
      label: "Room Settings",
      icon: icons.settings,
      permission: "room.allocate",
      roles: ["super-admin", "admin", "guest-house"],
      onClick: (e) => {
        e.preventDefault();
        if (location.pathname === "/book-room-management") {
          if (typeof window.refreshBookRoomManagement === 'function') {
            window.refreshBookRoomManagement();
          }
        } else {
          navigate("/book-room-management");
        }
      },
    },
  ];

  // Admin-only settings
  const adminSettings = [
    {
      path: "/user-management",
      label: "User Management",
      icon: icons.userManage || icons.settings, 
      permission: "user.manage",
      roles: ["super-admin"],
    },
    {
      path: "/user-activity-dashboard",
      label: "Activity Dashboard",
      icon: icons.Dashboard || icons.settings, 
      permission: null,
      roles: ["super-admin"],
    },
    {
      path: "/user-activity-logs",
      label: "Activity Logs",
      icon: icons.settings, 
      permission: null,
      roles: ["super-admin"],
    },
    {
      path: "/system-settings",
      label: "System Settings",
      icon: icons.systemSettings || icons.settings,
      permission: "settings.access",
      roles: ["super-admin"],
    },
  ];

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
        className={`sidebar ${isDashboard ? "dashboard" : ""} ${isOpen ? "open" : ""}`}
      >
        <div className="close-btn" onClick={toggleSidebar}>
          <i className="fas fa-times"></i>
        </div>
        
        {/* User info section */}
        {user && (
          <div className="user-info">
            <div className="user-avatar">
              <img src={icons.userAvatar || icons.settings} alt="User" />
            </div>
            <div className="user-details">
              <div className="user-name">{user.username}</div>
              <div className="user-role">{user.role?.name || user.user_role}</div>
            </div>
          </div>
        )}

        {/* Navigation items based on permissions/roles */}
        <div className="nav-items">
          {navigationItems.map((item, index) => (
            <RoleGuard key={index} roles={item.roles}>
              <PermissionGuard permission={item.permission}>
                <NavLink 
                  to={item.path} 
                  activeclassname="active"
                  onClick={item.onClick}
                >
                  <img src={item.icon} alt={item.label.toLowerCase()} />
                  <span className="label">{item.label}</span>
                </NavLink>
              </PermissionGuard>
            </RoleGuard>
          ))}
        </div>

        {/* Admin settings section */}
        <RoleGuard roles={["super-admin", "admin"]}>
          <div className="admin-section">
            <div className="section-title">Administration</div>
            {adminSettings.map((item, index) => (
              <RoleGuard key={index} roles={item.roles}>
                <PermissionGuard permission={item.permission}>
                  <NavLink to={item.path} activeclassname="active">
                    <img src={item.icon} alt={item.label.toLowerCase()} />
                    <span className="label">{item.label}</span>
                  </NavLink>
                </PermissionGuard>
              </RoleGuard>
            ))}
          </div>
        </RoleGuard>

        {/* Logout button */}
        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            <img src={icons.logout || icons.settings} alt="logout" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RoleBasedSidebar;
