import React, { useState, useEffect } from "react";
import CommonButton from "../../../../components/ui/Button";
import "./VisitDetails.scss";
import useApplicationStore from "../../../../../useApplicationStore";

const VisitDetails = ({ goToNextStep, goToPrevStep, tabName }) => {
  const { formData, errors, setVisitFormData, setFile, setErrors } =
    useApplicationStore();

  const [visited, setVisited] = useState(formData.visited);

  // Add console logging for store updates
  useEffect(() => {
    console.log("VisitDetails - Zustand Store State:", {
      visitData: {
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        visited: formData.visited,
        previousVisitDate: formData.previousVisitDate,
        reason: formData.reason,
        file: formData.file
      },
      errors,
      fullState: formData
    });
  }, [formData, errors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitFormData(name, value);
    console.log("Visit Input Change:", { field: name, value });
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setVisited(value);
    setVisitFormData("visited", value);
    console.log("Previous Visit Status Change:", { 
      value,
      requiresAdditionalInfo: value === "yes"
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    console.log("File Upload:", { 
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
    console.log("File Drop:", { 
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    console.log("Visit Details Submission Attempt:", {
      currentData: {
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        visited: visited,
        previousDetails: visited === "yes" ? {
          previousVisitDate: formData.previousVisitDate,
          reason: formData.reason
        } : null
      }
    });

    // Validate required fields
    const fieldsToValidate = [
      "visitDate",
      "visitTime",
      "departureDate",
      "departureTime"
    ];

    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        setErrors(field, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        hasErrors = true;
      }
    });

    if (visited === "yes") {
      if (!formData.previousVisitDate) {
        setErrors("previousVisitDate", "Previous visit date is required");
        hasErrors = true;
      }
      if (!formData.reason) {
        setErrors("reason", "Reason for re-visit is required");
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      console.log("Visit Details Validation Successful - Proceeding to Next Step");
      goToNextStep();
    } else {
      console.log("Visit Details Validation Failed:", errors);
    }
  };

  // Add store subscription for detailed updates
  useEffect(() => {
    const unsubscribe = useApplicationStore.subscribe(
      (state) => state,
      (newState, prevState) => {
        const visitFields = [
          'visitDate', 
          'visitTime', 
          'departureDate', 
          'departureTime',
          'visited',
          'previousVisitDate',
          'reason',
          'file'
        ];
        
        const changes = visitFields.reduce((acc, field) => {
          if (newState.formData[field] !== prevState.formData[field]) {
            acc[field] = {
              from: prevState.formData[field],
              to: newState.formData[field]
            };
          }
          return acc;
        }, {});

        if (Object.keys(changes).length > 0) {
          console.log('VisitDetails - Store Updates:', {
            changes,
            timestamp: new Date().toISOString()
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

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
                  value={formData.visitDate}
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
                  value={formData.departureDate}
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
                  value={formData.visitTime}
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
                  value={formData.departureTime}
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
                  value={formData.previousVisitDate}
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
                  value={formData.reason}
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
                backgroundColor: "#9867E9",
                color: "#FFFFFF",
                borderColor: "#9867E9",
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

export default VisitDetails;
