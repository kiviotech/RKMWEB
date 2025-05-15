import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";
import icons from "../../../constants/icons";
import { useAuthStore } from "../../../../store/authStore";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import { cancelDonationReport } from "../../../pages/(loggedIn)/donation/cancelDonationReport";
import notificationService from "../../../../services/notificationService";
import { format } from "date-fns";

const Header = ({ hideElements }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Add ref for notification popup
  const notificationRef = useRef(null);

  // Fetch notifications on component mount and when notification popup is opened
  useEffect(() => {
    // Only fetch notifications for users who can see them (super-admin)
    if (user?.role?.type === 'super-admin' || user?.user_role === 'super-admin') {
      fetchNotifications();
      
      // Set up polling to check for new notifications every minute
      const intervalId = setInterval(() => {
        fetchNotifications(false); // Silent refresh (don't show loading state)
      }, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);
  
  // Refresh notifications when popup is opened
  useEffect(() => {
    if (showNotification) {
      fetchNotifications();
    }
  }, [showNotification]);
  
  // Function to fetch notifications
  const fetchNotifications = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const result = await notificationService.getNotifications({
        sort: 'createdAt:desc',
        pagination: { page: 1, pageSize: 10 }
      });
      
      if (result.success) {
        setNotifications(result.notifications || []);
        const unread = (result.notifications || []).filter(n => !n.attributes.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      // Update local state to reflect the change
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? 
          { ...notification, attributes: { ...notification.attributes, isRead: true } } : 
          notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Handle notification click - mark as read and navigate if needed
  const handleNotificationClick = (notification) => {
    if (!notification.attributes.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate based on resourceType and resourceId if available
    const { resourceType, resourceId } = notification.attributes;
    if (resourceType === 'donation' && resourceId) {
      navigate(`/allDonation?donationId=${resourceId}`);
      setShowNotification(false);
    }
  };
  
  // Update effect to handle outside clicks for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
      if (isMobileMenuOpen && !event.target.closest(".navbar")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userToken");
    navigate("/");
  };

  // Update handleExport function to not require reportType
  const handleExport = async () => {
    try {
      const response = await fetchDonations();
      const allDonations = Array.isArray(response)
        ? response
        : response.data || [];

      const htmlContent = cancelDonationReport(allDonations, "ALL");

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      iframe.contentWindow.document.write(htmlContent);
      iframe.contentWindow.document.close();

      iframe.onload = function () {
        try {
          iframe.contentWindow.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (error) {
          console.error("Print error:", error);
        }
      };
    } catch (error) {
      console.error("Error printing donations:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={icons.RMK_Logo} alt="Logo" />
      </div>

      <button
        className="menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      <ul className={`nav-links ${isMobileMenuOpen ? "show" : ""}`}>
        {location.pathname === "/newDonation" ||
          location.pathname === "/allDonationDetails" ||
          location.pathname === "/donation" ? (
          // New donation and Donation path navigation items
          <>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/newDonation"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                New Donation
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/donation#tomorrows-guests"
                className={({ isActive }) =>
                  (isActive && location.hash === "#tomorrows-guests") ||
                    (location.pathname === "/donation" &&
                      location.hash === "#tomorrows-guests")
                    ? "active"
                    : location.pathname === "/donation"
                      ? "active"
                      : ""
                }
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/donation");
                  setTimeout(() => {
                    const element = document.getElementById("tomorrows-guests");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                }}
              >
                Tomorrow Leaving Guest
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/donation#recent-donations"
                className={({ isActive }) =>
                  (isActive && location.hash === "#recent-donations") ||
                    (location.pathname === "/donation" &&
                      location.hash === "#recent-donations") ||
                    location.pathname === "/allDonationDetails"
                    ? "active"
                    : ""
                }
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/allDonationDetails");
                  setTimeout(() => {
                    const element = document.getElementById("recent-donations");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                }}
              >
                Reports
              </NavLink>
            </li>
          </>
        ) : location.pathname.startsWith("/book-room-management") ||
          location.pathname === "/calendar" ? (
          // Settings section navigation items
          <>
            {/* <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Profile
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/book-room-management"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Rooms
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/calendar"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Calendar
              </NavLink>
            </li>
          </>
        ) : location.pathname === "/coupons" ? (
          // Coupons navigation item
          <li>
            <NavLink
              to="/coupons"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Coupons
            </NavLink>
          </li>
        ) : (
          // Original navigation items
          <>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            {/* Conditionally render other navigation items */}
            {!hideElements && (
              <>
                <li>
                  <NavLink
                    to="/check-in"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Check-in Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/check-out"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Check-out Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Requests"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Requests
                  </NavLink>
                </li>
              </>
            )}

            {/* Allocate Rooms item */}
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
                      <button
                        className="close-button"
                        style={{ fontSize: "18px" }}
                      >
                        &times;
                      </button>
                    )}
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>
      <div className="notification-icon">
        <div className="notification-container" ref={notificationRef}>
          <div className="notification-badge-container">
            <img
              className="notification"
              src={icons.notification}
              alt="Notifications"
              onClick={() => setShowNotification(!showNotification)}
            />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </div>
          {showNotification && (
            <div className="notification-popup">
              <div className="notification-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    className="view-all-btn"
                    onClick={() => navigate('/notifications')}
                  >
                    View All
                  </button>
                )}
              </div>
              <div className="notification-content">
                {isLoading ? (
                  <p className="notification-loading">Loading...</p>
                ) : notifications.length === 0 ? (
                  <p className="no-notifications">No notifications</p>
                ) : (
                  <ul className="notification-list">
                    {notifications.map((notification) => (
                      <li 
                        key={notification.id} 
                        className={`notification-item ${!notification.attributes.isRead ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                        title={notification.attributes.message}
                      >
                        <div className="notification-details">
                          <h4>{notification.attributes.title}</h4>
                          <p>{notification.attributes.message}</p>
                          <span className="notification-time">
                            {notification.attributes.createdAt 
                              ? format(new Date(notification.attributes.createdAt), 'MMM dd, HH:mm') 
                              : 'Just now'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="user-profile">
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
