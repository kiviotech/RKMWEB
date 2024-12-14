import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaAddressForm.scss";

const translations = {
  english: {
    enterPincode: "Please enter address pincode:",
    country: "Country",
    state: "State",
    district: "District",
    houseNumber: "House Number",
    streetName: "Street Name",
    back: "Back",
    next: "Next",
  },
  hindi: {
    enterPincode: "कृपया पता पिनकोड दर्ज करें:",
    country: "देश",
    state: "राज्य",
    district: "जिला",
    houseNumber: "मकान नंबर",
    streetName: "सड़क का नाम",
    back: "वापस",
    next: "अगला",
  },
  bengali: {
    enterPincode: "অনুগ্রহ করে ঠিকানার পিনকোড লিখুন:",
    country: "দেশ",
    state: "রাজ্য",
    district: "জেলা",
    houseNumber: "বাড়ি নম্বর",
    streetName: "রাস্তার নাম",
    back: "পিছনে",
    next: "পরবর্তী",
  },
};

const DeekshaAddressForm = () => {
  const { address, updateAddress, formLanguage } = useDeekshaFormStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Change 1: Added 'errors' state to track field validation
  const navigate = useNavigate();

  // Change 2: Dynamic required fields
  const requiredFields = ["pincode", "country", "state", "district"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateAddress({ [name]: value });
    setErrors((prev) => ({ ...prev, [name]: !value }));
  };

  const fetchAddressFromPincode = async (pincode) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (response.data[0].Status === "Success") {
        const addressData = response.data[0].PostOffice[0];
        updateAddress({
          country: "India",
          state: addressData.State,
          district: addressData.District,
        });
      } else {
        setErrors((prev) => ({ ...prev, pincode: true })); // Set error for invalid pincode
      }
    } catch (error) {
      console.error("Error fetching address data", error);
      setErrors((prev) => ({ ...prev, pincode: true })); // Set error for failed request
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (e) => {
    const { value } = e.target;
    updateAddress({ pincode: value });
    setErrors((prev) => ({ ...prev, pincode: value.length !== 6 })); // Change 1: Validate pincode length dynamically
    if (value.length === 6) {
      fetchAddressFromPincode(value);
    }
  };

  const handleBack = () => {
    navigate("/deeksha-form");
  };

  const handleNext = (e) => {
    e.preventDefault();

    // Check all required fields - remove the .trim() from being stored
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!address[field] || address[field].trim() === "") {
        newErrors[field] = true;
      }
    });

    // Update errors state
    setErrors(newErrors);

    // If validation passes, navigate to next page
    if (Object.keys(newErrors).length === 0) {
      navigate("/deekshaContact-form");
    }
  };

  // Add console.log to see store state
  console.log(
    "DeekshaAddressForm Store State:",
    useDeekshaFormStore.getState()
  );

  // Update progress calculation to remove stored .trim()
  const calculateProgress = () => {
    const requiredFields = [
      "pincode",
      "country",
      "state",
      "district",
      "houseNumber",
      "streetName",
    ];
    const filledFields = requiredFields.filter(
      (field) => address[field] && address[field].trim() !== ""
    );
    return (filledFields.length / requiredFields.length) * 25;
  };

  const isFormValid = requiredFields.every(
    (field) => address[field] && address[field].trim() !== ""
  );

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

  return (
    <div className="deekshaAddressform-container">
      {/* Progress Bar */}
      <div className="deekshaAddressform-progress-bar">
        <div
          className="deekshaAddressform-progress"
          style={{ "--progress": calculateProgress() }}
        ></div>
      </div>

      {/* Title */}
      <h2>Srimat Swami Gautamanandaji Maharaj's Diksha Form</h2>

      {/* Form */}
      <form className="deekshaAddressform-form">
        <div className="deekshaAddressform-input-group">
          <label
            className="deekshaAddressform-label"
            style={{ marginBottom: "10px" }}
          >
            {t.enterPincode}
          </label>
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handlePincodeChange}
            className={`deekshaAddressform-input ${
              errors.pincode ? "error" : ""
            }`}
          />
          {errors.pincode && (
            <span className="error-message">
              Pincode is required and must be 6 digits
            </span>
          )}
        </div>

        {/* Display country, state, and district */}
        <div className="deekshaAddressform-address-grid">
          <div className="deekshaAddressform-input-wrapper">
            <label className="deekshaAddressform-label">
              {t.country} <span className="required">*</span>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleInputChange}
                disabled
                className="deekshaAddressform-input"
              />
            </label>
          </div>
          <div className="deekshaAddressform-input-wrapper">
            <label className="deekshaAddressform-label">
              {t.state} <span className="required">*</span>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleInputChange}
                disabled
                className="deekshaAddressform-input"
              />
            </label>
          </div>
          <div className="deekshaAddressform-input-wrapper">
            <label className="deekshaAddressform-label">
              {t.district} <span className="required">*</span>
              <input
                type="text"
                name="district"
                value={address.district}
                onChange={handleInputChange}
                disabled
                className="deekshaAddressform-input"
              />
            </label>
          </div>
        </div>

        {/* House number and street name side by side */}
        <div className="deekshaAddressform-house-street-grid">
          <div className="deekshaAddressform-input-wrapper">
            <label className="deekshaAddressform-label">
              {t.houseNumber}
              <input
                type="text"
                name="houseNumber"
                placeholder={t.houseNumber}
                value={address.houseNumber}
                onChange={handleInputChange}
                className="deekshaAddressform-input"
              />
            </label>
          </div>
          <div className="deekshaAddressform-input-wrapper">
            <label className="deekshaAddressform-label">
              {t.streetName}
              <input
                type="text"
                name="streetName"
                placeholder={t.streetName}
                value={address.streetName}
                onChange={handleInputChange}
                className="deekshaAddressform-input"
              />
            </label>
          </div>
        </div>
      </form>

      {/* Buttons */}
      <div className="deekshaAddressform-button-group">
        <button className="deekshaAddressform-back-button" onClick={handleBack}>
          {t.back}
        </button>
        <button onClick={handleNext} className="deekshaAddressform-next-button">
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default DeekshaAddressForm;
