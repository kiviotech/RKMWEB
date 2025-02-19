import React, { useState } from "react";
import "./CheckInDetailsHeader.scss";

const CheckInDetailsHeader = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="check-in-details-header">
      <button
        className={`tab-button ${
          activeTab === "today" ? "active" : "inactive"
        }`}
        onClick={() => setActiveTab("today")}
      >
        Today's Arrival Guest
      </button>
      <button
        className={`tab-button ${
          activeTab === "tomorrow" ? "active" : "inactive"
        }`}
        onClick={() => setActiveTab("tomorrow")}
      >
        Tomorrow's Arrival Guest
      </button>

      <div className="print-section">
        <select defaultValue="all">
          <option value="all">All</option>
          {/* Add more options as needed */}
        </select>
        <div className="print-dropdown-container">
          <button
            className="print-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Print Report
            <span>▼</span>
          </button>
          {showDropdown && (
            <div className="print-dropdown">
              <button onClick={() => console.log("Print PDF")}>
                Today’s Arrival Guest
              </button>
              <button onClick={() => console.log("Print Excel")}>
                Tomorrow’s Arrival Guest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInDetailsHeader;
