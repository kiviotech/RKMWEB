<<<<<<< HEAD
import React, { useState } from "react";
=======
<<<<<<< HEAD
// import React, { useState } from "react";
// import "./ReceiptDonating.scss";
// import icons from "../../../constants/icons";
// import ReceiptWarning from "./ReceiptWarning";
// import useGuestStore from "../../../../guestStore";

// const ReceiptDonating = () => {
//   const guest = useGuestStore((state) => state.selectedGuest);
//   console.log(guest);
//   const [donorDetails, setDonorDetails] = useState({
//     name: "John Doe",
//     phone: "+91 9212341902",
//     email: "johndoe87@gmail.com",
//     dateOfDonation: "24/02/2023",
//   });

//   const [donations, setDonations] = useState([
//     {
//       receiptNumber: "CJ2077",
//       transactionType: "",
//       reasonForDonation: "",
//       amount: "",
//     },
//     {
//       receiptNumber: "CJ2063",
//       transactionType: "",
//       reasonForDonation: "",
//       amount: "",
//     },
//   ]);

//   const [totalDonationAmount, setTotalDonationAmount] = useState(50000);
//   const [showWarningPopup, setShowWarningPopup] = useState(false);

//   const handleDonationChange = (index, field, value) => {
//     const newDonations = [...donations];
//     newDonations[index][field] = value;
//     setDonations(newDonations);
//   };

//   const addDonation = () => {
//     setDonations([
//       ...donations,
//       {
//         receiptNumber: "",
//         transactionType: "",
//         reasonForDonation: "",
//         amount: "",
//       },
//     ]);
//   };

//   const deleteDonation = (index) => {
//     const newDonations = donations.filter((_, i) => i !== index);
//     setDonations(newDonations);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Donor Details:", donorDetails);
//     console.log("Donations:", donations);
//     console.log("Total Donation Amount:", totalDonationAmount);
//   };

//   const handleEditClick = () => {
//     setShowWarningPopup(true);
//   };

//   const closeWarningPopup = () => {
//     setShowWarningPopup(false);
//   };

//   return (
//     <div className="receipt-form">
//       <h2>Receipt Details</h2>
//       <div>
//         <h3>Donor Details</h3>
//         <form className="donor-details" onSubmit={handleSubmit}>
//           <div className="dd-row">
//             <label>Name of Donor:</label>
//             <input type="text" value={guest.name} readOnly />
//           </div>
//           <div className="dd-row">
//             <label>Phone No.:</label>
//             <input type="text" value={guest.phone_number} readOnly />
//           </div>

//           <div className="dd-row">
//             <label>Email ID:</label>
//             <input type="email" value={donorDetails.email} readOnly />
//           </div>

//           <div className="dd-row">
//             <label>Date of Donation:</label>
//             <input type="date" value={donorDetails.dateOfDonation} readOnly />
//           </div>
//         </form>
//       </div>

//       <div className="donations-section">
//         <h3>Donations</h3>
//         {guest.donations?.data?.length > 0 ? (
//           guest.donations.data.map((donation, index) => (
//             <div key={index} className="donate">
//               <div key={index} className="donation">
//                 <div className="dd-row">
//                   <label>Receipt Number:</label>
//                   <input type="text" value={donation.id} />
//                 </div>

//                 <div className="dd-row">
//                   <label>Transaction Type:</label>
//                   <input
//                     type="text"
//                     value={donation.attributes.transaction_type}
//                   />
//                 </div>

//                 <div className="dd-row">
//                   <label>Reason for Donation:</label>
//                   <input
//                     type="text"
//                     value={donation.attributes.reason_for_donation}
//                   />
//                 </div>

//                 <div className="dd-row">
//                   <label>Donation Amount:</label>
//                   <input
//                     type="number"
//                     value={donation.attributes.donation_amount}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No donations found.</p>
//         )}
//       </div>

//       <div className="total">
//         <div className="total-donation-amount">
//           <label>Total Donation Amount: </label>
//           <input
//             type="number"
//             value={totalDonationAmount}
//             onChange={(e) => setTotalDonationAmount(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="void-edit-buttons">
//         <button
//           type="button"
//           className="cancel"
//           onClick={() => console.log("Canceled")}
//         >
//           Cancel
//         </button>
//         <div className="void-edit">
//           <button type="button" className="void" onClick={handleEditClick}>
//             Void Receipt
//           </button>
//           <button type="button" className="edit">
//             Download Receipt
//           </button>
//         </div>
//       </div>
//       {/* </form> */}
//       {showWarningPopup && <ReceiptWarning closePopup={closeWarningPopup} />}
//     </div>
//   );
=======
// import React, { useState } from 'react';
// import './ReceiptDonating.scss'
// import icons from '../../../constants/icons';
// import ReceiptWarning from './ReceiptWarning'

// const ReceiptDonating = () => {
//     const [donorDetails, setDonorDetails] = useState({
//         name: 'John Doe',
//         phone: '+91 9212341902',
//         email: 'johndoe87@gmail.com',
//         dateOfDonation: '24/02/2023',
//     });

//     const [donations, setDonations] = useState([
//         { receiptNumber: 'CJ2077', transactionType: '', reasonForDonation: '', amount: '' },
//         { receiptNumber: 'CJ2063', transactionType: '', reasonForDonation: '', amount: '' }
//     ]);

//     const [totalDonationAmount, setTotalDonationAmount] = useState(50000);
//     const [showWarningPopup, setShowWarningPopup] = useState(false);

//     const handleDonationChange = (index, field, value) => {
//         const newDonations = [...donations];
//         newDonations[index][field] = value;
//         setDonations(newDonations);
//     };

//     const addDonation = () => {
//         setDonations([...donations, { receiptNumber: '', transactionType: '', reasonForDonation: '', amount: '' }]);
//     };

//     const deleteDonation = (index) => {
//         const newDonations = donations.filter((_, i) => i !== index);
//         setDonations(newDonations);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Donor Details:', donorDetails);
//         console.log('Donations:', donations);
//         console.log('Total Donation Amount:', totalDonationAmount);
//     };


    
//     const handleEditClick = () => {
//         setShowWarningPopup(true);  // Show the warning popup
//     };

//     const closeWarningPopup = () => {
//         setShowWarningPopup(false);  // Close the warning popup
//     };


//     return (
//         <div className="receipt-form">
//             <h2>Receipt Details</h2>
//             {/* <form onSubmit={handleSubmit}> */}
//             <div >
//                 <h3>Donor Details</h3>
//                 <form className="donor-details" onSubmit={handleSubmit}>
//                     <div className="dd-row">
//                         <label>Name of Donor:</label>
//                         <input type="text" value={donorDetails.name} readOnly />
//                     </div>
//                     <div className="dd-row">
//                         <label>Phone No.:</label>
//                         <input type="text" value={donorDetails.phone} readOnly />
//                     </div>

//                     <div className="dd-row">
//                         <label>Email ID:</label>
//                         <input type="email" value={donorDetails.email} readOnly />
//                     </div>

//                     <div className="dd-row">
//                         <label>Date of Donation:</label>
//                         <input type="date" value={donorDetails.dateOfDonation} readOnly />
//                     </div>
//                 </form>
//             </div>

//             <div className="donations-section">
//                 <h3>Donations</h3>
//                 {donations.map((donation, index) => (
//                     <div className="donate">
//                         <div key={index} className="donation">
//                             <div className="dd-row">
//                                 <label>Receipt Number:</label>
//                                 <input type="text" value={donation.receiptNumber} onChange={(e) => handleDonationChange(index, 'receiptNumber', e.target.value)} />
//                             </div>

//                             <div className="dd-row">
//                                 <label>Transaction Type:</label>
//                                 <select value={donation.transactionType} onChange={(e) => handleDonationChange(index, 'transactionType', e.target.value)}>
//                                     <option value="">Select your Reason</option>
//                                     <option value="Credit Card">Credit Card</option>
//                                     <option value="Bank Transfer">Bank Transfer</option>
//                                 </select>
//                             </div>

//                             <div className="dd-row">
//                                 <label>Reason for Donation:</label>
//                                 <select value={donation.reasonForDonation} onChange={(e) => handleDonationChange(index, 'reasonForDonation', e.target.value)}>
//                                     <option value="">Select your Reason</option>
//                                     <option value="Charity">Charity</option>
//                                     <option value="Event">Event</option>
//                                 </select>
//                             </div>

//                             <div className="dd-row">
//                                 <label>Donation Amount:</label>
//                                 <input type="number" value={donation.amount} onChange={(e) => handleDonationChange(index, 'amount', e.target.value)} />
//                             </div>
//                         </div>
//                         {/* <div className='deleteBtn'>
//                             <button type="button" onClick={() => deleteDonation(index)}>
//                                 <span><img src={icons.Trash} alt="" />Delete this Donation</span>
//                             </button>
//                         </div> */}
//                     </div>
//                 ))}
//             </div>

//             <div className="total">
//                 <div className="total-donation-amount">
//                     <label>Total Donation Amount: </label>
//                     <input type="number" value={totalDonationAmount} onChange={(e) => setTotalDonationAmount(e.target.value)} />
//                 </div>
//                 {/* <div className="add-donation">
//                     <button type="button" onClick={addDonation}> <span>+</span> Add another Donation</button>
//                 </div> */}
//             </div>

//             <div className="void-edit-buttons">
//                 <button type="button" className='cancel' onClick={() => console.log('Canceled')}>Cancel</button>
//                 {/* <button type="submit" className='submit'>Submit</button> */}
//                 <div className="void-edit">
//                     <button type="button" className='void' onClick={handleEditClick} >Void Receipt</button>
//                     <button type="button" className='edit' >Edit Receipt</button>
//                 </div>
//             </div>
//             {/* </form> */}
//             {showWarningPopup && <ReceiptWarning closePopup={closeWarningPopup} />} 

//         </div>
//     );
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
// };

// export default ReceiptDonating;

<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======



import React, { useState } from "react";
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
  const [totalDonationAmount, setTotalDonationAmount] = useState(0);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  useEffect(() => {
    if (guest.donations?.data?.length > 0) {
      const totalAmount = guest.donations.data.reduce(
        (sum, donation) =>
          sum + Number(donation.attributes.donation_amount || 0),
        0
      );
      setTotalDonationAmount(totalAmount);
    }
  }, [guest.donations]);

  const handleEditClick = () => {
    setShowWarningPopup(true);
  };

  const closeWarningPopup = () => {
    setShowWarningPopup(false);
  };

  const downloadCSV = () => {
    // Create CSV header
    const header = [
      "Receipt Number",
      "Transaction Type",
      "Reason for Donation",
      "Amount",
    ];
    const rows = guest.donations?.data.map((donation) => [
      donation.id,
      donation.attributes.transaction_type,
      donation.attributes.reason_for_donation,
      donation.attributes.donation_amount,
    ]);

    // Add header and rows to CSV data
    const csvData = [header, ...rows].map((row) => row.join(",")).join("\n");

    // Create a blob from the data
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `Donation_Receipt_${guest.name}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
=======
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
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
<<<<<<< HEAD
=======
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
  };

  return (
    <div className="receipt-form">
      <h2>Receipt Details</h2>
<<<<<<< HEAD
=======
<<<<<<< HEAD
      <div>
        <h3>Donor Details</h3>
        <form className="donor-details">
=======
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
      {/* <form onSubmit={handleSubmit}> */}
      <div>
        <h3>Donor Details</h3>
        <form className="donor-details" onSubmit={handleSubmit}>
<<<<<<< HEAD
=======
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
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
<<<<<<< HEAD
                  <input type="text" value={donation.id} />
=======
<<<<<<< HEAD
                  <input type="text" value={donation.id} readOnly />
=======
                  <input type="text" value={donation.id} />
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
                </div>

                <div className="dd-row">
                  <label>Transaction Type:</label>
<<<<<<< HEAD
=======
<<<<<<< HEAD
                  <input
                    type="text"
                    value={donation.attributes.transaction_type}
                    readOnly
                  />
=======
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
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
<<<<<<< HEAD
=======
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
                </div>

                <div className="dd-row">
                  <label>Reason for Donation:</label>
<<<<<<< HEAD
=======
<<<<<<< HEAD
                  <input
                    type="text"
                    value={donation.attributes.reason_for_donation}
                    readOnly
                  />
=======
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
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
<<<<<<< HEAD
=======
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
          <input type="number" value={totalDonationAmount} readOnly />
        </div>
=======
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
          <input
            type="number"
            value={totalDonationAmount}
            onChange={(e) => setTotalDonationAmount(e.target.value)}
          />
        </div>
        {/* <div className="add-donation">
                    <button type="button" onClick={addDonation}> <span>+</span> Add another Donation</button>
                </div> */}
<<<<<<< HEAD
=======
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
      </div>

      <div className="void-edit-buttons">
        <button
          type="button"
          className="cancel"
          onClick={() => console.log("Canceled")}
        >
          Cancel
        </button>
<<<<<<< HEAD
        {/* <button type="submit" className='submit'>Submit</button> */}
=======
<<<<<<< HEAD
=======
        {/* <button type="submit" className='submit'>Submit</button> */}
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
        <div className="void-edit">
          <button type="button" className="void" onClick={handleEditClick}>
            Void Receipt
          </button>
<<<<<<< HEAD
          <button type="button" className="edit">
=======
<<<<<<< HEAD
          <button type="button" className="edit" onClick={downloadCSV}>
=======
          <button type="button" className="edit">
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
            Download Receipt
          </button>
        </div>
      </div>
<<<<<<< HEAD
      {/* </form> */}
=======
<<<<<<< HEAD
=======
      {/* </form> */}
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
      {showWarningPopup && <ReceiptWarning closePopup={closeWarningPopup} />}
    </div>
  );
};

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
export default ReceiptDonating;
=======
export default ReceiptDonating;
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
