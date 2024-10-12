import React, { useState } from "react";
import CommonButton from "../../../../components/ui/Button";
import useApplicationStore from "../../../../../useApplicationStore";

const VisitDetails = ({ goToNextStep, goToPrevStep, tabName }) => {
  const { formData, errors, setVisitFormData, setFile, setErrors } =
    useApplicationStore();

  const [visited, setVisited] = useState(formData.visited);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitFormData(name, value);
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setVisited(value);
    setVisitFormData("visited", value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileUpload = () => {
    // console.log("Form Data:", formData);
    goToNextStep();
  };

  return (
    <div className="guest-details">
      <h2>Visit Details</h2>

      <div className="VisitDetails">
        <div className="form-left-section">
          <div className="form-group">
            <label>Arrival Date</label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleInputChange}
            />
            {errors.visitDate && (
              <span className="error">{errors.visitDate}</span>
            )}
          </div>

          <div className="form-group">
            <label>Departure Date</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
            />
            {errors.departureDate && (
              <span className="error">{errors.departureDate}</span>
            )}
          </div>

          <div className="form-group file-upload-section">
            <label>Recommendation Letter</label>
            <div
              className="upload-container"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                id="file-upload"
                type="file"
                accept=".jpeg, .png, .svg"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload" className="upload-label">
                <div className="upload-icon">&#8593;</div>{" "}
                {/* Replace with an actual icon if needed */}
                <div className="upload-text">
                  Drag and drop files here to upload.
                  <br />
                  <span className="upload-subtext">
                    {"Only JPEG, PNG, and SVG files are allowed."}
                  </span>
                </div>
              </label>
            </div>
            {errors.file && <span className="error">{errors.file}</span>}
            <div className="upload-text">
              {formData.file && (
                <>
                  <strong
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#000000",
                      letterSpacing: 1,
                    }}
                  >
                    Selected file:{" "}
                  </strong>
                  <span
                    style={{ fontSize: 15, fontWeight: 500, color: "green" }}
                  >
                    {formData.file.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="form-right-section">
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
                />
                <span>Yes</span>
              </div>
              <div>
                <input
                  name="visited"
                  type="radio"
                  value="no"
                  checked={visited === "no"}
                  onChange={handleRadioChange}
                />
                <span>No</span>
              </div>
            </div>
            {errors.visited && <span className="error">{errors.visited}</span>}
          </div>

          {visited === "yes" && (
            <>
              <div className="form-group" style={{ paddingTop: "4px" }}>
                <label htmlFor="previousVisitDate">Previous Arrival Date</label>
                <input
                  type="date"
                  name="previousVisitDate"
                  value={formData.previousVisitDate}
                  onChange={handleInputChange}
                />
                {errors.previousVisitDate && (
                  <span className="error">{errors.previousVisitDate}</span>
                )}
              </div>

              <div className="form-group" style={{ paddingTop: "2px" }}>
                <label htmlFor="reason">State reason for re-visit</label>
                <textarea
                  rows={3}
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="State reason for re-visit"
                />
                {errors.reason && (
                  <span className="error">{errors.reason}</span>
                )}
              </div>
            </>
          )}
        </div>
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
            style={{
              backgroundColor: "#9867E9",
              color: "#FFFFFF",
              borderColor: "#9867E9",
              fontSize: "18px",
              borderRadius: "7px",
              borderWidth: 1,
              padding: "15px 100px",
            }}
            onClick={handleFileUpload}
          />
        </div>
      )}
    </div>
  );
};

export default VisitDetails;
