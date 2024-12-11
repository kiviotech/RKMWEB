import React, { useEffect } from "react";
import edit_icon from "../../../../assets/icons/edit_icon.png";
import useApplicationStore from "../../../../../useApplicationStore";
import "./VerifyDetails.scss";
import { createNewGuestDetails } from "../../../../../services/src/services/guestDetailsService";
import { createNewBookingRequest } from "../../../../../services/src/services/bookingRequestService";
import { useNavigate } from "react-router-dom";

const VerifyDetails = () => {
  const { formData } = useApplicationStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

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
    return `${diffDays + 1} Days`;
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
        relationship: "applicant",
        arrival_date: formData.visitDate,
        departure_date: formData.departureDate,
      };

      // Create main applicant guest record
      const mainGuestResponse = await createNewGuestDetails(applicantData);
      const mainGuestId = mainGuestResponse.data.id;

      // Create guest details for additional guests
      const guestResponses = await Promise.all(
        formData.guests.map((guest) => {
          const guestData = {
            name: `${guest.guestTitle} ${guest.guestName}`.trim(),
            phone_number: `+${guest.countryCode}${guest.guestNumber}`,
            aadhaar_number: guest.guestAadhaar,
            occupation: guest.guestOccupation,
            address: `${guest.guestAddress.houseNumber}, ${guest.guestAddress.district}, ${guest.guestAddress.state}, ${guest.guestAddress.pinCode}`,
            age: parseInt(guest.guestAge),
            gender: guest.guestGender,
            status: "pending",
            deeksha: guest.guestDeeksha,
            email: guest.guestEmail,
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
        number_of_guest_members: formData.guests.length.toString(),
        reason_for_revisit: formData.reason || "",
        address: `${formData.address.houseNumber}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
        arrival_date: formData.visitDate,
        departure_date: formData.departureDate,
        deeksha: formData.deeksha,
        guests: [mainGuestId, ...guestIds],
        // Add the file to accommodation_requirements if it exists
        accommodation_requirements: formData.file ? [formData.file] : [],
        // Add default values for required fields
        number_of_male_devotees: "0",
        number_of_female_devotees: "0",
      };

      await createNewBookingRequest(bookingData);

      // Handle successful submission
      alert("Application submitted successfully!");
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

  return (
    <div className="verify-details">
      <h2>Guests / Visitors Details</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>Sl No.</th>
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
              <td>{`${formData.title} ${formData.name}`}</td>
              <td style={{ textAlign: "center" }}>{formData.age}</td>
              <td style={{ textAlign: "center" }}>{formData.gender}</td>
              <td>{formData.occupation}</td>
              <td>{formData.deeksha || "Not specified"}</td>
              <td>{`+${formData.countryCode} ${formData.phoneNumber}`}</td>
              <td>{formData.aadhaar}</td>
              <td>{`${formData.address.houseNumber}, ${formData.address.district}, ${formData.address.state}`}</td>
            </tr>
            {/* Guest Rows */}
            {formData.guests.map((guest, index) => (
              <tr key={index}>
                <td>{index + 2}</td>
                <td>{`${guest.guestTitle} ${guest.guestName}`}</td>
                <td style={{ textAlign: "center" }}>{guest.guestAge}</td>
                <td style={{ textAlign: "center" }}>{guest.guestGender}</td>
                <td>{guest.guestOccupation}</td>
                <td>{guest.guestDeeksha || "Not specified"}</td>
                <td>{`+${guest.countryCode} ${guest.guestNumber}`}</td>
                <td>{guest.guestAadhaar}</td>
                <td>{`${guest.guestAddress.houseNumber}, ${guest.guestAddress.district}, ${guest.guestAddress.state}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details-section">
        <p>
          <span>Arrival Date and Time :</span>{" "}
          <strong>
            {formatDateTime(formData.visitDate, formData.visitTime)}
          </strong>
        </p>
        <p>
          <span>Departure Date and Time :</span>{" "}
          <strong>
            {formatDateTime(formData.departureDate, formData.departureTime)}
          </strong>
        </p>
        <p>
          <span>
            <span>Total Days of Stay :</span>{" "}
            <strong>{calculateStayDuration()}</strong>
          </span>
        </p>
        {formData.visited === "yes" && (
          <p>
            Date of Last visit & stay in Ramakrishna Math Kamarpukur Guest
            House:{" "}
            <strong>
              {new Date(formData.previousVisitDate).toLocaleDateString("en-GB")}
            </strong>
          </p>
        )}
        <p>
          <span>
            Known to Ramakrishna Math / Mission / Branch Centre / Monk(s) :
          </span>{" "}
          <strong>
            {formData.knownToMath ? formData.knownToMath : "Not specified"}
          </strong>
        </p>
      </div>

      <div className="address-details">
        <h2>Address Details</h2>
        {/* Applicant Address */}
        <div className="address-block">
          <h3>
            Applicant
            <img
              src={edit_icon}
              alt="Edit"
              className="edit-icon"
              onClick={() => handleEditClick("applicant")}
              style={{ cursor: "pointer" }}
            />
          </h3>
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
            <strong>Address:</strong>{" "}
            <span>{`${formData.address.houseNumber}`}</span>
          </div>
          <div className="details-row">
            <div>
              <span>Landmark:</span>{" "}
              <strong>{formData.address.landmark || "Not specified"}</strong>
            </div>
          </div>
          <div className="details-row">
            <div>
              <span>District:</span>{" "}
              <strong>{formData.address.district}</strong>
            </div>
            <div>
              <span>Pincode:</span>
              <strong> {formData.address.pinCode}</strong>
            </div>
            <div>
              <span>State:</span> <strong>{formData.address.state}</strong>
            </div>
          </div>
        </div>

        {/* Guest Addresses */}
        {formData.guests.map((guest, index) => {
          // Check if guest address matches applicant address
          const isAddressSame =
            guest.guestAddress.houseNumber === formData.address.houseNumber &&
            guest.guestAddress.district === formData.address.district &&
            guest.guestAddress.state === formData.address.state &&
            guest.guestAddress.pinCode === formData.address.pinCode;

          return (
            <div key={index} className="address-block">
              <h3>
                Member {index + 1}
                <img
                  src={edit_icon}
                  alt="Edit"
                  className="edit-icon"
                  onClick={() => handleEditClick("guest")}
                  style={{ cursor: "pointer" }}
                />
              </h3>
              <div className="details-row">
                <div>
                  <span>Name:</span>{" "}
                  <strong>{`${guest.guestTitle} ${guest.guestName}`}</strong>
                </div>
                <div>
                  <span>Aadhar Number:</span>{" "}
                  <strong>{guest.guestAadhaar}</strong>
                </div>
                <div>
                  <span>Mobile Number:</span>{" "}
                  <strong>
                    +{guest.countryCode} {guest.guestNumber}
                  </strong>
                </div>
              </div>
              {!isAddressSame ? (
                <>
                  <div className="details-row">
                    <strong>Address:</strong>{" "}
                    <span>{`${guest.guestAddress.houseNumber}`}</span>
                  </div>
                  <div className="details-row">
                    <div>
                      <span>Landmark:</span>{" "}
                      <strong>
                        {guest.guestAddress.landmark || "Not specified"}
                      </strong>
                    </div>
                  </div>
                  <div className="details-row">
                    <div>
                      <span>District:</span>{" "}
                      <strong>{guest.guestAddress.district}</strong>
                    </div>
                    <div>
                      <span>Pincode:</span>{" "}
                      <strong>{guest.guestAddress.pinCode}</strong>
                    </div>
                    <div>
                      <span>State:</span>{" "}
                      <strong>{guest.guestAddress.state}</strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className="details-row">
                  <em>Same as applicant's address</em>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="button-container">
        {/* <button className="save">Save for later</button> */}
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default VerifyDetails;
