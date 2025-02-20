import React, { useState, useRef, useEffect } from "react";
import "./CheckInDetailsHeader.scss";

const CheckInDetailsHeader = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("today");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="check-in-details-header">
      <button
        className={`tab-button ${
          activeTab === "today" ? "active" : "inactive"
        }`}
        onClick={() => handleTabChange("today")}
      >
        Today's Arrival Guest
      </button>
      <button
        className={`tab-button ${
          activeTab === "tomorrow" ? "active" : "inactive"
        }`}
        onClick={() => handleTabChange("tomorrow")}
      >
        Tomorrow's Arrival Guest
      </button>

      <div className="print-section">
        <select defaultValue="all">
          <option value="all">All</option>
          {/* Add more options as needed */}
        </select>
        <div className="print-dropdown-container" ref={dropdownRef}>
          <button
            className="print-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Print Report
            <span>▼</span>
          </button>
          {showDropdown && (
            <div className="print-dropdown">
              <button onClick={() => console.log("Today's Arrival Guest")}>
                Today's Arrival Guest
              </button>
              <button onClick={() => console.log("Tomorrow's Arrival Guest")}>
                Tomorrow's Arrival Guest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInDetailsHeader;
