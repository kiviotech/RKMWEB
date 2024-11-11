// import React from "react";
// import ApplicationDetails from "../applicationDetails/ApplicationDetails";
// import GuestDetails from "../GuestDetails/GuestDetails";
// import VisitDetails from "../VisitDetails/VisitDetails";
// import useApplicationStore from "../../../../../useApplicationStore";
// import CommonButton from "../../../../components/ui/Button";
// import { createGuestDetails } from "../../../../../services/src/api/repositories/guestDetailsRepository";
// import { createBookingRequest } from "../../../../../services/src/api/repositories/bookingRequestRepository";

// const VerifyDetails = ({ tabName }) => {
//   const { formData, errors } = useApplicationStore();
//   console.log(formData);

//   const handleSubmit = async () => {
//     try {
//       const validGuests = formData.guests.filter(
//         (guest) => guest.guestName && guest.guestAadhaar
//       );

//       if (validGuests.length === 0) {
//         alert("Please fill in guest details before submitting.");
//         return;
//       }

//       const guestDetailsData = validGuests.map((guest) => ({
//         name: guest.guestName,
//         phone_number: guest.guestNumber,
//         aadhaar_number: guest.guestAadhaar,
//         occupation: guest.guestOccupation,
//         address: `${guest.guestAddress1.houseNumber}, ${guest.guestAddress1.streetName}, ${guest.guestAddress1.district}, ${guest.guestAddress1.state}, ${guest.guestAddress1.pinCode}`,
//         room_allocation: null,
//         donations: [],
//         booking_request: null,
//         age: formData.age,
//         gender: formData.gender,
//         status: "approved",
//         relationship: guest.guestRelation,
//         deeksha: formData.deeksha,
//       }));

//       const responses = await Promise.all(
//         guestDetailsData.map((guestData) => createGuestDetails(guestData))
//       );

//       const guestIds = responses.map((response) => response.data.data.id);

//       const bookingRequestData = {
//         status: "awaiting",
//         admin_comment: "",
//         name: formData.name,
//         age: formData.age,
//         gender: formData.gender,
//         email: formData.email,
//         phone_number: formData.phoneNumber,
//         occupation: formData.occupation,
//         aadhaar_number: formData.aadhaar,
//         number_of_guest_members: formData.guestMembers,
//         recommendation_letter: [],
//         reason_for_revisit: formData.reason,
//         address: `${formData.address.houseNumber}, ${formData.address.streetName}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
//         notifications: [],
//         room_allocations: [],
//         guest_house: null,
//         guests: guestIds,
//         arrival_date: formData.visitDate,
//         departure_date: formData.departureDate,
//         deeksha: formData.deeksha,
//       };

//       const bookingResponse = await createBookingRequest(bookingRequestData);

//       if (bookingResponse.status === 200) {
//         console.log(
//           "Booking request successfully submitted:",
//           bookingResponse.data
//         );
//         alert("Booking request successfully submitted!");
//       } else {
//         console.error("Error creating booking request:", bookingResponse);
//         alert("Error creating booking request. Please try again.");
//       }
//     } catch (error) {
//       console.error(
//         "Error submitting guest details or booking request:",
//         error
//       );
//       alert(
//         "Error submitting guest details or booking request. Please try again."
//       );
//     }
//   };

//   return (
//     <>
//       <ApplicationDetails formData={formData} errors={errors} />
//       <GuestDetails formData={formData} errors={errors} />
//       <VisitDetails formData={formData} errors={errors} />
//       {tabName && (
//         <div className="submit-button">
//           <CommonButton
//             buttonName="Submit"
//             style={{
//               backgroundColor: "#9867E9",
//               color: "#FFFFFF",
//               borderColor: "#9867E9",
//               fontSize: "18px",
//               borderRadius: "7px",
//               borderWidth: 1,
//               padding: "15px 100px",
//             }}
//             onClick={handleSubmit}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default VerifyDetails;
import React from "react";
import ApplicationDetails from "../applicationDetails/ApplicationDetails";
import GuestDetails from "../GuestDetails/GuestDetails";
import VisitDetails from "../VisitDetails/VisitDetails";
import useApplicationStore from "../../../../../useApplicationStore";
import CommonButton from "../../../../components/ui/Button";
import { createGuestDetails } from "../../../../../services/src/api/repositories/guestDetailsRepository";
import { createBookingRequest } from "../../../../../services/src/api/repositories/bookingRequestRepository";

const VerifyDetails = ({ tabName }) => {
  const { formData, errors } = useApplicationStore();
  console.log(formData); // Log form data for debugging

  const handleSubmit = async () => {
    try {
      // Filter guests with valid name and Aadhaar
      const validGuests = formData.guests.filter(
        (guest) => guest.guestName && guest.guestAadhaar
      );

      if (validGuests.length === 0) {
        alert("Please fill in guest details before submitting.");
        return;
      }

      // Create guest details for each valid guest
      const guestDetailsData = validGuests.map((guest) => ({
        name: guest.guestName,
        phone_number: guest.guestNumber,
        aadhaar_number: guest.guestAadhaar,
        occupation: guest.guestOccupation,
        address: `${guest.guestAddress1.houseNumber}, ${guest.guestAddress1.streetName}, ${guest.guestAddress1.district}, ${guest.guestAddress1.state}, ${guest.guestAddress1.pinCode}`,
        room_allocation: null,
        donations: [],
        booking_request: null,
        age: formData.age,
        gender: formData.gender,
        status: "approved",
        relationship: guest.guestRelation || "guest", // Default to 'guest'
        deeksha: formData.deeksha,
      }));

      // Add booker (user) details as a guest
      const bookerAsGuest = {
        name: formData.name,
        phone_number: formData.phoneNumber,
        aadhaar_number: formData.aadhaar,
        occupation: formData.occupation,
        address: `${formData.address.houseNumber}, ${formData.address.streetName}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
        room_allocation: null,
        donations: [],
        booking_request: null,
        age: formData.age,
        gender: formData.gender,
        status: "approved",
        relationship: "booker", // Set booker relationship explicitly
        deeksha: formData.deeksha,
      };

      // Combine both guest and booker details into one array
      guestDetailsData.push(bookerAsGuest);

      // Log the data before sending
      console.log("Guest Details Data being sent:", guestDetailsData);

      // Submit all guest details and collect guest IDs
      const responses = await Promise.all(
        guestDetailsData.map((guestData) =>
          createGuestDetails(guestData).catch((error) => {
            console.error(
              "Error response:",
              error.response?.data || error.message
            );
            throw error; // rethrow to be caught in outer catch block
          })
        )
      );

      // Extract guest IDs from the responses
      const guestIds = responses.map((response) => response.data.data.id);

      // Prepare booking request data
      const bookingRequestData = {
        status: "awaiting",
        admin_comment: "",
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        email: formData.email,
        phone_number: formData.phoneNumber,
        occupation: formData.occupation,
        aadhaar_number: formData.aadhaar,
        number_of_guest_members: formData.guestMembers,
        recommendation_letter: [],
        reason_for_revisit: formData.reason,
        address: `${formData.address.houseNumber}, ${formData.address.streetName}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pinCode}`,
        notifications: [],
        room_allocations: [],
        guest_house: null,
        guests: guestIds, // Using collected guest IDs (including booker)
        arrival_date: formData.visitDate,
        departure_date: formData.departureDate,
        deeksha: formData.deeksha,
      };

      // Submit the booking request
      const bookingResponse = await createBookingRequest(bookingRequestData);

      if (bookingResponse.status === 200) {
        console.log(
          "Booking request successfully submitted:",
          bookingResponse.data
        );
        alert("Booking request successfully submitted!");
      } else {
        console.error("Error creating booking request:", bookingResponse);
        alert("Error creating booking request. Please try again.");
      }
    } catch (error) {
      // Log detailed error information
      console.error(
        "Detailed error response:",
        error.response?.data || error.message
      );
      alert(
        "Error submitting guest details or booking request. Please check the console for details."
      );
    }
  };

  return (
    <>
      <ApplicationDetails formData={formData} errors={errors} />
      <GuestDetails formData={formData} errors={errors} />
      <VisitDetails formData={formData} errors={errors} />
      {tabName && (
        <div className="submit-button">
          <CommonButton
            buttonName="Submit"
            style={{
              backgroundColor: "#9867E9",
              color: "#FFFFFF",
              borderColor: "#9867E9",
              fontSize: "18px",
              borderRadius: "7px",
              borderWidth: 1,
              padding: "15px 100px",
            }}
            onClick={handleSubmit}
          />
        </div>
      )}
    </>
  );
};

export default VerifyDetails;
