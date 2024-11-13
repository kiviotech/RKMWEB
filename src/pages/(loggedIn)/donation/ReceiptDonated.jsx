import React, { useState } from "react";
import "./ReceiptDonating.scss";
import icons from "../../../constants/icons";
import ReceiptWarning from "./ReceiptWarning";
import useGuestStore from "../../../../guestStore";

const ReceiptDonating = () => {
  const guest = useGuestStore((state) => state.selectedGuest);
  console.log(guest);
  const [donorDetails, setDonorDetails] = useState({
    name: "John Doe",
    phone: "+91 9212341902",
    email: "johndoe87@gmail.com",
    dateOfDonation: "24/02/2023",
  });

  const [donations, setDonations] = useState([
    {
      receiptNumber: "CJ2077",
      transactionType: "",
      reasonForDonation: "",
      amount: "",
    },
    {
      receiptNumber: "CJ2063",
      transactionType: "",
      reasonForDonation: "",
      amount: "",
    },
  ]);

  const [totalDonationAmount, setTotalDonationAmount] = useState(50000);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  const handleDonationChange = (index, field, value) => {
    const newDonations = [...donations];
    newDonations[index][field] = value;
    setDonations(newDonations);
  };

  const addDonation = () => {
    setDonations([
      ...donations,
      {
        receiptNumber: "",
        transactionType: "",
        reasonForDonation: "",
        amount: "",
      },
    ]);
  };

  const deleteDonation = (index) => {
    const newDonations = donations.filter((_, i) => i !== index);
    setDonations(newDonations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Donor Details:", donorDetails);
    console.log("Donations:", donations);
    console.log("Total Donation Amount:", totalDonationAmount);
  };

  const handleEditClick = () => {
    setShowWarningPopup(true); // Show the warning popup
  };

  const closeWarningPopup = () => {
    setShowWarningPopup(false); // Close the warning popup
  };

  return (
    <div className="receipt-form">
      <h2>Receipt Details</h2>
      {/* <form onSubmit={handleSubmit}> */}
      <div>
        <h3>Donor Details</h3>
        <form className="donor-details" onSubmit={handleSubmit}>
          <div className="dd-row">
            <label>Name of Donor:</label>
            <input type="text" value={guest.name} readOnly />
          </div>
          <div className="dd-row">
            <label>Phone No.:</label>
            <input type="text" value={guest.phone_number} readOnly />
          </div>

          <div className="dd-row">
            <label>Email ID:</label>
            <input type="email" value={donorDetails.email} readOnly />
          </div>

          <div className="dd-row">
            <label>Date of Donation:</label>
            <input type="date" value={donorDetails.dateOfDonation} readOnly />
          </div>
        </form>
      </div>

      <div className="donations-section">
        <h3>Donations</h3>
        {guest.donations?.data?.length > 0 ? (
          guest.donations.data.map((donation, index) => (
            <div key={index} className="donate">
              <div key={index} className="donation">
                <div className="dd-row">
                  <label>Receipt Number:</label>
                  <input type="text" value={donation.id} />
                </div>

                <div className="dd-row">
                  <label>Transaction Type:</label>
                  <select
                    value={donation.transactionType}
                    onChange={(e) =>
                      handleDonationChange(
                        index,
                        "transactionType",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select your Reason</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="dd-row">
                  <label>Reason for Donation:</label>
                  <input type="text" value={donation.reason_for_donation} />
                  {/* <select
                    
                    onChange={(e) =>
                      handleDonationChange(
                        index,
                        "reasonForDonation",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select your Reason</option>
                    <option value="Charity">Charity</option>
                    <option value="Event">Event</option>
                  </select> */}
                </div>

                <div className="dd-row">
                  <label>Donation Amount:</label>
                  <input
                    type="number"
                    value={donation.attributes.donation_amount}
                    readOnly
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No donations found.</p>
        )}
      </div>

      <div className="total">
        <div className="total-donation-amount">
          <label>Total Donation Amount: </label>
          <input
            type="number"
            value={totalDonationAmount}
            onChange={(e) => setTotalDonationAmount(e.target.value)}
          />
        </div>
        {/* <div className="add-donation">
                    <button type="button" onClick={addDonation}> <span>+</span> Add another Donation</button>
                </div> */}
      </div>

      <div className="void-edit-buttons">
        <button
          type="button"
          className="cancel"
          onClick={() => console.log("Canceled")}
        >
          Cancel
        </button>
        {/* <button type="submit" className='submit'>Submit</button> */}
        <div className="void-edit">
          <button type="button" className="void" onClick={handleEditClick}>
            Void Receipt
          </button>
          <button type="button" className="edit">
            Download Receipt
          </button>
        </div>
      </div>
      {/* </form> */}
      {showWarningPopup && <ReceiptWarning closePopup={closeWarningPopup} />}
    </div>
  );
};

export default ReceiptDonating;

// import React from "react";
// import "./ReceiptDonating.scss";
// import useGuestStore from "../../../../guestStore";

// const ReceiptDonating = () => {
//   const guest = useGuestStore((state) => state.selectedGuest);

//   if (!guest) {
//     return <div>No guest selected.</div>;
//   }

//   return (
//     <div className="receipt-form">
//       <h2>Receipt Details for {guest.name}</h2>
//       <div>
//         <h3>Donor Details</h3>
//         <p>
//           <strong>Name:</strong> {guest.name || "N/A"}
//         </p>
//         <p>
//           <strong>Phone:</strong> {guest.phone_number || "N/A"}
//         </p>
//         <p>
//           <strong>Aadhaar Number:</strong> {guest.aadhaar_number || "N/A"}
//         </p>
//         <p>
//           <strong>Address:</strong> {guest.address || "N/A"}
//         </p>
//         <p>
//           <strong>Age:</strong> {guest.age || "N/A"}
//         </p>
//         <p>
//           <strong>Deeksha:</strong> {guest.deeksha || "N/A"}
//         </p>
//         <p>
//           <strong>Occupation:</strong> {guest.occupation || "N/A"}
//         </p>
//         <p>
//           <strong>Relationship:</strong> {guest.relationship || "N/A"}
//         </p>
//       </div>

//       <div className="donations-section">
//         <h3>Donations</h3>
//         {guest.donations?.data?.length > 0 ? (
//           guest.donations.data.map((donation, index) => (
//             <div key={index}>
//               <p>
//                 <strong>Receipt Number:</strong> {donation.id}
//               </p>
//               <p>
//                 <strong>Amount:</strong> ₹{donation.attributes.donation_amount}
//               </p>
//               <p>
//                 <strong>Donation Date:</strong>{" "}
//                 {new Date(
//                   donation.attributes.donation_date
//                 ).toLocaleDateString()}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p>No donations found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReceiptDonating;
