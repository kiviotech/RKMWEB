import React, { useState, useEffect } from "react";
import "./Details.scss";
import useDonationStore from "../../../../donationStore";

const Details = ({ activeTab, onTransactionTypeChange }) => {
  const mathOptions = [
    "Thakur Seva",
    "Sadhu Seva",
    "Nara Narayan Seva",
    "General Fund for Various Activities",
    "Welfare Fund",
    "Thakur's Tithi Puja Celebrations",
    "Holy Mother's Tithi Puja Celebrations",
    "Swamiji Tithi Puja Celebrations",
    "Other",
  ];

  const missionOptions = [
    "Helping Poor Students",
    "Rural Development Fund",
    "Welfare Fund",
    "General Fund for Various Activities",
    "All Round Child Development Project",
    "Charitable Dispensary & Eye (Day) Care Centre",
    "Other",
  ];

  const {
    donorTabs,
    activeTabId,
    updateDonationDetails,
    updateAndSyncDonorDetails,
    fieldErrors,
    setFieldErrors,
    updateDonorDetails,
  } = useDonationStore();

  const currentSection = activeTab.toLowerCase();
  const currentDonationDetails =
    donorTabs[activeTabId][currentSection].donationDetails;

  const clearFieldError = (fieldName) => {
    setFieldErrors({
      ...fieldErrors,
      donation: {
        ...fieldErrors.donation,
        [fieldName]: undefined,
      },
    });
  };

  const handlePurposeChange = (e) => {
    const value = e.target.value;
    updateDonationDetails(activeTabId, currentSection, { purpose: value });
    clearFieldError("purpose");
  };

  const handleSpecifiedPurposeChange = (e) => {
    const value = e.target.value;
    // Only allow letters, spaces, and basic punctuation
    if (/^[A-Za-z\s.,()'-]*$/.test(value)) {
      updateDonationDetails(activeTabId, currentSection, {
        specifiedPurpose: value,
      });
    }
  };

  const handleDonationTypeChange = (e) => {
    const value = e.target.value;
    updateDonationDetails(activeTabId, currentSection, { donationType: value });
    clearFieldError("donationType");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow positive integers
    if (/^\d*$/.test(value)) {
      updateDonationDetails(activeTabId, currentSection, { amount: value });
      clearFieldError("amount");

      // Update amount in other section (math/mission) as well
      const otherSection = currentSection === "math" ? "mission" : "math";
      updateDonationDetails(activeTabId, otherSection, { amount: value });
    }
  };

  const [panError, setPanError] = useState("");

  const validatePanNumber = (value) => {
    if (!value) return ""; // Don't show error for empty value

    if (!/^[A-Z]{0,5}[0-9]{0,4}[A-Z]{0,1}$/.test(value)) {
      return "Invalid PAN format";
    }
    if (value.length < 10) {
      return "PAN must be 10 characters (currently: " + value.length + ")";
    }
    if (value.length > 10) {
      return "PAN cannot exceed 10 characters";
    }
    if (value.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
      return "Invalid PAN format (must be like ABCDE1234F)";
    }
    return "";
  };

  const handlePanNumberChange = (e) => {
    const value = e.target.value.toUpperCase();

    // Check if we have guest data
    const donorDetails = donorTabs[activeTabId][currentSection].donorDetails;
    if (donorDetails.guestData) {
      // Clear all guest data and fields in donor details
      console.log("Clearing guest data due to manual PAN edit");
      updateDonorDetails(activeTabId, currentSection, {
        guestId: null,
        guestData: null,
        title: "",
        name: "",
        phone: "",
        email: "",
        deeksha: "",
        identityType: "Aadhaar",
        identityNumber: "",
        pincode: "",
        state: "",
        district: "",
        postOffice: "",
        flatNo: "",
        streetName: "",
        roomNo: "",
      });
    }

    // Original PAN handling logic
    if (/^[A-Z0-9]*$/.test(value) && value.length <= 10) {
      const error = validatePanNumber(value);
      setPanError(error);

      updateDonationDetails(activeTabId, currentSection, {
        panNumber: value,
      });

      const otherSection = currentSection === "math" ? "mission" : "math";
      updateDonationDetails(activeTabId, otherSection, {
        panNumber: value,
      });
    }
  };

  const handleTransactionTypeChange = (e) => {
    const transactionType = e.target.value;
    updateDonationDetails(activeTabId, currentSection, {
      transactionType,
    });
    onTransactionTypeChange(transactionType);
  };

  const handleInMemoryOfChange = (e) => {
    const value = e.target.value;
    // Only allow letters, spaces, and basic punctuation
    if (/^[A-Za-z\s.,()'-]*$/.test(value)) {
      updateDonationDetails(activeTabId, currentSection, { inMemoryOf: value });
      clearFieldError("inMemoryOf");
    }
  };

  const isCompleted =
    donorTabs[activeTabId][currentSection].donationDetails.status ===
    "completed";

  const [showPanInput, setShowPanInput] = useState(true);

  const handlePanSelectionChange = (e) => {
    const value = e.target.value;
    if (value === "None") {
      setShowPanInput(false);
      handlePanNumberChange({ target: { value: "" } });
    } else {
      setShowPanInput(true);
    }
  };

  useEffect(() => {
    // Modified to check for both PAN Card identity and pan_number from guest data
    const donorDetails = donorTabs[activeTabId][currentSection].donorDetails;

    if (
      (donorDetails.identityType === "PAN Card" &&
        donorDetails.identityNumber) ||
      donorDetails.guestData?.attributes?.pan_number
    ) {
      setShowPanInput(true);

      // Use PAN from guest data if available, otherwise use identity number
      const panNumber =
        donorDetails.guestData?.attributes?.pan_number ||
        (donorDetails.identityType === "PAN Card"
          ? donorDetails.identityNumber
          : "");

      updateDonationDetails(activeTabId, currentSection, {
        panNumber: panNumber,
      });

      // Update other section as well
      const otherSection = currentSection === "math" ? "mission" : "math";
      updateDonationDetails(activeTabId, otherSection, {
        panNumber: panNumber,
      });
    }
  }, [activeTabId, currentSection]);

  const hasGuestData = () => {
    return !!donorTabs[activeTabId][currentSection].donorDetails.guestData;
  };

  return (
    <div
      className={`donation-form ${
        donorTabs[activeTabId].activeSection === "mission" ? "mission-bg" : ""
      }`}
    >
      <h2 className="donation-form__title">Donations Details</h2>
      <form className="donation-form__container" style={{ marginTop: "10px" }}>
        <div className="donation-form__group">
          <label className="donation-form__label">
            Purpose <span className="required">*</span>
          </label>
          <select
            className="donation-form__select"
            value={currentDonationDetails.purpose}
            onChange={handlePurposeChange}
            disabled={isCompleted}
            style={{
              backgroundColor: isCompleted ? "#f5f5f5" : "white",
              opacity: isCompleted ? 0.7 : 1,
            }}
          >
            <option value="" disabled>
              Select Purpose
            </option>
            {(activeTab === "Math" ? mathOptions : missionOptions).map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
          {fieldErrors.donation.purpose && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {fieldErrors.donation.purpose}
            </span>
          )}
        </div>

        {currentDonationDetails.purpose === "Other" && (
          <div className="donation-form__group">
            <label className="donation-form__label">
              Specify Purpose <span className="donation-form__required">*</span>
            </label>
            <input
              className="donation-form__input"
              type="text"
              placeholder="Please specify the purpose"
              value={currentDonationDetails.specifiedPurpose}
              onChange={handleSpecifiedPurposeChange}
            />
          </div>
        )}

        <div className="donation-form__group">
          <label className="donation-form__label">
            Donation Type <span className="required">*</span>
          </label>
          <select
            className="donation-form__select"
            value={currentDonationDetails.donationType}
            onChange={handleDonationTypeChange}
            disabled={isCompleted}
            style={{
              backgroundColor: isCompleted ? "#f5f5f5" : "white",
              opacity: isCompleted ? 0.7 : 1,
            }}
          >
            <option value="Others (Revenue)">Others (Revenue)</option>
            <option value="CORPUS">CORPUS</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">
            Donation Amount <span className="required">*</span>
          </label>
          <input
            className="donation-form__input"
            type="text"
            placeholder=""
            value={currentDonationDetails.amount}
            onChange={handleAmountChange}
            disabled={isCompleted}
            style={{
              backgroundColor: isCompleted ? "#f5f5f5" : "white",
              opacity: isCompleted ? 0.7 : 1,
            }}
          />
          {fieldErrors.donation.amount && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {fieldErrors.donation.amount}
            </span>
          )}
        </div>

        {Number(currentDonationDetails.amount) > 9999 && (
          <div className="donation-form__group">
            <label className="donation-form__label">
              PAN Number <span className="donation-form__required">*</span>
            </label>
            <select
              className="donation-form__select"
              value="enter"
              onChange={handlePanSelectionChange}
              disabled={isCompleted || hasGuestData()}
              style={{
                backgroundColor:
                  isCompleted || hasGuestData() ? "#f5f5f5" : "white",
                opacity: isCompleted || hasGuestData() ? 0.7 : 1,
              }}
            >
              <option value="None">None</option>
              <option value="enter">Enter PAN Number</option>
            </select>

            {showPanInput && (
              <input
                className="donation-form__input"
                type="text"
                placeholder="Enter PAN Number"
                value={currentDonationDetails.panNumber}
                onChange={handlePanNumberChange}
                disabled={isCompleted || hasGuestData()}
                style={{
                  marginTop: "10px",
                  backgroundColor:
                    isCompleted || hasGuestData() ? "#f5f5f5" : "white",
                  opacity: isCompleted || hasGuestData() ? 0.7 : 1,
                }}
              />
            )}

            {panError && (
              <span
                className="error-message"
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {panError}
              </span>
            )}
          </div>
        )}

        <div className="donation-form__group">
          <label className="donation-form__label">Transaction Type</label>
          <select
            className="donation-form__select"
            value={currentDonationDetails.transactionType}
            onChange={handleTransactionTypeChange}
            disabled={isCompleted}
            style={{
              backgroundColor: isCompleted ? "#f5f5f5" : "white",
              opacity: isCompleted ? 0.7 : 1,
            }}
          >
            <option value="Cash">Cash</option>
            <option value="M.O">M.O</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="DD">DD</option>
          </select>
        </div>

        <div className="donation-form__group">
          <label className="donation-form__label">In Memory of</label>
          <input
            className="donation-form__input"
            type="text"
            placeholder=""
            value={currentDonationDetails.inMemoryOf}
            onChange={handleInMemoryOfChange}
            disabled={isCompleted}
            style={{
              backgroundColor: isCompleted ? "#f5f5f5" : "white",
              opacity: isCompleted ? 0.7 : 1,
            }}
          />
          {fieldErrors.donation.inMemoryOf && (
            <span
              className="error-message"
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {fieldErrors.donation.inMemoryOf}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Details;
