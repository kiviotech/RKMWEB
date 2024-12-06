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

    // Add validation for departure date
    if (name === 'departureDate') {
      if (formData.visitDate && new Date(value) < new Date(formData.visitDate)) {
        setErrors('departureDate', 'Departure date cannot be before arrival date');
        return;
      }
    }

    // Add validation for arrival date
    if (name === 'visitDate') {
      if (formData.departureDate && new Date(value) > new Date(formData.departureDate)) {
        setErrors('visitDate', 'Arrival date cannot be after departure date');
        return;
      }
    }

    // Clear error when valid input is provided
    if (errors[name]) {
      setErrors(name, '');
    }

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

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer dab72e1a44ce33db65569da89fdc1927935e21775c16a6d6f8f035533fb939552a712001461dd2cabfbffb50b81b3635d6ffb080a24c475f1b8246bbc399da4189dfd3fae5fed6998811fc81e9954d670b6b60e4859bda4634148a94f3ddfecf9c4364858523f5f447bbce967ffc679e35810f1f3c282a6a6f4ee877b58fb8ee`,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFile({
        ...data[0],
        fileId: data[0].id
      });
      console.log("File Upload Success:", data[0]);
    } catch (error) {
      console.error("File Upload Error:", error);
      setErrors('file', 'Failed to upload file');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
      console.log("File Upload Initiated:", {
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size
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
        fileSize: file?.size
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;

    // Add date validation checks
    if (formData.visitDate && formData.departureDate) {
      if (new Date(formData.departureDate) < new Date(formData.visitDate)) {
        setErrors('departureDate', 'Departure date cannot be before arrival date');
        hasErrors = true;
      }
      if (new Date(formData.visitDate) > new Date(formData.departureDate)) {
        setErrors('visitDate', 'Arrival date cannot be after departure date');
        hasErrors = true;
      }
    }

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
      navigate('/application-form', {
        state: {
          activeTab: '3'  // Pass as string to match the expected format
        }
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

  const generate12HourTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const isPM = hour >= 12;
        const hour12 = hour % 12 || 12;
        const minuteStr = minute.toString().padStart(2, "0");
        const period = isPM ? "PM" : "AM";
        const label = `${hour12}:${minuteStr} ${period}`;
        const value = `${hour.toString().padStart(2, "0")}:${minuteStr}`;
        times.push({ label, value });
      }
    }
    return times;
  };


  return (
    <div className="application-form">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <h2>Kamarpukur Guesthouse Booking</h2>
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
                <select
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={(e) => handleInputChange(e, "arrivalTime")}
                >
                  {generate12HourTimeOptions().map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
                {errors.arrivalTime && <span className="error">{errors.arrivalTime}</span>}
              </div>

              <div className="form-group">
                <label>
                  Departure Time <span className="required"> *</span>
                </label>
                <select
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={(e) => handleInputChange(e, "departureTime")}
                >
                  {generate12HourTimeOptions().map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
                {errors.departureTime && <span className="error">{errors.departureTime}</span>}
              </div>


              <div className="form-group">
                <label>
                  State reason for more than 3 nights stay?
                </label>
                <textarea
                  rows={3}
                  name="extendedStayReason"
                  value={formData.extendedStayReason}
                  onChange={handleInputChange}
                  placeholder="State your reason"
                />
                {errors.extendedStayReason && (
                  <span className="error">{errors.extendedStayReason}</span>
                )}
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
