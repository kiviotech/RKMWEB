import React, { useState, useEffect } from "react";
import CommonButton from "../../../../components/ui/Button";
import useDormitoryStore from "../../../../../dormitoryStore";
import { BASE_URL, MEDIA_BASE_URL } from "../../../../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { fetchCelebrations } from "../../../../../services/src/services/celebrationsService";
import { useAuthStore } from "../../../../../store/authStore";

const VisitDetails = ({ goToNextStep, goToPrevStep, tabName }) => {
  const { formData, updateVisitDetails, setErrors, clearErrors } =
    useDormitoryStore();
  const visitData = formData.visitDetails;

  const navigate = useNavigate();

  const [visited, setVisited] = useState(visitData.visited);
  const [showExtendedStayReason, setShowExtendedStayReason] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [celebrations, setCelebrations] = useState([]);
  const [showCelebrationWarning, setShowCelebrationWarning] = useState(false);
  const [celebrationWarnings, setCelebrationWarnings] = useState([]);

  // Add useEffect for smooth scroll to top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []); // Empty dependency array means this runs once when component mounts

  // Add useEffect for fetching celebrations
  useEffect(() => {
    const getCelebrations = async () => {
      try {
        const celebrationsData = await fetchCelebrations();
        console.log("Fetched celebrations:", celebrationsData.data); // Debug log
        setCelebrations(celebrationsData.data);
      } catch (error) {
        console.error("Error fetching celebrations:", error);
      }
    };

    getCelebrations();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleNext = () => {
    console.log("Navigating to address details...");
    navigate("/dormitory-application-form", {
      state: { activeTab: 2 }, // Application Details tab index
      replace: true,
    });
  };

  // Add console logging for store updates
  useEffect(() => {
    console.log("VisitDetails - Zustand Store State:", {
      visitData: {
        visitDate: visitData.visitDate,
        visitTime: visitData.visitTime,
        departureDate: visitData.departureDate,
        departureTime: visitData.departureTime,
        visited: visitData.visited,
        previousVisitDate: visitData.previousVisitDate,
        reason: visitData.reason,
        file: visitData.file,
      },
      fullState: formData,
    });
  }, [visitData, formData]);

  // Add function to get max allowed arrival date (90 days from today)
  const getMaxArrivalDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);
    return maxDate.toISOString().split("T")[0];
  };

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

    // Clear error when field is modified
    if (formData.errors?.[name]) {
      setErrors(name, "");
    }

    updateVisitDetails({ [name]: value });

    // Special handling for arrival date changes
    if (name === "visitDate") {
      // Update departure date when arrival date changes
      const newArrivalDate = new Date(value);
      if (!isNaN(newArrivalDate.getTime())) {
        // Reset departure date
        updateVisitDetails({ departureDate: "" });
      }
    } else {
      // Handle all other input changes normally
      updateVisitDetails(name, value);
    }

    // Rest of the existing handleInputChange logic
    if (name === "visitDate" || name === "departureDate") {
      // Get both dates
      const visitDate = name === "visitDate" ? value : visitData.visitDate;
      const departureDate =
        name === "departureDate" ? value : visitData.departureDate;

      if (visitDate && departureDate) {
        // Get all dates in the range
        const dateRange = [];
        const start = new Date(visitDate);
        const end = new Date(departureDate);

        for (
          let date = new Date(start);
          date <= end;
          date.setDate(date.getDate() + 1)
        ) {
          dateRange.push(date.toISOString().split("T")[0]);
        }

        const matchingCelebrations = [];

        celebrations.forEach((celebration) => {
          const celebrationDate = celebration.attributes?.gregorian_date;
          if (celebrationDate && dateRange.includes(celebrationDate)) {
            matchingCelebrations.push({
              event: celebration.attributes.event_name,
              type: celebration.attributes.event_type,
              date: celebrationDate,
              isArrival: celebrationDate === visitDate,
              isDeparture: celebrationDate === departureDate,
            });
          }
        });

        if (matchingCelebrations.length > 0) {
          console.log("Found matching celebrations:", matchingCelebrations);
          setShowCelebrationWarning(true);
          setCelebrationWarnings(matchingCelebrations);
        } else {
          setShowCelebrationWarning(false);
          setCelebrationWarnings([]);
        }
      }

      // Handle departure date changes
      if (name === "departureDate") {
        const arrivalDate = new Date(visitData.visitDate);
        const departureDate = new Date(value);

        if (!isNaN(arrivalDate.getTime()) && !isNaN(departureDate.getTime())) {
          const daysDiff = Math.ceil(
            (departureDate - arrivalDate) / (1000 * 60 * 60 * 24)
          );

          // If stay is 3 days, force departure time to 7:30
          if (daysDiff === 3) {
            updateVisitDetails({ departureTime: "7:30" });
          }
        }
      }

      // Prevent departure time changes if stay is 3 days
      if (name === "departureTime") {
        const daysDiff = Math.ceil(
          (new Date(visitData.departureDate) - new Date(visitData.visitDate)) /
          (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 3) {
          return; // Don't allow time changes for 3-day stays
        }
        updateVisitDetails(name, value);
      }

      // Add validation for knownToMath field
      if (name === "knownToMath") {
        // Only allow letters and spaces
        if (/^[A-Za-z\s]*$/.test(value) || value === "") {
          updateVisitDetails(name, value);
        }
        return;
      }

      // Modified stay duration calculation
      if (name === "visitDate" || name === "departureDate") {
        let visitDate = name === "visitDate" ? value : visitData.visitDate;
        let departureDate =
          name === "departureDate" ? value : visitData.departureDate;

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
    }
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setVisited(value);
    updateVisitDetails({ visited: value });
    console.log("Previous Visit Status Change:", {
      value,
      requiresAdditionalInfo: value === "yes",
    });
  };

  const handleFileUpload = async (file) => {
    // Reduce max file size to 2MB to be safe
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

    if (file.size > MAX_FILE_SIZE) {
      setErrors("file", "File size must be less than 2MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", file);

      // Get token from auth store
      const token = useAuthStore.getState().token;

      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove Content-Type header to let browser set it with boundary
        },
        mode: "cors",
        credentials: "include",
      });

      // Handle specific error cases
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            "File is too large. Please upload a smaller file (max 2MB)."
          );
        }
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        if (response.status === 403) {
          throw new Error("Permission denied to upload file.");
        }
        throw new Error("Upload failed. Please try again.");
      }

      const data = await response.json();

      if (!data || !data[0]) {
        throw new Error("Invalid response from server");
      }

      updateVisitDetails({
        file: {
          ...data[0],
          fileId: data[0].id,
        },
      });

      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    } catch (error) {
      console.error("File Upload Error:", error);
      setErrors("file", error.message || "Failed to upload file");

      // Clear the file input
      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = "";
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
    clearErrors(); // Clear all previous errors
    let hasErrors = false;

    const fieldsToValidate = [
      "visitDate",
      "visitTime",
      "departureDate",
      "departureTime",
    ];

    fieldsToValidate.forEach((field) => {
      if (!visitData[field]) {
        setErrors(
          field,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        hasErrors = true;
      }
    });

    if (visited === "yes") {
      if (!visitData.previousVisitDate) {
        setErrors("previousVisitDate", "Previous visit date is required");
        hasErrors = true;
      }
      if (!visitData.reason) {
        setErrors("reason", "Reason for re-visit is required");
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      goToNextStep();
    }
  };

  // Add store subscription for detailed updates
  useEffect(() => {
    const unsubscribe = useDormitoryStore.subscribe(
      (state) => state.formData.visitDetails,
      (newVisitDetails, prevVisitDetails) => {
        const changes = Object.entries(newVisitDetails).reduce(
          (acc, [key, value]) => {
            if (value !== prevVisitDetails[key]) {
              acc[key] = { from: prevVisitDetails[key], to: value };
            }
            return acc;
          },
          {}
        );

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

  const generateArrivalTimeOptions = () => {
    const morningTimes = [
      { value: "7:30", label: "7:30 AM" },
      { value: "8:00", label: "8:00 AM" },
      { value: "8:30", label: "8:30 AM" },
      { value: "9:00", label: "9:00 AM" },
      { value: "9:30", label: "9:30 AM" },
      { value: "10:00", label: "10:00 AM" },
      { value: "10:30", label: "10:30 AM" },
      { value: "11:00", label: "11:00 AM" },
    ];

    const eveningTimes = [
      { value: "15:30", label: "3:30 PM" },
      { value: "16:00", label: "4:00 PM" },
      { value: "16:30", label: "4:30 PM" },
      { value: "17:00", label: "5:00 PM" },
    ];

    return (
      <>
        <optgroup label="Morning (7:30 AM - 11:00 AM)">
          {morningTimes.map((time) => (
            <option key={time.value} value={time.value}>
              {time.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Evening (3:30 PM - 5:00 PM)">
          {eveningTimes.map((time) => (
            <option key={time.value} value={time.value}>
              {time.label}
            </option>
          ))}
        </optgroup>
      </>
    );
  };

  const warningStyle = {
    position: "fixed",
    top: (index) => `${20 + index * 140}px`,
    right: "20px",
    backgroundColor: "#f39c12",
    color: "white",
    padding: "15px 25px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    zIndex: 9999,
    maxWidth: "600px",
    width: "600px",
    fontSize: "16px",
    animation: "fadeIn 0.3s ease-in",
    marginBottom: "15px",
    // position: "relative",
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
                  value={visitData.arrivalDate || visitData.visitDate || ""}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  max={getMaxArrivalDate()}
                />
                {formData.errors.visitDate && (
                  <span className="error">{formData.errors.visitDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Departure Date <span className="required"> *</span>
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={visitData.departureDate || ""}
                  onChange={handleInputChange}
                  min={visitData.visitDate || ""}
                  max={
                    visitData.visitDate
                      ? getMaxDepartureDate(visitData.visitDate)
                      : ""
                  }
                />
                {formData.errors.departureDate && (
                  <span className="error">{formData.errors.departureDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>Additional Message or Special Requests (Optional)</label>
                <textarea
                  name="additionalMessage"
                  value={visitData.additionalMessage || ""}
                  onChange={handleInputChange}
                  placeholder="Enter any additional message or special requests..."
                  rows={3}
                />
                {formData.errors.additionalMessage && (
                  <span className="error">
                    {formData.errors.additionalMessage}
                  </span>
                )}
              </div>
            </div>

            <div className="form-right-section">
              <div className="form-group">
                <label>
                  Arrival Time (Official Timming){" "}
                  <span className="required"> *</span>
                </label>
                <select
                  name="visitTime"
                  value={visitData.visitTime || ""}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  {generateArrivalTimeOptions()}
                </select>
                {formData.errors.visitTime && (
                  <span className="error">{formData.errors.visitTime}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Departure Time <span className="required"> *</span>
                  {Math.ceil(
                    (new Date(visitData.departureDate) -
                      new Date(visitData.visitDate)) /
                    (1000 * 60 * 60 * 24)
                  ) === 3 && (
                      <span
                        style={{
                          marginLeft: "5px",
                          fontSize: "14px",
                          color: "red",
                        }}
                      >
                        (You have to depart by 7:30 a.m, as only 3 nights are
                        allowed for accommodation)
                      </span>
                    )}
                </label>
                <select
                  name="departureTime"
                  value={visitData.departureTime || ""}
                  onChange={handleInputChange}
                  disabled={
                    Math.ceil(
                      (new Date(visitData.departureDate) -
                        new Date(visitData.visitDate)) /
                      (1000 * 60 * 60 * 24)
                    ) === 3
                  }
                >
                  <option value="">Select Time</option>
                  {generateTimeOptions()}
                </select>
                {formData.errors.departureTime && (
                  <span className="error">{formData.errors.departureTime}</span>
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
                  value={visitData.knownToMath || ""}
                  onChange={handleInputChange}
                  placeholder="Enter details if applicable"
                  pattern="[A-Za-z\s]*"
                  title="Only letters and spaces are allowed"
                />
                {formData.errors.knownToMath && (
                  <span className="error">{formData.errors.knownToMath}</span>
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
                <label>
                  Recommendation Letter (If any)
                  <span className="upload-restrictions">
                    (Max size: 2MB, Formats: JPEG, PNG, SVG)
                  </span>
                </label>
                <div className="upload-container">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    key={visitData.file ? "file-present" : "no-file"}
                  />
                  {visitData.file ? (
                    <div
                      className="uploaded-file"
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        backgroundColor: "#f5f5f5",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={
                            visitData.file.url.startsWith("http")
                              ? visitData.file.url
                              : `${MEDIA_BASE_URL}${visitData.file.url}`
                          }
                          alt="Recommendation Letter"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <span style={{ color: "#333", fontSize: "14px" }}>
                          {visitData.file.name || "Recommendation Letter"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateVisitDetails({ file: null });
                        }}
                        style={{
                          backgroundColor: "#ff4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "8px 15px",
                          cursor: "pointer",
                          fontSize: "14px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#ff0000")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#ff4444")
                        }
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
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
                  )}
                </div>
                {formData.errors.file && (
                  <span className="error">{formData.errors.file}</span>
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
            {formData.errors.visited && (
              <span className="error">{formData.errors.visited}</span>
            )}
          </div>

          {visited === "yes" && (
            <>
              <div className="form-group">
                <label>Previous Arrival Date</label>
                <input
                  type="date"
                  name="previousVisitDate"
                  value={visitData.previousVisitDate || ""}
                  onChange={handleInputChange}
                  max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
                />
                {formData.errors.previousVisitDate && (
                  <span className="error">
                    {formData.errors.previousVisitDate}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>State reason for re-visit</label>
                <textarea
                  rows={3}
                  name="reason"
                  value={visitData.reason}
                  onChange={handleInputChange}
                  placeholder="State reason for re-visit"
                />
                {formData.errors.reason && (
                  <span className="error">{formData.errors.reason}</span>
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

      {/* Success Popup */}
      {showUploadSuccess && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "15px 25px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-in",
          }}
        >
          Recommendation letter uploaded successfully!
        </div>
      )}

      {showCelebrationWarning && celebrationWarnings.length > 0 && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <h3
              style={{
                color: "#f39c12",
                marginBottom: "20px",
                borderBottom: "2px solid #f39c12",
                paddingBottom: "10px",
              }}
            >
              High Occupancy Alert!
            </h3>

            {celebrationWarnings.map((celebration, index) => (
              <div
                key={`${celebration.event}-${celebration.date}-${index}`}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  borderBottom:
                    index !== celebrationWarnings.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                <p style={{ marginBottom: "10px" }}>
                  <strong>{celebration.event}</strong> ({celebration.type})
                  celebration is scheduled on{" "}
                  {new Date(celebration.date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .split("/")
                    .join("-")}
                  {celebration.isArrival
                    ? " (your arrival date)"
                    : celebration.isDeparture
                      ? " (your departure date)"
                      : ""}
                  .
                </p>
                <p style={{ color: "#666" }}>
                  Expect higher than usual occupancy. Please consider alternate
                  dates or submit special requests if needed.
                </p>
              </div>
            ))}

            <button
              onClick={() => {
                setShowCelebrationWarning(false);
                setCelebrationWarnings([]);
              }}
              style={{
                backgroundColor: "#EA7704",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 30px",
                marginTop: "20px",
                cursor: "pointer",
                width: "100%",
                fontSize: "16px",
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitDetails;
