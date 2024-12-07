import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaAddressForm.scss"

const DeekshaAddressForm = () => {
  const { address, updateAddress } = useDeekshaFormStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Change 1: Added 'errors' state to track field validation
  const navigate = useNavigate();

 // Change 2: Dynamic required fields
  const requiredFields = ["pincode", "country", "state", "district"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateAddress({ [name]: value });
    setErrors((prev) => ({ ...prev, [name]: !value.trim() })); // Change 1: Dynamically update errors state
  };

  const fetchAddressFromPincode = async (pincode) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
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
    
    // Check all required fields
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!address[field]?.trim()) {
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
  console.log('DeekshaAddressForm Store State:', useDeekshaFormStore.getState());

  // Add progress calculation function
  const calculateProgress = () => {
    const requiredFields = ['pincode', 'country', 'state', 'district', 'houseNumber', 'streetName'];
    const filledFields = requiredFields.filter(field => address[field]?.trim());
    return (filledFields.length / requiredFields.length) * 25; // 25% is the max for this form
  };

  const isFormValid = requiredFields.every((field) => address[field]?.trim()); // Change 2: Validate form dynamically

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
        <label className="deekshaAddressform-label" style={{marginBottom: '10px'}}>
          Please enter address pincode:
        </label>
        <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handlePincodeChange}
            className={`deekshaAddressform-input ${errors.pincode ? "error" : ""}`}
          />
        {errors.pincode && <span className="error-message">Pincode is required and must be 6 digits</span>}
      </div>
  
      {/* Display country, state, and district */}
      <div className="deekshaAddressform-address-grid">
        <div className="deekshaAddressform-input-wrapper">
          <label className="deekshaAddressform-label">
            Country <span className="required">*</span>
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
            State <span className="required">*</span>
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
            District <span className="required">*</span>
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
            House Number
            <input
              type="text"
              name="houseNumber"
              placeholder="House Number"
              value={address.houseNumber}
              onChange={handleInputChange}
              className="deekshaAddressform-input"
            />
          </label>
        </div>
        <div className="deekshaAddressform-input-wrapper">
          <label className="deekshaAddressform-label">
            Street Name
            <input
              type="text"
              name="streetName"
              placeholder="Street Name"
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
      <button
        className="deekshaAddressform-back-button"
        onClick={handleBack}
      >
        Back
      </button>
      <button
        onClick={handleNext}
        className="deekshaAddressform-next-button"
      >
        Next
      </button>
    </div>
  </div>
  
  
  );
};

export default DeekshaAddressForm;