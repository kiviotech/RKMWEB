import React, { useEffect, useLayoutEffect, useState } from "react";
import DonationHeader from "./DonationHeader";
import DonorDetails from "./DonorDetails";
import Details from "./Details";
import DonationAction from "./DonationAction";
import DonationHistory from "./DonationHistory";
import TransactionDetails from "./TransactionDetails";
import useDonationStore from "../../../../donationStore";
import { useAuthStore } from "../../../../store/authStore";
import { BiBorderAll } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import "./Toast.scss";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const NewDonation = () => {
  const { initializeFromDonationData } = useDonationStore();
  const location = useLocation();
  const donationStore = useDonationStore();
  const { activeTabId, setActiveSection } = donationStore;
  console.log("Full Donation Store State:", donationStore);
  console.log("Active Tab ID:", activeTabId);
  console.log("Donor Tabs:", donationStore.donorTabs);

  const [activeTab, setActiveTab] = useState("Math");
  const [transactionType, setTransactionType] = useState("Cash");
  const [isMobile, setIsMobile] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  // Listen for screen size changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1400px)");
    const handleMediaChange = () => setIsMobile(mediaQuery.matches);

    // Initial check
    handleMediaChange();

    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    const donationData = location.state?.donationData;
    console.log("NewDonation - Received donation data:", donationData);
    if (donationData) {
      initializeFromDonationData(donationData);
      // Set the transaction type from the donation data
      if (donationData.donationDetails?.transactionType) {
        setTransactionType(donationData.donationDetails.transactionType);
      }
    }
  }, [location.state, initializeFromDonationData]);

  // Add message display timeout handler
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Message will disappear after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const containerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",

    gap: "20px",

    margin: isMobile ? "10px" : "0",
  };

  const leftSectionStyle = {
    width: isMobile ? "100%" : "70%",
  };

  const rightSectionStyle = {
    width: isMobile ? "100%" : "30%",
  };

  // Add this function to check if transaction details should be shown
  const shouldShowTransactionDetails = () => {
    const currentSection = activeTab.toLowerCase();
    const currentDonationDetails =
      donationStore.donorTabs[activeTabId][currentSection].donationDetails;
    const transactionType = currentDonationDetails?.transactionType || "Cash";

    return ["Cheque", "Bank Transfer", "DD"].includes(transactionType);
  };

  const handleCloseToast = () => {
    setIsExiting(true);
    setTimeout(() => {
      setSuccessMessage("");
      setIsExiting(false);
    }, 400); // Match this with animation duration
  };

  return (
    <div>
      {successMessage && (
        <div
          className={`toast-notification success ${
            isExiting ? "hide" : "show"
          }`}
        >
          <div className="toast-content">
            <FaCheckCircle className="toast-icon" />
            <span className="toast-message">{successMessage}</span>
          </div>
          <IoClose className="toast-close" onClick={handleCloseToast} />
        </div>
      )}
      <DonationHeader onTabChange={setActiveTab} />
      <div className="container" style={containerStyle}>
        <div style={leftSectionStyle}>
          <DonorDetails activeTab={activeTab} />
          <DonationAction
            activeTab={activeTab}
            transactionType={transactionType}
            onDonationSuccess={() =>
              setSuccessMessage("Donation created successfully!")
            }
          />
        </div>
        <div style={rightSectionStyle}>
          <Details
            activeTab={activeTab}
            onTransactionTypeChange={setTransactionType}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
          marginTop: "15px",
        }}
      >
        <div style={leftSectionStyle}>
          <DonationHistory />
        </div>
        <div
          style={{
            ...rightSectionStyle,
            alignItems: "center",
          }}
        >
          {shouldShowTransactionDetails() && (
            <TransactionDetails activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDonation;
