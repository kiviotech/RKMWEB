import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";
import icons from "../../../constants/icons";
import { useAuthStore } from "../../../../store/authStore";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import { cancelDonationReport } from "../../../pages/(loggedIn)/donation/cancelDonationReport";

const Header = ({ hideElements }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [showCancelDropdown, setShowCancelDropdown] = React.useState(false);

  // Add ref for dropdown container
  const dropdownRef = React.useRef(null);
  // Add ref for notification popup
  const notificationRef = React.useRef(null);
  const cancelDropdownRef = React.useRef(null);

  // Update effect to handle outside clicks for both dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
      if (
        cancelDropdownRef.current &&
        !cancelDropdownRef.current.contains(event.target)
      ) {
        setShowCancelDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userToken");
    navigate("/");
  };

  // Add handleExport function
  const handleExport = async (reportType) => {
    try {
      const response = await fetchDonations();
      const allDonations = Array.isArray(response)
        ? response
        : response.data || [];

      const donations = allDonations.filter((donation) => {
        const donationFor = donation.attributes.donationFor?.toUpperCase();
        return reportType === "MATH"
          ? donationFor === "MATH"
          : donationFor === "MISSION";
      });

      const htmlContent = cancelDonationReport(donations, reportType);

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
      <ul className="nav-links">
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
                {location.pathname === "/newDonation" && (
                  <button className="close-button" style={{ fontSize: "18px" }}>
                    &times;
                  </button>
                )}
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
                    location.hash === "#recent-donations")
                    ? "active"
                    : ""
                }
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/donation");
                  setTimeout(() => {
                    const element = document.getElementById("recent-donations");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                }}
              >
                Recent Donation
              </NavLink>
            </li>
            <li ref={cancelDropdownRef} className="dropdown-container">
              <NavLink
                to="#"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={(e) => {
                  e.preventDefault();
                  setShowCancelDropdown(!showCancelDropdown);
                }}
              >
                Canceled Donation
              </NavLink>
              {showCancelDropdown && (
                <div className="export-dropdown">
                  <button
                    className="export-option"
                    onClick={() => {
                      handleExport("MATH");
                      setShowCancelDropdown(false);
                    }}
                  >
                    Math Report
                  </button>
                  <button
                    className="export-option"
                    onClick={() => {
                      handleExport("MISSION");
                      setShowCancelDropdown(false);
                    }}
                  >
                    Mission Report
                  </button>
                </div>
              )}
            </li>
          </>
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
                    {location.pathname === "/check-in" && (
                      <button
                        className="close-button"
                        style={{ fontSize: "18px" }}
                      >
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
                      <button
                        className="close-button"
                        style={{ fontSize: "18px" }}
                      >
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
                      <button
                        className="close-button"
                        style={{ fontSize: "18px" }}
                      >
                        &times;
                      </button>
                    )}
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
