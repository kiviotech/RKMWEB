import React, { useEffect } from "react";
import edit_icon from "../../../../assets/icons/edit_icon.png"
import useApplicationStore from "../../../../../useApplicationStore";
import "./VerifyDetails.scss";
import { createNewGuestDetails } from "../../../../../services/src/services/guestDetailsService";
import { createNewBookingRequest } from "../../../../../services/src/services/bookingRequestService";

const VerifyDetails = () => {
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
        relationship: "booker",
        arrival_date: formData.visitDate,
        departure_date: formData.departureDate
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
            relationship: guest.guestRelation || "guest",
            arrival_date: formData.visitDate,
            departure_date: formData.departureDate
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
    // <div className="verify-details" style={{ marginLeft: "15px" }}>
    //   <h1>Verify Details</h1>
    //   <div className="table-container">
    //     <table>
    //       <thead>
    //         <tr>
    //           <th style={{ width: "5%" }}>Sl No.</th>
    //           <th style={{ width: "40%" }}>Name (s)</th>
    //           <th style={{ width: "5%", textAlign: "center" }}>Age</th>
    //           <th style={{ width: "5%", textAlign: "center" }}>Gender (M/F)</th>
    //           <th style={{ width: "15%" }}>Profession</th>
    //           <th style={{ width: "20%" }}>Initiation By</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {/* Applicant Row */}
    //         <tr>
    //           <td>1</td>
    //           <td>{formData.name}</td>
    //           <td style={{ textAlign: "center" }}>{formData.age}</td>
    //           <td style={{ textAlign: "center" }}>{formData.gender}</td>
    //           <td>{formData.occupation}</td>
    //           <td>{formData.deeksha || "Not specified"}</td>
    //         </tr>
    //         {/* Guest Rows */}
    //         {formData.guests.map((guest, index) => (
    //           <tr key={index}>
    //             <td>{index + 2}</td>
    //             <td>{guest.guestName}</td>
    //             <td style={{ textAlign: "center" }}>{guest.guestAge}</td>
    //             <td style={{ textAlign: "center" }}>{guest.guestGender}</td>
    //             <td>{guest.guestOccupation}</td>
    //             <td>{guest.guestDeeksha || "Not specified"}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>

    //   <div className="details-section">
    //     <p>
    //       <strong>Arrival Date and Time:</strong>{" "}
    //       {formatDateTime(formData.visitDate, formData.visitTime)}
    //     </p>
    //     <p>
    //       <strong>Departure Date and Time:</strong>{" "}
    //       {formatDateTime(formData.departureDate, formData.departureTime)}
    //     </p>
    //     <p>
    //       <strong>Total Days of Stay:</strong> {calculateStayDuration()}
    //     </p>
    //     {formData.visited === "yes" && (
    //       <p>
    //         <strong>
    //           Date of Last visit & stay in Ramakrishna Math Kamarpukur Guest House:
    //         </strong>{" "}
    //         {new Date(formData.previousVisitDate).toLocaleDateString()}
    //       </p>
    //     )}
    //   </div>

    //   <div className="address-details">
    //     <h2>Address Details</h2>
    //     {/* Applicant Address */}
    //     <div className="address-block">
    //       <h3>
    //         Applicant
    //         <img src={icons.edit} alt="Edit" className="edit-icon" />
    //       </h3>
    //       <p>
    //         <strong>Name:</strong> {formData.name}
    //       </p>
    //       <p>
    //         <strong>Address:</strong>{" "}
    //         {`${formData.address.houseNumber}, ${formData.address.streetName}`}
    //       </p>
    //       <p className="styleForCity">
    //         <strong>District:</strong> {formData.address.district}{" "}
    //         <strong>Pincode:</strong> {formData.address.pinCode}{" "}
    //         <strong>State:</strong> {formData.address.state}
    //       </p>
    //       <p>
    //         <strong>Mobile Number:</strong> +{formData.countryCode} {formData.phoneNumber}
    //       </p>
    //     </div>

    //     {/* Guest Addresses */}
    //     {formData.guests.map((guest, index) => (
    //       <div key={index} className="address-block">
    //         <h3>
    //           Guest {index + 1}
    //           <img src={icons.edit} alt="Edit" className="edit-icon" />
    //         </h3>
    //         <p>
    //           <strong>Name:</strong> {guest.guestName}
    //         </p>
    //         <p>
    //           <strong>Address:</strong>{" "}
    //           {`${guest.guestAddress.houseNumber}, ${guest.guestAddress.streetName}`}
    //         </p>
    //         <p className="styleForCity">
    //           <strong>District:</strong> {guest.guestAddress.district}{" "}
    //           <strong>Pincode:</strong> {guest.guestAddress.pinCode}{" "}
    //           <strong>State:</strong> {guest.guestAddress.state}
    //         </p>
    //         <p>
    //           <strong>Mobile Number:</strong> +{guest.countryCode} {guest.guestNumber}
    //         </p>
    //       </div>
    //     ))}
    //   </div>

    //   <div className="button-container">
    //     <button className="save">Save for later</button>
    //     <button className="submit-button" onClick={handleSubmit}>Submit</button>
    //   </div>
    // </div>
    <div className="verify-details" style={{marginLeft:'15px'}}>
      <h1>Verify Details</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>Sl No.</th>
              <th style={{ width: "40%" }}>Name (s)</th>
              <th style={{ width: "5%", textAlign: "center" }}>Age</th>
              <th style={{ width: "5%", textAlign: "center" }}>Gender (M/F)</th>
              <th style={{ width: "15%" }}>Profession</th>
              <th style={{ width: "20%" }}>Initiation By</th>
            </tr>
          </thead>
          <tbody>
            {/* Applicant Row */}
            <tr>
              <td>1</td>
              <td>{formData.name}</td>
              <td style={{ textAlign: "center" }}>{formData.age}</td>
              <td style={{ textAlign: "center" }}>{formData.gender}</td>
              <td>{formData.occupation}</td>
              <td>{formData.deeksha || "Not specified"}</td>
            </tr>
            {/* Guest Rows */}
            {formData.guests.map((guest, index) => (
              <tr key={index}>
                <td>{index + 2}</td>
                <td>{guest.guestName}</td>
                <td style={{ textAlign: "center" }}>{guest.guestAge}</td>
                <td style={{ textAlign: "center" }}>{guest.guestGender}</td>
                <td>{guest.guestOccupation}</td>
                <td>{guest.guestDeeksha || "Not specified"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details-section">
        <p>
          <strong>Arrival Date and Time :</strong>{" "}
          <span> {formatDateTime(formData.visitDate, formData.visitTime)}</span>
        </p>
        <p>
          <strong>Departure Date and Time :</strong>{" "}
          <span> {formatDateTime(formData.departureDate, formData.departureTime)}</span>
        </p>
        <p>
          <span><strong>Total Days of Stay :</strong> {calculateStayDuration()}</span>
        </p>
        {formData.visited === "yes" && (
          <p>
            <strong>
              Date of Last visit & stay in Ramakrishna Math Kamarpukur Guest House:
            </strong>{" "}
            {new Date(formData.previousVisitDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="address-details">
        <h2>Address Details</h2>
        {/* Applicant Address */}
        <div className="address-block">
          <h3>
            Applicant
            <img src={edit_icon} alt="Edit" className="edit-icon" />
          </h3>
          <p >
            <div><strong >Name :</strong> <span>{formData.name}</span></div>
           <div> <strong >Aadhaar Number :</strong> <span>{formData.aadhaar}</span></div>
            <div><strong >Mobile Number :</strong> <span>+{formData.countryCode} {formData.phoneNumber}</span></div>
          </p>
          <p>
            <strong>Address :</strong>{" "}
           <span> {`${formData.address.houseNumber}, ${formData.address.streetName}`}</span>
          </p>
          <p >
            <div><strong>District :</strong> <span>{formData.address.district}{" "}</span></div>
            <div><strong>Pincode :</strong><span> {formData.address.pinCode}{" "}</span></div>
            <div><strong>State :</strong> <span>{formData.address.state}</span></div>
          </p>
          {/* <p>
            <strong>Mobile Number :</strong> +{formData.countryCode} {formData.phoneNumber}
          </p> */}
        </div>

        {/* Guest Addresses */}
        {formData.guests.map((guest, index) => (
          <div key={index} className="address-block">
            <h3>
              Member {index + 1}
              <img src={edit_icon} alt="Edit" className="edit-icon" />
            </h3>
            <p >
              <div><strong>Name :</strong> {guest.guestName}</div>
              <div><strong>Aadhar Number :</strong> {guest.guestAadhaar}</div>
              <div><strong>Mobile Number :</strong> +{guest.countryCode} {guest.guestNumber}</div>
            </p>
            <p>
              <strong>Address :</strong>{" "}
              <span>{`${guest.guestAddress.houseNumber}, ${guest.guestAddress.streetName}`}</span>
            </p>
            <p style={{display:'flex',gap:'50px',}}>
           <div>   <strong>District :</strong> {guest.guestAddress.district}{" "}</div>
             <div> <strong>Pincode :</strong> {guest.guestAddress.pinCode}{" "}</div>
              <div><strong>State :</strong> {guest.guestAddress.state}</div>
            </p>
           
          </div>
        ))}
      </div>

      <div className="button-container">
        <button className="save">Save for later</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default VerifyDetails;
