import React, { useEffect } from "react";
import { icons } from "../../../../constants";
import useDormitoryStore from "../../../../../dormitoryStore";
import "./DormitoryVerifyDetails.scss";
import { createNewBookingRequest } from "../../../../../services/src/services/bookingRequestService";
import { useNavigate } from "react-router-dom";
import { createNewGuestDetails } from "../../../../../services/src/services/guestDetailsService";
import { toast } from "react-toastify";

const DormitoryVerifyDetails = () => {
  const { formData, uniqueNo, fetchLatestUniqueNumber } = useDormitoryStore();
  const navigate = useNavigate();

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date || !time) return "Not specified";
    const formattedDate = new Date(date).toLocaleDateString();
    return `${formattedDate} at ${time}`;
  };

  // Calculate total days of stay
  const calculateStayDuration = () => {
    if (!formData.visitDate || !formData.departureDate) return "Not specified";
    const arrival = new Date(formData.visitDate);
    const departure = new Date(formData.departureDate);
    const diffTime = Math.abs(departure - arrival);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  // Log store data
  // useEffect(() => {
  //   console.log("VerifyDetails - Current Zustand Store State:", {
  //     applicantDetails: {
  //       name: formData.name,
  //       address: formData.address,
  //       contact: formData.phoneNumber,
  //     },
  //     guestDetails: formData.guests,
  //     visitDetails: {
  //       arrival: formatDateTime(formData.visitDate, formData.visitTime),
  //       departure: formatDateTime(
  //         formData.departureDate,
  //         formData.departureTime
  //       ),
  //       previousVisit: formData.previousVisitDate,
  //     },
  //   });
  // }, [formData]);

  const handleSubmit = async () => {
    try {
      // Create main applicant guest details
      const applicantData = {
        name: `${formData.title} ${formData.contactPersonName}`.trim(),
        unique_no: uniqueNo,
        phone_number: `+${formData.countryCode}${formData.phoneNumber}`,
        identity_proof: "Aadhaar",
        identity_number: formData.aadhaar,
        occupation: formData.occupation || "",
        address: `${formData.address?.houseNumber}, ${formData.address?.streetName}, ${formData.address?.district}, ${formData.address?.state}, ${formData.address?.pinCode}`,
        age: parseInt(formData.age),
        gender: formData.gender,
        status: "Not Arrived",
        deeksha: formData.deeksha,
        email: formData.email,
        relationship: "applicant",
        arrival_date: formData.visitDetails?.visitDate,
        departure_date: formData.visitDetails?.departureDate,
      };

      // Create main applicant guest record
      const mainGuestResponse = await createNewGuestDetails(applicantData);
      const mainGuestId = mainGuestResponse.data.id;

      // Create booking request with the guest ID
      const bookingData = {
        status: "awaiting",
        admin_comment: "",
        name: `${formData.title} ${formData.contactPersonName}`.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email,
        phone_number: `+${formData.countryCode}${formData.phoneNumber}`,
        occupation: formData.occupation || "",
        aadhaar_number: formData.aadhaar,
        number_of_guest_members: (
          parseInt(formData.accommodation?.maleDevotees || 0) +
          parseInt(formData.accommodation?.femaleDevotees || 0)
        ).toString(),
        recommendation_letter: formData.visitDetails?.file
          ? [formData.visitDetails.file]
          : [],
        reason_for_revisit: formData.visitDetails?.reason || "",
        address: `${formData.address?.houseNumber}, ${formData.address?.streetName}, ${formData.address?.district}, ${formData.address?.state}, ${formData.address?.pinCode}`,
        notifications: [],
        guests: [mainGuestId], // Only include the main guest ID
        arrival_date: formData.visitDetails?.visitDate,
        departure_date: formData.visitDetails?.departureDate,
        deeksha: formData.deeksha,
        number_of_male_devotees:
          formData.accommodation?.maleDevotees?.toString() || "0",
        number_of_female_devotees:
          formData.accommodation?.femaleDevotees?.toString() || "0",
        additional_information: formData.accommodation?.specialRequests || "",
        accommodation_requirements: [],
      };

      const response = await createNewBookingRequest(bookingData);

      if (response) {
        toast.success("Application submitted successfully!", {
          onClose: () => navigate("/thank-you"),
          autoClose: 2000, // Will show for 2 seconds before redirecting
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  const handleAccommodationEdit = () => {
    console.log("Navigating to accommodation details..."); // Debug log
    navigate("/dormitory-application-form", {
      state: { activeTab: 1 },
      replace: true, // Add replace to ensure clean navigation
    });
  };

  const handleAddressEdit = () => {
    console.log("Navigating to address details...");
    navigate("/dormitory-application-form", {
      state: { activeTab: 0 }, // Application Details tab index
      replace: true,
    });
  };

  return (
    <div className="verify-details">
      <h2 className="verify-title">Verify Details</h2>

      <div className="details-section">
        {/* Institution Details */}
        <div className="detail-row">
          <span className="detail-label">Institution Name:</span>
          <span className="detail-value">{formData.institutionName}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Institution Type:</span>
          <span className="detail-value">
            {formData.institutionType}
            {formData.otherInstitutionType &&
              ` - ${formData.otherInstitutionType}`}
          </span>
        </div>

        {/* Personal Details */}
        <div className="detail-row">
          <span className="detail-label">Title:</span>
          <span className="detail-value">{formData.title}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Contact Person Name:</span>
          <span className="detail-value">{formData.contactPersonName}</span>
        </div>

        <div className="detail-row age-gender">
          <div>
            <span className="detail-label">Age:</span>
            <span className="detail-value">{formData.age} years</span>
          </div>
          <div>
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{formData.gender}</span>
          </div>
        </div>

        <div className="detail-row">
          <span className="detail-label">Phone number:</span>
          <span className="detail-value">
            +{formData.countryCode} {formData.phoneNumber}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Email-ID:</span>
          <span className="detail-value">{formData.email}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Aadhaar Number:</span>
          <span className="detail-value">{formData.aadhaar}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Initiation By:</span>
          <span className="detail-value">{formData.deeksha}</span>
        </div>

        {/* Visit Details */}
        <div className="detail-row">
          <span className="detail-label">Visit Date and Time:</span>
          <span className="detail-value">
            {formatDateTime(
              formData.visitDetails.visitDate,
              formData.visitDetails.visitTime
            )}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Departure Date and Time:</span>
          <span className="detail-value">
            {formatDateTime(
              formData.visitDetails.departureDate,
              formData.visitDetails.departureTime
            )}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Previous Visit:</span>
          <span className="detail-value">
            {formData.visitDetails.visited === "yes" ? "Yes" : "No"}
          </span>
        </div>

        {formData.visitDetails.previousVisitDate && (
          <div className="detail-row">
            <span className="detail-label">Previous Visit Date:</span>
            <span className="detail-value">
              {formData.visitDetails.previousVisitDate}
            </span>
          </div>
        )}

        {formData.visitDetails.reason && (
          <div className="detail-row">
            <span className="detail-label">Reason for Visit:</span>
            <span className="detail-value">{formData.visitDetails.reason}</span>
          </div>
        )}
      </div>

      <div className="section-header">
        <h2>Address Details</h2>
        <button
          type="button"
          className="edit-button"
          onClick={() => handleAddressEdit()}
        >
          Edit
        </button>
      </div>

      <div className="address-section">
        <div className="detail-row">
          <span className="detail-label">Address:</span>
          <span className="detail-value">
            {formData.address?.houseNumber}, {formData.address?.streetName}
          </span>
        </div>
        <div className="detail-row location-details">
          <div>
            <span className="detail-label">District:</span>
            <span className="detail-value">{formData.address?.district}</span>
          </div>
          <div>
            <span className="detail-label">Pincode:</span>
            <span className="detail-value">{formData.address?.pinCode}</span>
          </div>
          <div>
            <span className="detail-label">State:</span>
            <span className="detail-value">{formData.address?.state}</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>Accommodation Details</h2>
        <button
          type="button" // Explicitly set button type
          className="edit-button"
          onClick={() => handleAccommodationEdit()} // Use arrow function to ensure proper binding
        >
          Edit
        </button>
      </div>

      <div className="accommodation-section">
        <div className="detail-row">
          <span className="detail-label">Total Number of People:</span>
          <span className="detail-value">
            {formData.accommodation.totalPeople}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Male Devotees:</span>
          <span className="detail-value">
            {formData.accommodation.maleDevotees}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Female Devotees:</span>
          <span className="detail-value">
            {formData.accommodation.femaleDevotees}
          </span>
        </div>

        {formData.accommodation.specialRequests && (
          <div className="detail-row">
            <span className="detail-label">Special Requests:</span>
            <span className="detail-value">
              {formData.accommodation.specialRequests}
            </span>
          </div>
        )}

        {formData.visitDetails.file && (
          <div className="detail-row">
            <span className="detail-label">Uploaded File:</span>
            <span className="detail-value">
              {formData.visitDetails.file.name}
            </span>
          </div>
        )}
      </div>

      <div className="button-container">
        <button className="save-button">Save for later</button>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default DormitoryVerifyDetails;
