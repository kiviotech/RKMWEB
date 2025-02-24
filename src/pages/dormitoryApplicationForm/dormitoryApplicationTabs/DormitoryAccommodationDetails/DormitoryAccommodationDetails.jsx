import React, { useState, useEffect, useRef } from "react";
import CommonButton from "../../../../components/ui/Button";
import "./DormitoryAccommodationDetails.scss";
import useDormitoryStore from "../../../../../dormitoryStore";
import apiClient, {
  MEDIA_BASE_URL,
  BASE_URL,
} from "../../../../../services/apiClient";
import { useAuthStore } from "../../../../../store/authStore";
import { toast } from "react-toastify";

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
      stroke="#EA7704"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DormitoryAccommodationDetails = ({
  goToNextStep,
  goToPrevStep,
  tabName,
}) => {
  const { formData, updateFormData } = useDormitoryStore();
  const [errors, setErrors] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Add useEffect to log data whenever it changes
  useEffect(() => {
    console.log("Current Accommodation Data:", formData.accommodation);
    console.log("Complete Form Data:", formData);
  }, [formData]);

  const validateField = (field, value, maleCount, femaleCount, totalCount) => {
    if (!value) {
      return `${
        field.charAt(0).toUpperCase() +
        field.slice(1).replace(/([A-Z])/g, " $1")
      } is required`;
    }

    // Add validation for total matching male + female
    if (
      field === "totalPeople" &&
      parseInt(value) !== parseInt(maleCount || 0) + parseInt(femaleCount || 0)
    ) {
      return "Total people must equal the sum of male and female devotees";
    }
    if (
      (field === "maleDevotees" || field === "femaleDevotees") &&
      parseInt(maleCount || 0) + parseInt(femaleCount || 0) !==
        parseInt(totalCount || 0)
    ) {
      return "Sum of male and female devotees must equal total people";
    }

    return "";
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} with value:`, value);

    // Get the current values for validation
    const updatedAccommodation = {
      ...formData.accommodation,
      [field]: value,
    };

    // Validate the changed field and update related fields
    const error = validateField(
      field,
      value,
      updatedAccommodation.maleDevotees,
      updatedAccommodation.femaleDevotees,
      updatedAccommodation.totalPeople
    );

    updateFormData({
      accommodation: updatedAccommodation,
    });

    // Update errors
    setErrors((prev) => ({
      ...prev,
      [field]: error,
      // Clear other related field errors if this field is valid
      ...(error === "" && {
        totalPeople: "",
        maleDevotees: "",
        femaleDevotees: "",
      }),
    }));
  };

  const handleBack = () => {
    console.log("Going back with current data:", formData.accommodation);
    goToPrevStep();
  };

  const handleProceed = () => {
    console.log("Proceeding with accommodation data:", formData.accommodation);
    const { totalPeople, maleDevotees, femaleDevotees } =
      formData.accommodation;

    const newErrors = {
      totalPeople: validateField(
        "totalPeople",
        totalPeople,
        maleDevotees,
        femaleDevotees,
        totalPeople
      ),
      maleDevotees: validateField(
        "maleDevotees",
        maleDevotees,
        maleDevotees,
        femaleDevotees,
        totalPeople
      ),
      femaleDevotees: validateField(
        "femaleDevotees",
        femaleDevotees,
        maleDevotees,
        femaleDevotees,
        totalPeople
      ),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      goToNextStep();
    }
  };

  const handleFileUpload = async (file) => {
    try {
      // Check if file exists
      if (!file) {
        throw new Error("No file selected");
      }

      // Check file size (limit to 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          "File size exceeds 5MB limit. Please upload a smaller file."
        );
      }

      // Create FormData and append file with specific name
      const formData = new FormData();
      formData.append("files", file, file.name); // Add filename as third parameter

      // Debug log to verify FormData content
      for (let [key, value] of formData.entries()) {
        console.log("FormData Entry:", {
          key: key,
          fileName: value.name,
          fileType: value.type,
          fileSize: value.size,
        });
      }

      const token = useAuthStore.getState().token;

      // Make the API request
      const response = await apiClient.post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove Content-Type to let browser set it with boundary
        },
        transformRequest: [
          (data, headers) => {
            // Remove Content-Type header, let browser set it
            delete headers["Content-Type"];
            return data;
          },
        ],
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload progress:", percentCompleted + "%");
        },
      });

      // Handle successful response
      if (response.data) {
        console.log("File uploaded successfully:", response.data);
        setUploadedFile(file.name);
        updateFormData({
          accommodation: {
            ...formData.accommodation,
            uploadedFile: response.data.fileUrl,
          },
        });

        // Show success toast
        toast.success("File uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Upload Error Details:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
        formDataContent: Array.from(formData.entries()),
      });

      // Show error toast instead of alert
      if (error.response?.data?.error) {
        toast.error(`Upload failed: ${error.response.data.error.message}`);
      } else if (error.message.includes("Network Error")) {
        toast.error(
          "Network error occurred. Please check your internet connection and try again."
        );
      } else {
        toast.error(
          error.message || "Failed to upload file. Please try again."
        );
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      handleFileUpload(file);
    } else {
      alert("Please upload only Excel files (.xlsx)");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    // Debug log for selected file
    console.log("Selected file details:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      lastModified: new Date(file.lastModified).toISOString(),
    });

    // Validate file type
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Please upload only Excel files (.xlsx)");
      return;
    }

    // Validate file size
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    handleFileUpload(file);
  };

  const handleDownloadTemplate = () => {
    window.open(`${BASE_URL}/downloads/accommodation-template.xlsx`, "_blank");
  };

  return (
    <div className="accommodation-details">
      <h2>Accommodation Details</h2>
      <p className="subtitle">
        Please provide the details of your accommodation requirements
      </p>

      {/* Excel Upload Section */}
      <div className="excel-section">
        <button className="download-template" onClick={handleDownloadTemplate}>
          <DownloadIcon />
          Download Template
        </button>

        <div
          className="upload-box"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="drag-drop-area">
            <div className="upload-icon">↑</div>
            <p>{uploadedFile || "Drag & drop the Excel file here"}</p>
            <p className="or-text">or</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".xlsx"
              style={{ display: "none" }}
            />
            <button
              className="choose-file"
              onClick={() => fileInputRef.current.click()}
            >
              Choose file
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="form-fields">
        <div className="form-group">
          <label>
            Total number of people <span className="required">*</span>
          </label>
          <input
            type="number"
            placeholder="Number of people"
            value={formData.accommodation.totalPeople}
            onChange={(e) => handleInputChange("totalPeople", e.target.value)}
          />
          {errors.totalPeople && (
            <span className="error">{errors.totalPeople}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Number of Male Devotees <span className="required">*</span>
            </label>
            <input
              type="number"
              placeholder="type the number of students/devotees"
              value={formData.accommodation.maleDevotees}
              onChange={(e) =>
                handleInputChange("maleDevotees", e.target.value)
              }
            />
            {errors.maleDevotees && (
              <span className="error">{errors.maleDevotees}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Number of Female Devotees <span className="required">*</span>
            </label>
            <input
              type="number"
              placeholder="type the number of students/devotees"
              value={formData.accommodation.femaleDevotees}
              onChange={(e) =>
                handleInputChange("femaleDevotees", e.target.value)
              }
            />
            {errors.femaleDevotees && (
              <span className="error">{errors.femaleDevotees}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Special Requests/Additional information</label>
          <textarea
            placeholder="Specify If any special requests"
            value={formData.accommodation.specialRequests}
            onChange={(e) =>
              handleInputChange("specialRequests", e.target.value)
            }
          />
        </div>

        <div className="info-box">
          <i className="info-icon">i</i>
          <p>
            Download the Excel Sheet and fill in all the Members Details, then
            upload the file in the Upload Section above.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="back-btn" onClick={handleBack}>
          Back
        </button>
        <button className="proceed-btn" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default DormitoryAccommodationDetails;
