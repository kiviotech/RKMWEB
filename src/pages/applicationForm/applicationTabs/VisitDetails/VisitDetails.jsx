import React, { useState, useEffect } from "react";
import CommonButton from "../../../../components/ui/Button";
import "./VisitDetails.scss";
import useApplicationStore from "../../../../../useApplicationStore";
import { BASE_URL } from "../../../../../services/apiClient";
import { useNavigate } from "react-router-dom";

const VisitDetails = ({ goToNextStep, goToPrevStep, tabName }) => {
  const { formData, errors, setVisitFormData, setFile, setErrors } =
    useApplicationStore();

  const navigate = useNavigate();

  const [visited, setVisited] = useState(formData.visited);
  const [showExtendedStayReason, setShowExtendedStayReason] = useState(false);

  const handleNext = () => {
    navigate("/application-form", {
      state: { activeTab: "3" },
    });
  };

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
        file: formData.file,
      },
      errors,
      fullState: formData,
    });
  }, [formData, errors]);

  // Add function to get max allowed departure date
  const getMaxDepartureDate = (arrivalDate) => {
    if (!arrivalDate) return null;
    const date = new Date(arrivalDate);
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  // Update handleInputChange to set departure date 2 days after arrival
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for visitDate/arrivalDate
    if (name === "visitDate") {
      const arrivalDate = new Date(value);
      if (!isNaN(arrivalDate.getTime())) {
        // Set next day as default departure date
        const nextDay = new Date(arrivalDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const formattedNextDay = nextDay.toISOString().split("T")[0];
        setVisitFormData("departureDate", formattedNextDay);
      }
    }

    // Handle departure date changes
    if (name === "departureDate") {
      const arrivalDate = new Date(formData.visitDate);
      const departureDate = new Date(value);

      if (!isNaN(arrivalDate.getTime()) && !isNaN(departureDate.getTime())) {
        const daysDiff = Math.ceil(
          (departureDate - arrivalDate) / (1000 * 60 * 60 * 24)
        );

        // If stay is 3 days, force departure time to 7:30
        if (daysDiff === 3) {
          setVisitFormData("departureTime", "7:30");
        }
      }
    }

    // Prevent departure time changes if stay is 3 days
    if (name === "departureTime") {
      const daysDiff = Math.ceil(
        (new Date(formData.departureDate) - new Date(formData.visitDate)) /
          (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 3) {
        return; // Don't allow time changes for 3-day stays
      }
      setVisitFormData(name, value);
    }

    // Add validation for knownToMath field
    if (name === "knownToMath") {
      // Only allow letters and spaces
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setVisitFormData(name, value);
      }
      return;
    }

    setVisitFormData(name, value);

    if (name === "arrivalTime") {
      setVisitFormData("visitTime", value);
    }

    // Modified stay duration calculation
    if (name === "visitDate" || name === "departureDate") {
      let visitDate = name === "visitDate" ? value : formData.visitDate;
      let departureDate =
        name === "departureDate" ? value : formData.departureDate;

      if (visitDate && departureDate) {
        visitDate = new Date(visitDate);
        departureDate = new Date(departureDate);

        if (!isNaN(visitDate.getTime()) && !isNaN(departureDate.getTime())) {
          // Calculate the difference in days
          const timeDiff = departureDate - visitDate;
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

          // Show extended stay reason if stay is more than 2 days (3 nights)
          setShowExtendedStayReason(daysDiff > 1);

          console.log("Stay Duration:", {
            visitDate: visitDate.toISOString(),
            departureDate: departureDate.toISOString(),
            daysDiff,
            showExtendedStay: daysDiff > 1,
          });
        }
      }
    }

    if (errors[name]) {
      setErrors(name, "");
    }
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setVisited(value);
    setVisitFormData("visited", value);
    console.log("Previous Visit Status Change:", {
      value,
      requiresAdditionalInfo: value === "yes",
    });
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer dab72e1a44ce33db65569da89fdc1927935e21775c16a6d6f8f035533fb939552a712001461dd2cabfbffb50b81b3635d6ffb080a24c475f1b8246bbc399da4189dfd3fae5fed6998811fc81e9954d670b6b60e4859bda4634148a94f3ddfecf9c4364858523f5f447bbce967ffc679e35810f1f3c282a6a6f4ee877b58fb8ee`,
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFile({
        ...data[0],
        fileId: data[0].id,
      });
      console.log("File Upload Success:", data[0]);
    } catch (error) {
      console.error("File Upload Error:", error);
      setErrors("file", "Failed to upload file");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
      console.log("File Upload Initiated:", {
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
      console.log("File Drop Upload Initiated:", {
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;

    // Validate required fields
    const fieldsToValidate = [
      "visitDate",
      "visitTime",
      "departureDate",
      "departureTime",
    ];

    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        setErrors(
          field,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
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
      navigate("/application-form", {
        state: {
          activeTab: "3", // Pass as string to match the expected format
        },
      });
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
          "visitDate",
          "visitTime",
          "departureDate",
          "departureTime",
          "visited",
          "previousVisitDate",
          "reason",
          "file",
        ];

        const changes = visitFields.reduce((acc, field) => {
          if (newState.formData[field] !== prevState.formData[field]) {
            acc[field] = {
              from: prevState.formData[field],
              to: newState.formData[field],
            };
          }
          return acc;
        }, {});

        if (Object.keys(changes).length > 0) {
          console.log("VisitDetails - Store Updates:", {
            changes,
            timestamp: new Date().toISOString(),
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const generateTimeOptions = () => {
    const options = [];

    // Add 7:30 AM as first option
    options.push(
      <option key="7:30" value="7:30">
        7:30 AM
      </option>
    );

    // Generate regular hourly options
    for (let hour = 0; hour <= 23; hour++) {
      const time24 = `${hour.toString().padStart(2, "0")}:00`;
      let hour12 = hour % 12;
      hour12 = hour12 === 0 ? 12 : hour12;
      const period = hour < 12 ? "AM" : "PM";
      const timeDisplay = `${hour12}:00 ${period}`;

      options.push(
        <option key={time24} value={time24}>
          {timeDisplay}
        </option>
      );
    }

    return options;
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
                  value={formData.arrivalDate || formData.visitDate || ""}
                  onChange={handleInputChange}
                />
                {errors.visitDate && (
                  <span className="error">{errors.visitDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Departure Date <span className="required"> *</span>
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate || ""}
                  onChange={handleInputChange}
                  min={formData.visitDate || ""}
                  max={
                    formData.visitDate
                      ? getMaxDepartureDate(formData.visitDate)
                      : ""
                  }
                />
                {errors.departureDate && (
                  <span className="error">{errors.departureDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>Additional Message or Special Requests (Optional)</label>
                <textarea
                  name="additionalMessage"
                  value={formData.additionalMessage || ""}
                  onChange={handleInputChange}
                  placeholder="Enter any additional message or special requests..."
                  rows={3}
                />
                {errors.additionalMessage && (
                  <span className="error">{errors.additionalMessage}</span>
                )}
              </div>
            </div>

            <div className="form-right-section">
              <div className="form-group">
                <label>Arrival Time (Official Timming)</label>
                <input
                  type="text"
                  name="arrivalTime"
                  value="10:30"
                  readOnly
                  disabled
                />
                {errors.arrivalTime && (
                  <span className="error">{errors.arrivalTime}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Departure Time <span className="required"> *</span>
                </label>
                <select
                  name="departureTime"
                  value={formData.departureTime || ""}
                  onChange={handleInputChange}
                  disabled={
                    Math.ceil(
                      (new Date(formData.departureDate) -
                        new Date(formData.visitDate)) /
                        (1000 * 60 * 60 * 24)
                    ) === 3
                  }
                >
                  <option value="">Select Time</option>
                  {generateTimeOptions()}
                </select>
                {errors.departureTime && (
                  <span className="error">{errors.departureTime}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Are you known to any of our Ramakrishna Math / Mission /
                  Branch Centre / Monk(s)?
                </label>
                <input
                  type="text"
                  name="knownToMath"
                  value={formData.knownToMath || ""}
                  onChange={handleInputChange}
                  placeholder="Enter details if applicable"
                  pattern="[A-Za-z\s]*"
                  title="Only letters and spaces are allowed"
                />
                {errors.knownToMath && (
                  <span className="error">{errors.knownToMath}</span>
                )}
              </div>
              {/* 
              {showExtendedStayReason && (
                <div className="form-group">
                  <label>
                    State reason for more than 3 nights stay?{" "}
                    <span className="required"> *</span>
                  </label>
                  <textarea
                    rows={3}
                    name="extendedStayReason"
                    value={formData.extendedStayReason || ""}
                    onChange={handleInputChange}
                    placeholder="State your reason"
                  />
                  {errors.extendedStayReason && (
                    <span className="error">{errors.extendedStayReason}</span>
                  )}
                </div>
              )} */}

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
                  value={formData.previousVisitDate || ""}
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
                {errors.reason && (
                  <span className="error">{errors.reason}</span>
                )}
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
              onClick={handleNext}
              type="submit"
              style={{
                backgroundColor: "#EA7704",
                borderColor: "#EA7704",
                color: "#FFFFFF",
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
