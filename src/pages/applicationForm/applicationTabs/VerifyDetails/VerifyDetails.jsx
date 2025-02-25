import React, { useEffect, useState } from "react";
import edit_icon from "../../../../assets/icons/edit_icon.png";
import useApplicationStore from "../../../../../useApplicationStore";
import "./VerifyDetails.scss";
import { createNewGuestDetails } from "../../../../../services/src/services/guestDetailsService";
import { createNewBookingRequest } from "../../../../../services/src/services/bookingRequestService";
import { useNavigate } from "react-router-dom";
import { MEDIA_BASE_URL } from "../../../../../services/apiClient";

const VerifyDetails = () => {
  const { formData, uniqueNo, fetchLatestUniqueNumber } = useApplicationStore();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    fetchLatestUniqueNumber();
  }, []);

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date || !time) return "Not specified";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year} at ${time}`;
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
        contact: formData.phoneNumber,
      },
      guestDetails: formData.guests,
      visitDetails: {
        arrival: formatDateTime(formData.visitDate, formData.visitTime),
        departure: formatDateTime(
          formData.departureDate,
          formData.departureTime
        ),
        previousVisit: formData.previousVisitDate,
      },
    });
  }, [formData]);

  const handleSubmit = async () => {
    try {
      // Create main applicant guest details with unique_no
      const applicantData = {
        name: `${formData.title} ${formData.name}`.trim(),
        unique_no: uniqueNo, // Add unique number for main applicant
        phone_number: `+${formData.countryCode}${formData.phoneNumber}`,
        identity_proof: "Aadhaar",
        identity_number: formData.aadhaar,
        occupation: formData.occupation,
        address: `${formData.address.houseNumber}, ${formData.address.streetName}, ${formData.address.postOffice}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
        age: parseInt(formData.age),
        gender: formData.gender,
        status: "Not Arrived",
        deeksha: formData.deeksha,
        email:
          formData.email ||
          `${formData.name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
        relationship: "applicant",
        arrival_date: formData.visitDate,
        departure_date: formData.departureDate,
      };

      // Create main applicant guest record
      const mainGuestResponse = await createNewGuestDetails(applicantData);
      const mainGuestId = mainGuestResponse.data.id;

      // Create guest details for additional guests with incremented unique numbers
      const guestResponses = await Promise.all(
        formData.guests.map((guest, index) => {
          const guestData = {
            name: `${guest.guestTitle} ${guest.guestName}`.trim(),
            unique_no: `C${parseInt(uniqueNo?.substring(1)) + index + 1}`, // Add incremented unique number for each guest
            phone_number: `+${guest.countryCode}${guest.guestNumber}`,
            identity_proof: "Aadhaar",
            identity_number: guest.guestAadhaar,
            occupation: guest.guestOccupation,
            address: `${guest.guestAddress.houseNumber}, ${guest.guestAddress.streetName}, ${guest.guestAddress.postOffice}, ${guest.guestAddress.district}, ${guest.guestAddress.state}, ${guest.guestAddress.pinCode}`,
            age: parseInt(guest.guestAge),
            gender: guest.guestGender,
            status: "Not Arrived",
            deeksha: guest.guestDeeksha,
            email:
              guest.guestEmail ||
              `${guest.guestName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
            relationship: guest.guestRelation || "guest",
            arrival_date: formData.visitDate,
            departure_date: formData.departureDate,
          };
          return createNewGuestDetails(guestData);
        })
      );

      // Collect all guest IDs from the correct response path
      const guestIds = guestResponses.map((response) => response.data.id);

      // Create booking request with updated schema
      const bookingData = {
        status: "awaiting",
        name: `${formData.title} ${formData.name}`.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email,
        phone_number: `+${formData.countryCode}${formData.phoneNumber}`,
        occupation: formData.occupation,
        aadhaar_number: formData.aadhaar,
        // number_of_guest_members: formData.guests.length.toString(),
        reason_for_revisit: formData.reason || "",
        address: `${formData.address.houseNumber}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
        arrival_date: formData.visitDate,
        departure_date: formData.departureDate,
        deeksha: formData.deeksha,
        guests: [mainGuestId, ...guestIds],
        recommendation_letter: formData.file ? [formData.file] : [],
        // Add default values for required fields
        number_of_male_devotees: "0",
        number_of_female_devotees: "0",
      };

      await createNewBookingRequest(bookingData);

      // Handle successful submission
      // alert("Application submitted successfully!");
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const handleEditClick = (section) => {
    switch (section) {
      case "applicant":
        navigate("/application-form", { state: { activeTab: 0 } });
        break;
      case "guest":
        navigate("/application-form", { state: { activeTab: 1 } });
        break;
      default:
        break;
    }
  };

  const handlePreviewClick = () => {
    console.log("File URL:", formData.file?.url);
    setShowPreview(true);
  };

  return (
    <div className="verify-details">
      <h2>Guests / Visitors Details</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>Sl No.</th>
              <th style={{ width: "5%" }}>Unique No.</th>
              <th style={{ width: "20%" }}>Name (s)</th>
              <th style={{ width: "5%", textAlign: "center" }}>Age</th>
              <th style={{ width: "5%", textAlign: "center" }}>Gender</th>
              <th style={{ width: "10%" }}>Profession</th>
              <th style={{ width: "10%" }}>Initiated By</th>
              <th style={{ width: "15%" }}>Mobile No.</th>
              <th style={{ width: "15%" }}>Aadhaar</th>
              <th style={{ width: "15%" }}>Address</th>
            </tr>
          </thead>
          <tbody>
            {/* Applicant Row */}
            <tr>
              <td>1</td>
              <td>{uniqueNo}</td>
              <td>{`${formData.title} ${formData.name}`}</td>
              <td style={{ textAlign: "center" }}>{formData.age}</td>
              <td style={{ textAlign: "center" }}>{formData.gender}</td>
              <td>{formData.occupation}</td>
              <td>{formData.deeksha || "Not specified"}</td>
              <td>{`+${formData.countryCode} ${formData.phoneNumber}`}</td>
              <td>{formData.aadhaar}</td>
              <td>
                {[
                  formData.address.houseNumber,
                  formData.address.streetName,
                  formData.address.postOffice,
                  formData.address.district,
                  formData.address.state,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
            {/* Guest Rows */}
            {formData.guests.map((guest, index) => (
              <tr key={index}>
                <td>{index + 2}</td>
                <td>{`C${parseInt(uniqueNo?.substring(1)) + index + 1}`}</td>
                <td>{`${guest.guestTitle} ${guest.guestName}`}</td>
                <td style={{ textAlign: "center" }}>{guest.guestAge}</td>
                <td style={{ textAlign: "center" }}>{guest.guestGender}</td>
                <td>{guest.guestOccupation}</td>
                <td>{guest.guestDeeksha || "Not specified"}</td>
                <td>{`+${guest.countryCode} ${guest.guestNumber}`}</td>
                <td>{guest.guestAadhaar}</td>
                <td>
                  {guest.sameAsApplicant
                    ? "Same as applicant"
                    : [
                        guest.guestAddress.houseNumber,
                        guest.guestAddress.streetName,
                        guest.guestAddress.postOffice,
                        guest.guestAddress.district,
                        guest.guestAddress.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details-section">
        <p>
          <span style={{ marginLeft: "20px" }}>Arrival Date and Time :</span>{" "}
          <strong>
            {formatDateTime(formData.visitDate, formData.visitTime)}
          </strong>
        </p>
        <p>
          <span style={{ marginLeft: "20px" }}>Departure Date and Time :</span>{" "}
          <strong>
            {formatDateTime(formData.departureDate, formData.departureTime)}
          </strong>
        </p>
        <p>
          <span style={{ marginLeft: "20px" }}>Total Days of Stay :</span>{" "}
          <strong>{calculateStayDuration()}</strong>
        </p>
        {formData.visited === "yes" && formData.previousVisitDate ? (
          <p>
            <span style={{ marginLeft: "20px" }}>
              Date of Last visit & stay in Ramakrishna Math Kamarpukur Guest
              House:
            </span>{" "}
            <strong>
              {new Date(formData.previousVisitDate).toLocaleDateString("en-GB")}
            </strong>
          </p>
        ) : (
          <p>
            <span style={{ marginLeft: "20px" }}>Previously visited:</span>{" "}
            <strong>None</strong>
          </p>
        )}
        {formData.knownToMath && (
          <p>
            <span style={{ marginLeft: "20px" }}>
              Are you known to any of our Ramakrishna Math / Mission / Branch
              Centre / Monk(s) :
            </span>{" "}
            <strong>{formData.knownToMath}</strong>
          </p>
        )}
        {formData.file && Object.keys(formData.file).length > 0 && (
          <p>
            <span style={{ marginLeft: "20px" }}>Recommendation Letter :</span>{" "}
            <span>Document uploaded</span>{" "}
            <svg
              onClick={handlePreviewClick}
              style={{ cursor: "pointer", verticalAlign: "middle" }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </p>
        )}
      </div>

      {/* <div className="address-details">
        <h2>Address Details</h2>
        <div className="address-block">
          <div className="details-row">
            <div>
              <span>Name:</span>{" "}
              <strong>{`${formData.title} ${formData.name}`}</strong>
            </div>
            <div>
              <span>Aadhaar Number:</span> <strong>{formData.aadhaar}</strong>
            </div>
            <div>
              <span>Mobile Number:</span>{" "}
              <strong>
                +{formData.countryCode} {formData.phoneNumber}
              </strong>
            </div>
          </div>
          <div className="details-row">
            <div>
              <span>Pincode:</span>
              <strong> {formData.address.pinCode}</strong>
            </div>
            <div>
              <span>District:</span>{" "}
              <strong>{formData.address.district}</strong>
            </div>
            <div>
              <span>State:</span> <strong>{formData.address.state}</strong>
            </div>
          </div>
        </div>
      </div> */}

      {/* Add Additional Message section if it exists */}
      {formData.additionalMessage && (
        <div className="details-section">
          <h2>Additional Message / Special Requests</h2>
          <p>
            <strong>{formData.additionalMessage}</strong>
          </p>
        </div>
      )}

      <div className="button-container">
        {/* <button className="save">Save for later</button> */}
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Recommendation Letter Preview</h3>
              <button
                className="close-button"
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {formData.file?.url ? (
                <img
                  src={`${MEDIA_BASE_URL}${formData.file.url}`}
                  alt="Recommendation Letter"
                  style={{ maxWidth: "100%", maxHeight: "70vh" }}
                />
              ) : (
                <p>Preview not available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyDetails;
