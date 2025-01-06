import React, { useEffect, useLayoutEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  // Add this function to show success toast
  const showSuccessToast = () => {
    toast.success("Donation created successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Add this function to check if transaction details should be shown
  const shouldShowTransactionDetails = () => {
    const currentSection = activeTab.toLowerCase();
    const currentDonationDetails =
      donationStore.donorTabs[activeTabId][currentSection].donationDetails;
    const transactionType = currentDonationDetails?.transactionType || "Cash";

    return ["Cheque", "Bank Transfer", "DD"].includes(transactionType);
  };

  return (
    <div>
      <ToastContainer />
      <DonationHeader onTabChange={setActiveTab} />
      <div className="container" style={containerStyle}>
        <div style={leftSectionStyle}>
          <DonorDetails activeTab={activeTab} />
          <DonationAction
            activeTab={activeTab}
            transactionType={transactionType}
            onDonationSuccess={showSuccessToast}
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
