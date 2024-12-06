import React, { useEffect, useState } from "react";
import useDormitoryStore from "../../../../../dormitoryStore";
import CommonButton from "../../../../components/ui/Button";
import "./DormitoryVisitDetails.scss";

const DormitoryVisitDetails = ({ goToNextStep, goToPrevStep, tabName }) => {

  
  const { formData, updateVisitDetails } = useDormitoryStore();
  useEffect(() => {
  console.log('Complete Form Data:', formData);
}, [formData]);
  const [errors, setErrors] = useState({});
  const [visited, setVisited] = useState(formData.visitDetails.visited);

  const validateField = (name, value) => {
    const fieldsToValidate = [
      "visitDate",
      "visitTime",
      "departureDate",
      "departureTime"
    ];
    if (fieldsToValidate.includes(name) && !value) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (visited === "yes") {
      if (name === "previousVisitDate" && !value) {
        return "Previous visit date is required";
      }
      if (name === "reason" && !value) {
        return "Reason for re-visit is required";
      }
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateVisitDetails({ [name]: value });
    
    // Validate field on change
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setVisited(value);
    updateVisitDetails({ visited: value });
    
    // Clear or set errors for conditional fields
    if (value === "yes") {
      setErrors(prev => ({
        ...prev,
        previousVisitDate: validateField("previousVisitDate", formData.visitDetails.previousVisitDate),
        reason: validateField("reason", formData.visitDetails.reason)
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        previousVisitDate: "",
        reason: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateVisitDetails({ file });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    updateVisitDetails({ file });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const fieldsToValidate = [
    "visitDate",
    "visitTime",
    "departureDate",
    "departureTime"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {};

    // Validate all fields
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData.visitDetails[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (visited === "yes") {
      const previousVisitError = validateField("previousVisitDate", formData.visitDetails.previousVisitDate);
      const reasonError = validateField("reason", formData.visitDetails.reason);
      
      if (previousVisitError) {
        newErrors.previousVisitDate = previousVisitError;
        hasErrors = true;
      }
      if (reasonError) {
        newErrors.reason = reasonError;
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (!hasErrors) {
      goToNextStep();
    }
  };

  return (
    <div className="application-form">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <h2>Visit Details</h2>
          <div className="form-section">
            <div className="form-left-section">
              <div className="form-group">
                <label>
                  Arrival Date <span className="required"> *</span>
                </label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDetails.visitDate}
                  onChange={handleInputChange}
                />
                {errors.visitDate && <span className="error">{errors.visitDate}</span>}
              </div>

              <div className="form-group">
                <label>
                  Departure Date <span className="required"> *</span>
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.visitDetails.departureDate}
                  onChange={handleInputChange}
                />
                {errors.departureDate && <span className="error">{errors.departureDate}</span>}
              </div>

              <div className="form-group file-upload-section">
                <label>Recommendation Letter (If any)</label>
                <div className="upload-container">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpeg, .png, .svg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">&#8593;</div>
                    <div className="upload-text">
                      Drag and drop files here to upload.
                      <br />
                      <span className="upload-subtext">
                        Only JPEG, PNG, and SVG files are allowed.
                      </span>
                    </div>
                  </label>
                </div>
                {errors.file && <span className="error">{errors.file}</span>}
              </div>
            </div>

            <div className="form-right-section">
              <div className="form-group">
                <label>
                  Arrival Time <span className="required"> *</span>
                </label>
                <input
                  type="time"
                  name="visitTime"
                  value={formData.visitDetails.visitTime}
                  onChange={handleInputChange}
                />
                {errors.visitTime && <span className="error">{errors.visitTime}</span>}
              </div>

              <div className="form-group">
                <label>
                  Departure Time <span className="required"> *</span>
                </label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.visitDetails.departureTime}
                  onChange={handleInputChange}
                />
                {errors.departureTime && <span className="error">{errors.departureTime}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="previously-visited-section">
          <h2>Previously Visited Detail</h2>
          
          <div className="form-group" style={{ paddingTop: "10px" }}>
            <label>Previously Visited?</label>
            <div style={{ display: "flex", gap: 40, paddingTop: "10px" }}>
              <div>
                <input
                  name="visited"
                  type="radio"
                  value="yes"
                  checked={visited === "yes"}
                  onChange={handleRadioChange}
                  id="visited-yes"
                />
                <label htmlFor="visited-yes">Yes</label>
              </div>
              <div>
                <input
                  name="visited"
                  type="radio"
                  value="no"
                  checked={visited === "no" || !visited}
                  onChange={handleRadioChange}
                  id="visited-no"
                />
                <label htmlFor="visited-no">No</label>
              </div>
            </div>
            {errors.visited && <span className="error">{errors.visited}</span>}
          </div>

          {visited === "yes" && (
            <>
              <div className="form-group">
                <label>Previous Arrival Date</label>
                <input
                  type="date"
                  name="previousVisitDate"
                  value={formData.visitDetails.previousVisitDate}
                  onChange={handleInputChange}
                />
                {errors.previousVisitDate && (
                  <span className="error">{errors.previousVisitDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>State reason for re-visit</label>
                <textarea
                  rows={3}
                  name="reason"
                  value={formData.visitDetails.reason}
                  onChange={handleInputChange}
                  placeholder="State reason for re-visit"
                />
                {errors.reason && <span className="error">{errors.reason}</span>}
              </div>
            </>
          )}
        </div>

        {tabName && (
          <div
            className="submit-button"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 30px",
            }}
          >
            <CommonButton
              buttonName="Back"
              style={{
                backgroundColor: "#FFF",
                color: "#000",
                borderColor: "#4B4B4B",
                fontSize: "18px",
                borderRadius: "7px",
                borderWidth: 1,
                padding: "15px 20px",
              }}
              onClick={goToPrevStep}
            />
            <CommonButton
              buttonName="Proceed"
              type="submit"
              style={{
                backgroundColor: "#ea7704",
                color: "#FFFFFF",
                borderColor: "#ea7704",
                fontSize: "18px",
                borderRadius: "7px",
                borderWidth: 1,
                padding: "15px 100px",
              }}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default DormitoryVisitDetails;
