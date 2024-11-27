import React, { useEffect } from "react";
import { icons } from "../../../../constants";
import useApplicationStore from "../../../../../useApplicationStore";
import "./DormitoryVerifyDetails.scss";
import { createNewGuestDetails } from "../../../../../services/src/services/guestDetailsService";
import { createNewBookingRequest } from "../../../../../services/src/services/bookingRequestService";

const DormitoryVerifyDetails = () => {
  const { formData } = useApplicationStore();

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
  useEffect(() => {
    console.log("VerifyDetails - Current Zustand Store State:", {
      applicantDetails: {
        name: formData.name,
        address: formData.address,
        contact: formData.phoneNumber
      },
      guestDetails: formData.guests,
      visitDetails: {
        arrival: formatDateTime(formData.visitDate, formData.visitTime),
        departure: formatDateTime(formData.departureDate, formData.departureTime),
        previousVisit: formData.previousVisitDate
      }
    });
  }, [formData]);

  const handleSubmit = async () => {
    try {
      // Create main applicant guest details
      const applicantData = {
        name: `${formData.title} ${formData.name}`.trim(),
        phone_number: `+${formData.countryCode}${formData.phoneNumber}`,
        aadhaar_number: formData.aadhaar,
        occupation: formData.occupation,
        address: `${formData.address.houseNumber}, ${formData.address.streetName}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
        age: parseInt(formData.age),
        gender: formData.gender,
        status: "pending",
        deeksha: formData.deeksha,
        email: formData.email,
        relationship: "booker"
      };

      // Create main applicant guest record
      const mainGuestResponse = await createNewGuestDetails(applicantData);
      const mainGuestId = mainGuestResponse.data.id;

      // Create guest details for additional guests
      const guestResponses = await Promise.all(
        formData.guests.map(guest => {
          const guestData = {
            name: `${guest.guestTitle} ${guest.guestName}`.trim(),
            phone_number: `+${guest.countryCode}${guest.guestNumber}`,
            aadhaar_number: guest.guestAadhaar,
            occupation: guest.guestOccupation,
            address: `${guest.guestAddress.houseNumber}, ${guest.guestAddress.streetName}, ${guest.guestAddress.district}, ${guest.guestAddress.state}, ${guest.guestAddress.pinCode}`,
            age: parseInt(guest.guestAge),
            gender: guest.guestGender,
            status: "pending",
            deeksha: guest.guestDeeksha,
            email: guest.guestEmail,
            relationship: guest.guestRelation || "guest"
          };
          return createNewGuestDetails(guestData);
        })
      );

      // Collect all guest IDs from the correct response path
      const guestIds = guestResponses.map(response => response.data.id);

      // Create booking request
      const bookingData = {
        status: "awaiting",
        name: `${formData.title} ${formData.name}`.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email,
        phone_number: `+${formData.countryCode}${formData.phoneNumber}`,
        occupation: formData.occupation,
        aadhaar_number: formData.aadhaar,
        number_of_guest_members: formData.guests.length,
        reason_for_revisit: formData.reason || "",
        address: `${formData.address.houseNumber}, ${formData.address.streetName}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
        arrival_date: formData.visitDate,
        departure_date: formData.departureDate,
        deeksha: formData.deeksha,
        guests: [mainGuestId, ...guestIds]
      };

      await createNewBookingRequest(bookingData);
      
      // Handle successful submission
      alert("Application submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="verify-details">
      <h1 className="verify-title">Verify Details</h1>
      
      <div className="details-grid">
        <div className="detail-row">
          <span className="detail-label">Institution Name:</span>
          <span className="detail-value">{formData.institutionName}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Institution Type:</span>
          <span className="detail-value">{formData.institutionType}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Contact Person Name:</span>
          <span className="detail-value">{formData.name}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Age:</span>
          <span className="detail-value">{formData.age} years</span>
          
          <span className="detail-label gender-label">Gender:</span>
          <span className="detail-value">{formData.gender}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Phone number:</span>
          <span className="detail-value">+{formData.countryCode} {formData.phoneNumber}</span>
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

        <div className="detail-row">
          <span className="detail-label">Departure Date and time:</span>
          <span className="detail-value">
            {formatDateTime(formData.departureDate, formData.departureTime)}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Total Days of Stay:</span>
          <span className="detail-value">{calculateStayDuration()}</span>
        </div>
      </div>

      <div className="section-title">
        <h2>Address Details</h2>
        <button className="edit-button">Edit</button>
      </div>

      <div className="address-section">
        <div className="detail-row">
          <span className="detail-label">Address:</span>
          <span className="detail-value">{formData.address.houseNumber}, {formData.address.streetName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">District:</span>
          <span className="detail-value">{formData.address.district}</span>
          
          <span className="detail-label">Pincode:</span>
          <span className="detail-value">{formData.address.pinCode}</span>
          
          <span className="detail-label">State:</span>
          <span className="detail-value">{formData.address.state}</span>
        </div>
      </div>

      <div className="section-title">
        <h2>Accommodation Details</h2>
        <button className="edit-button">Edit</button>
      </div>

      <div className="accommodation-section">
        <div className="detail-row">
          <span className="detail-label">Total Number of Devotees:</span>
          <span className="detail-value">{formData.guests.length + 1}</span>
        </div>
        {/* Add more accommodation details as needed */}
      </div>

      <div className="button-container">
        <button className="save-button">Save for later</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default DormitoryVerifyDetails;
