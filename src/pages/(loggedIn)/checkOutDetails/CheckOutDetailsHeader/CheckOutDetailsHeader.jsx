import React, { useState, useRef, useEffect } from "react";

const CheckOutDetailsHeader = () => {
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

  return (
    <div className="check-in-details-header">
      <button
        className={`tab-button ${
          activeTab === "today" ? "active" : "inactive"
        }`}
        onClick={() => setActiveTab("today")}
      >
        Today's Leaving Guest
      </button>
      <button
        className={`tab-button ${
          activeTab === "tomorrow" ? "active" : "inactive"
        }`}
        onClick={() => setActiveTab("tomorrow")}
      >
        Tomorrow's Leaving Guest
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
              <button onClick={() => console.log("Today's Leaving Guest")}>
                Today's Leaving Guest
              </button>
              <button onClick={() => console.log("Tomorrow's Leaving Guest")}>
                Tomorrow's Leaving Guest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOutDetailsHeader;
