import React, { useState, useEffect } from "react";
import "./DonationHeader.scss";
import useDonationStore from "../../../../donationStore";
import { useAuthStore } from "../../../../store/authStore";
import { fetchReceiptDetails } from "../../../../services/src/services/receiptDetailsService";

const DonationHeader = ({ onTabChange }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const {
    donorTabs,
    activeTabId,
    addNewDonorTab,
    setActiveTab,
    setActiveSection,
    removeDonorTab,
    nextReceiptNumbers,
    fetchLatestReceiptNumbers,
    clearInitializedData,
  } = useDonationStore();

  // Add auth store
  const { user } = useAuthStore();

  // Convert donorTabs object to array for rendering
  const donorTabsArray = Object.keys(donorTabs)
    .sort((a, b) => Number(a) - Number(b))
    .map((id, index) => {
      const tab = donorTabs[id];
      const activeSection = tab.activeSection;
      const donorDetails = tab[activeSection]?.donorDetails;

      // Debug logs
      console.log("Tab ID:", id);
      console.log("Active Section:", activeSection);
      console.log("Donor Details:", donorDetails);
      console.log("Title:", donorDetails?.title);
      console.log("Name:", donorDetails?.name);

      return {
        id: Number(id),
        label: donorDetails?.name
          ? `${donorDetails?.title || ""} ${donorDetails?.name}`.trim()
          : `New Donor ${index + 1}`,
      };
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchLatestReceiptNumbers();
  }, []);

  useEffect(() => {
    console.log("Next Available MT Number: MT", nextReceiptNumbers.mtNumber);
    console.log("Next Available MSN Number: MSN", nextReceiptNumbers.msnNumber);
  }, [nextReceiptNumbers]);

  const handleTabChange = (section) => {
    if (!isCompleted) {
      // Only allow tab changes if not completed
      setActiveSection(activeTabId, section.toLowerCase());
      onTabChange(section);
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleAddDonation = () => {
    // Check if we already have 5 donor tabs
    if (Object.keys(donorTabs).length < 5) {
      addNewDonorTab();
    }
  };

  const handleRemoveDonor = (id) => {
    const isInitializedTab =
      donorTabs[id]?.[donorTabs[id]?.activeSection]?.donationDetails
        ?.donationId;

    if (isInitializedTab) {
      // If it's an initialized tab, just clear the data
      clearInitializedData(id);
    } else if (Object.keys(donorTabs).length > 1) {
      // Otherwise, remove the tab if it's not the last one
      removeDonorTab(id);
    }
  };

  const activeTab = donorTabs[activeTabId] || initialTabState;
  const currentReceiptNumber =
    activeTab?.receiptNumbers?.[activeTab?.activeSection] || "";

  // Get the current tab's donation status
  const isCompleted =
    donorTabs[activeTabId]?.[donorTabs[activeTabId]?.activeSection]
      ?.donationDetails?.status === "completed" ||
    donorTabs[activeTabId]?.[donorTabs[activeTabId]?.activeSection]
      ?.donationDetails?.status === "pending";

  const handleReset = () => {
    // Clear the data for the active tab
    clearInitializedData(activeTabId);
  };

  return (
    <div className="atth-donation-wrapper">
      <div className="atth-donation-header">
        <div className="atth-header-left">
          <h2 className="atth-header-title">New Donation</h2>
          <div className="atth-header-actions">
            <div
              className="atth-donor-tabs"
              style={{ flexWrap: "wrap", maxHeight: "80px", overflowY: "auto" }}
            >
              {donorTabsArray.map((tab) => {
                const isTabCompleted =
                  donorTabs[tab.id]?.[donorTabs[tab.id]?.activeSection]
                    ?.donationDetails?.status === "completed";

                return (
                  <button
                    key={tab.id}
                    className={`atth-btn-donor ${
                      activeTabId === tab.id ? "active" : ""
                    }`}
                    style={{
                      fontSize: "0.95rem",
                      margin: "4px",
                      whiteSpace: "nowrap",
                      backgroundColor: activeTabId === tab.id ? "#eb831c" : "",
                      color: activeTabId === tab.id ? "#fff" : "",
                      cursor: "pointer",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveDonor(tab.id);
                      }}
                      style={{ marginLeft: "8px" }}
                    >
                      ×
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              className="atth-btn-add"
              style={{
                fontSize: "0.95rem",
                marginLeft: "12px",
                alignSelf: "flex-start",
                // Add cursor style and opacity when max limit is reached
                cursor:
                  Object.keys(donorTabs).length >= 5
                    ? "not-allowed"
                    : "pointer",
                opacity: Object.keys(donorTabs).length >= 5 ? 0.7 : 1,
              }}
              onClick={handleAddDonation}
              // Optionally disable the button when limit is reached
              disabled={Object.keys(donorTabs).length >= 5}
            >
              + Add Donation
            </button>
          </div>
        </div>

        <div className="atth-header-right">
          <div className="atth-info-group">
            <span className="atth-label">COUNTER NO.</span>
            <span className="atth-value">
              {user?.counter?.replace("Counter ", "") === "3"
                ? "admin"
                : user?.counter?.replace("Counter ", "") || "N/A"}
            </span>
          </div>
          <div className="atth-info-group">
            <span className="atth-label">USER</span>
            <span className="atth-value">{user?.username || "N/A"}</span>
          </div>
          <div className="atth-info-group">
            <span className="atth-label">DATE & TIME</span>
            <span className="atth-value">
              {formatDateTime(currentDateTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="atth-donation-subheader">
        <div className="atth-subheader-left">
          <div className="atth-tab-group">
            <button
              className={`atth-tab ${
                donorTabs[activeTabId].activeSection === "math"
                  ? "atth-active"
                  : ""
              }`}
              onClick={() => handleTabChange("Math")}
              data-tab="math"
              style={{
                cursor: isCompleted ? "not-allowed" : "pointer",
                opacity: isCompleted ? 0.7 : 1,
              }}
            >
              Math
            </button>
            <button
              className={`atth-tab ${
                donorTabs[activeTabId].activeSection === "mission"
                  ? "atth-active"
                  : ""
              }`}
              onClick={() => handleTabChange("Mission")}
              data-tab="mission"
              style={{
                cursor: isCompleted ? "not-allowed" : "pointer",
                opacity: isCompleted ? 0.7 : 1,
              }}
            >
              Mission
            </button>
          </div>
          <div className="atth-receipt-info">
            <span>Receipt Number: </span>
            <span className="atth-receipt-number">{currentReceiptNumber}</span>
          </div>
        </div>
        {!isCompleted && (
          <button className="atth-btn-reset" onClick={handleReset}>
            ↻ Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default DonationHeader;
