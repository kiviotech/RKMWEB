import React, { useState, useEffect, useRef } from "react";
import CommonButton from "../../../../components/ui/Button";
import "./DormitoryAccommodationDetails.scss";
import useDormitoryStore from "../../../../../dormitoryStore";

// Add this SVG component at the top of your file
const DownloadIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M5.83333 8.33333L10 12.5M10 12.5L14.1667 8.33333M10 12.5V2.5"
      stroke="#6941C6"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DormitoryAccommodationDetails = ({ goToNextStep, goToPrevStep, tabName }) => {
  const { formData, updateFormData } = useDormitoryStore();
  const [errors, setErrors] = useState({});

  // Add useEffect to log data whenever it changes
  useEffect(() => {
    console.log('Current Accommodation Data:', formData.accommodation);
    console.log('Complete Form Data:', formData);
  }, [formData]);

  const validateField = (field, value) => {
    if (!value) {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} with value:`, value);
    updateFormData({
      accommodation: {
        ...formData.accommodation,
        [field]: value
      }
    });

    // Validate on change
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  };

  const handleBack = () => {
    console.log('Going back with current data:', formData.accommodation);
    goToPrevStep();
  };

  const handleProceed = () => {
    console.log('Proceeding with accommodation data:', formData.accommodation);
    const newErrors = {
      totalPeople: validateField('totalPeople', formData.accommodation.totalPeople),
      maleDevotees: validateField('maleDevotees', formData.accommodation.maleDevotees),
      femaleDevotees: validateField('femaleDevotees', formData.accommodation.femaleDevotees),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error)) {
      goToNextStep();
    }
  };

  return (
    <div className="accommodation-details">
      <h2>Accommodation Details</h2>
      <p className="subtitle">Please provide the details of your accommodation requirements</p>

      {/* Excel Upload Section */}
      <div className="excel-section">
        <button className="download-template">
          <DownloadIcon />
          Download Template
        </button>

        <div className="upload-box">
          <div className="drag-drop-area">
            <div className="upload-icon">↑</div>
            <p>Drag & drop the Excel file here</p>
            <p className="or-text">or</p>
            <button className="choose-file">Choose file</button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="form-fields">
        <div className="form-group">
          <label>Total number of people <span className="required">*</span></label>
          <input 
            type="number" 
            placeholder="Number of people"
            value={formData.accommodation.totalPeople}
            onChange={(e) => handleInputChange('totalPeople', e.target.value)}
          />
          {errors.totalPeople && <span className="error">{errors.totalPeople}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Number of Male Devotees <span className="required">*</span></label>
            <input 
              type="number"
              placeholder="type the number of students/devotees"
              value={formData.accommodation.maleDevotees}
              onChange={(e) => handleInputChange('maleDevotees', e.target.value)}
            />
            {errors.maleDevotees && <span className="error">{errors.maleDevotees}</span>}
          </div>

          <div className="form-group">
            <label>Number of Female Devotees <span className="required">*</span></label>
            <input 
              type="number"
              placeholder="type the number of students/devotees"
              value={formData.accommodation.femaleDevotees}
              onChange={(e) => handleInputChange('femaleDevotees', e.target.value)}
            />
            {errors.femaleDevotees && <span className="error">{errors.femaleDevotees}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Special Requests/Additional information</label>
          <textarea 
            placeholder="Specify If any special requests"
            value={formData.accommodation.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          />
        </div>

        <div className="info-box">
          <i className="info-icon">i</i>
          <p>Download the Excel Sheet and fill in all the Members Details, then upload the file in the Upload Section above.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="back-btn" onClick={handleBack}>Back</button>
        <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
      </div>
    </div>
  );
};

export default DormitoryAccommodationDetails;
