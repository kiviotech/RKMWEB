import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { icons } from "../../../constants";
import { useAuthStore } from "../../../../store/authStore";
import { ROLES } from "../../../constants/permissions";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const { logout, hasRole, user } = useAuthStore((state) => ({
    logout: state.logout,
    hasRole: state.hasRole,
    user: state.user
  }));

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userToken");
    navigate("/");
  };

  // Navigation items with role-based access control
  const navigationItems = [
    {
      to: "/dashboard",
      icon: icons.Home,
      alt: "home",
      label: "Guest House",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.GUEST_HOUSE],
      onClick: null
    },
    {
      to: "/newDonation",
      icon: icons.Donation,
      alt: "donation",
      label: "Donations",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DONATION],
      style: { paddingTop: "5px" },
      onClick: null
    },
    {
      to: "/deeksha",
      icon: icons.Deeksha,
      alt: "welcome",
      label: "Deeksha",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      onClick: null
    },
    {
      to: "/coupons",
      icon: icons.Frame,
      alt: "welcome",
      label: "Meals",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      onClick: null
    },
    {
      to: "/user-management",
      icon: icons.User || icons.settings, // Use a user icon if available, otherwise fallback to settings
      alt: "users",
      label: "User Management",
      roles: [ROLES.SUPER_ADMIN], // Only super admins can manage users
      onClick: null
    },
    {
      to: "/book-room-management",
      icon: icons.settings,
      alt: "settings",
      label: "Settings",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.GUEST_HOUSE],
      className: "settings",
      onClick: (e) => {
        e.preventDefault();
        if (location.pathname === "/book-room-management") {
          if (typeof window.refreshBookRoomManagement === 'function') {
            window.refreshBookRoomManagement();
          }
        } else {
          navigate("/book-room-management");
        }
      }
    }
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
        className={`sidebar ${isDashboard ? "dashboard" : ""} ${isOpen ? "open" : ""
          }`}
      >
        <div className="close-btn" onClick={toggleSidebar}>
          <i className="fas fa-times"></i>
        </div>
        
        {/* User info section */}
        {user && (
          <div className="user-info">
            <div className="user-name">{user.username}</div>
            <div className="user-role">{user.role?.name || 'User'}</div>
          </div>
        )}
        
        {/* Role-based navigation items */}
        {navigationItems.map((item, index) => {
          // Only show navigation items for roles the user has
          const hasAccess = item.roles.some(role => hasRole(role));
          
          if (!hasAccess) return null;
          
          return (
            <NavLink 
              key={index} 
              to={item.to} 
              activeclassname="active"
              className={item.className || ''}
              onClick={item.onClick}
            >
              <img src={item.icon} alt={item.alt} />
              <span className="label" style={item.style}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
