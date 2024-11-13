<<<<<<< HEAD
=======
<<<<<<< HEAD
// import React, { useState } from "react";
// import "./ReceiptDonating.scss";
// import icons from "../../../constants/icons";
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

//   return (
//     <div className="receipt-form">
//       <h2>Receipt Details</h2>
//       {/* <form onSubmit={handleSubmit}> */}
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
//         {donations.map((donation, index) => (
//           <div className="donate">
//             <div key={index} className="donation">
//               <div className="dd-row">
//                 <label>Receipt Number:</label>
//                 <input
//                   type="text"
//                   value={donation.receiptNumber}
//                   onChange={(e) =>
//                     handleDonationChange(index, "receiptNumber", e.target.value)
//                   }
//                 />
//               </div>

//               <div className="dd-row">
//                 <label>Transaction Type:</label>
//                 <select
//                   value={donation.transactionType}
//                   onChange={(e) =>
//                     handleDonationChange(
//                       index,
//                       "transactionType",
//                       e.target.value
//                     )
//                   }
//                 >
//                   <option value="">Select your Reason</option>
//                   <option value="Credit Card">Credit Card</option>
//                   <option value="Bank Transfer">Bank Transfer</option>
//                 </select>
//               </div>

//               <div className="dd-row">
//                 <label>Reason for Donation:</label>
//                 <select
//                   value={donation.reasonForDonation}
//                   onChange={(e) =>
//                     handleDonationChange(
//                       index,
//                       "reasonForDonation",
//                       e.target.value
//                     )
//                   }
//                 >
//                   <option value="">Select your Reason</option>
//                   <option value="Charity">Charity</option>
//                   <option value="Event">Event</option>
//                 </select>
//               </div>

//               <div className="dd-row">
//                 <label>Donation Amount:</label>
//                 <input
//                   type="number"
//                   value={donation.amount}
//                   onChange={(e) =>
//                     handleDonationChange(index, "amount", e.target.value)
//                   }
//                 />
//               </div>
//             </div>
//             <div className="deleteBtn">
//               <button type="button" onClick={() => deleteDonation(index)}>
//                 <span>
//                   <img src={icons.Trash} alt="" />
//                   Delete this Donation
//                 </span>
//               </button>
//             </div>
//           </div>
//         ))}
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
//         <div className="add-donation">
//           <button type="button" onClick={addDonation}>
//             {" "}
//             <span>+</span> Add another Donation
//           </button>
//         </div>
//       </div>

//       <div className="form-buttons">
//         <button
//           type="button"
//           className="cancel"
//           onClick={() => console.log("Canceled")}
//         >
//           Cancel
//         </button>
//         <button type="submit" className="submit">
//           Submit
//         </button>
//       </div>
//       {/* </form> */}
//     </div>
//   );
=======
// import React, { useState } from 'react';
// import './ReceiptDonating.scss'
// import icons from '../../../constants/icons';

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
//                         <div className='deleteBtn'>
//                             <button type="button" onClick={() => deleteDonation(index)}>
//                                 <span><img src={icons.Trash} alt="" />Delete this Donation</span>
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="total">
//                 <div className="total-donation-amount">
//                     <label>Total Donation Amount: </label>
//                     <input type="number" value={totalDonationAmount} onChange={(e) => setTotalDonationAmount(e.target.value)} />
//                 </div>
//                 <div className="add-donation">
//                     <button type="button" onClick={addDonation}> <span>+</span> Add another Donation</button>
//                 </div>
//             </div>

//             <div className="form-buttons">
//                 <button type="button" className='cancel' onClick={() => console.log('Canceled')}>Cancel</button>
//                 <button type="submit" className='submit'>Submit</button>
//             </div>
//             {/* </form> */}
//         </div>
//     );
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
// };

// export default ReceiptDonating;

<<<<<<< HEAD
import React, { useState } from "react";
import "./ReceiptDonating.scss";
import icons from "../../../constants/icons";
import useGuestStore from "../../../../guestStore";
// import { createDonation } from "../../../api/services/donationService"; // Import the service for adding donations
import { createDonation } from "../../../../services/src/services/donationsService";

const ReceiptDonating = () => {
  const guest = useGuestStore((state) => state.selectedGuest);

  const [donorDetails, setDonorDetails] = useState({
    name: guest.name || "John Doe",
    phone: guest.phone_number || "+91 9212341902",
    email: "johndoe87@gmail.com",
    dateOfDonation: new Date().toISOString().split("T")[0], // Default to current date
  });

  const [donations, setDonations] = useState([
    {
      receiptNumber: "CJ2077",
      transactionType: "",
      reasonForDonation: "",
      amount: "",
    },
  ]);

  const [totalDonationAmount, setTotalDonationAmount] = useState(0);
  const [errors, setErrors] = useState({});

  const handleDonationChange = (index, field, value) => {
    const newDonations = [...donations];
    newDonations[index][field] = value;
    setDonations(newDonations);

    // Update the total donation amount when the amount changes
    const newTotal = newDonations.reduce(
      (total, donation) => total + Number(donation.amount || 0),
      0
    );
    setTotalDonationAmount(newTotal);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!donations[0].transactionType) {
      formErrors.transactionType = "Transaction type is required.";
    }
    if (!donations[0].reasonForDonation) {
      formErrors.reasonForDonation = "Reason for donation is required.";
    }
    if (totalDonationAmount <= 0) {
      formErrors.amount = "Donation amount must be greater than zero.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
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

    // Update total donation after deleting
    const newTotal = newDonations.reduce(
      (total, donation) => total + Number(donation.amount || 0),
      0
    );
    setTotalDonationAmount(newTotal);
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     // Validate form before submitting
  //     if (!validateForm()) {
  //       return;
  //     }

  //     // Prepare data for API call
  //     const donationData = {
  //       data: {
  //         guest: guest.id || "guest-id-placeholder", // Ensure this is replaced with the actual guest ID
  //         donation_amount: totalDonationAmount,
  //         donation_date: new Date().toISOString(), // Use ISO string for current date
  //         transaction_type: donations[0].transactionType, // Assuming all donations share the same transaction type
  //         reason_for_donation: donations[0].reasonForDonation, // Assuming same reason for all donations
  //       },
  //     };

  //     try {
  //       const response = await createDonation(donationData);
  //       console.log("Donation created successfully", response);
  //       alert("Donation submitted successfully!");
  //     } catch (error) {
  //       console.error("Error creating donation", error);
  //       alert(`Error submitting donation: ${error.message}`);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    // Prepare data for API call
    const donationData = {
      guest: guest.id || "guest-id-placeholder", // Ensure this is replaced with the actual guest ID
      donation_amount: totalDonationAmount,
      donation_date: new Date().toISOString(), // Use ISO string for current date
      transaction_type: donations[0].transactionType, // Assuming all donations share the same transaction type
      reason_for_donation: donations[0].reasonForDonation, // Assuming same reason for all donations
    };

    try {
      const response = await createDonation({ data: donationData }); // Only wrap the data object once
      console.log("Donation created successfully", response);
      alert("Donation submitted successfully!");
    } catch (error) {
      console.error("Error creating donation", error);
      alert(`Error submitting donation: ${error.message}`);
    }
  };

  return (
    <div className="receipt-form">
      <h2>Receipt Details</h2>

      {/* Ensure the form wraps everything for submission */}
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Donor Details</h3>
          <div className="donor-details">
            <div className="dd-row">
              <label>Name of Donor:</label>
              <input type="text" value={donorDetails.name} readOnly />
            </div>
            <div className="dd-row">
              <label>Phone No.:</label>
              <input type="text" value={donorDetails.phone} readOnly />
            </div>

            <div className="dd-row">
              <label>Email ID:</label>
              <input type="email" value={donorDetails.email} readOnly />
            </div>

            <div className="dd-row">
              <label>Date of Donation:</label>
              <input type="date" value={donorDetails.dateOfDonation} readOnly />
            </div>
          </div>
        </div>

        <div className="donations-section">
          <h3>Donations</h3>
          {donations.map((donation, index) => (
            <div className="donate" key={index}>
              <div className="donation">
                <div className="dd-row">
                  <label>Receipt Number:</label>
                  <input
                    type="text"
                    value={donation.receiptNumber}
                    onChange={(e) =>
                      handleDonationChange(
                        index,
                        "receiptNumber",
                        e.target.value
                      )
                    }
                  />
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
                    <option value="">Select Transaction Type</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transaction">Bank Transaction</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                  </select>
                  {errors.transactionType && (
                    <span className="error">{errors.transactionType}</span>
                  )}
                </div>

                <div className="dd-row">
                  <label>Reason for Donation:</label>
                  <select
                    value={donation.reasonForDonation}
                    onChange={(e) =>
                      handleDonationChange(
                        index,
                        "reasonForDonation",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select Reason</option>
                    <option value="Charity">Charity</option>
                    <option value="Event">Event</option>
                    <option value="Festival">Festival</option>
                    <option value="Others...">Others...</option>
                  </select>
                  {errors.reasonForDonation && (
                    <span className="error">{errors.reasonForDonation}</span>
                  )}
                </div>

                <div className="dd-row">
                  <label>Donation Amount:</label>
                  <input
                    type="number"
                    value={donation.amount}
                    onChange={(e) =>
                      handleDonationChange(index, "amount", e.target.value)
                    }
                  />
                  {errors.amount && (
                    <span className="error">{errors.amount}</span>
                  )}
                </div>
              </div>
              <div className="deleteBtn">
                <button type="button" onClick={() => deleteDonation(index)}>
                  <span>
                    <img src={icons.Trash} alt="" />
                    Delete this Donation
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="total">
          <div className="total-donation-amount">
            <label>Total Donation Amount: </label>
            <input type="number" value={totalDonationAmount} readOnly />
          </div>
          <div className="add-donation">
            <button type="button" onClick={addDonation}>
              {" "}
              <span>+</span> Add another Donation
            </button>
          </div>
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="cancel"
            onClick={() => console.log("Canceled")}
          >
            Cancel
          </button>
          <button type="submit" className="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
=======



>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
import React, { useState } from 'react';
import './ReceiptDonating.scss'
import icons from '../../../constants/icons';

const ReceiptDonating = () => {
    const [donorDetails, setDonorDetails] = useState({
        name: 'John Doe',
        phone: '+91 9212341902',
        email: 'johndoe87@gmail.com',
        dateOfDonation: '24/02/2023',
    });

    const [donations, setDonations] = useState([
        { receiptNumber: 'CJ2077', transactionType: '', reasonForDonation: '', amount: '' },
        { receiptNumber: 'CJ2063', transactionType: '', reasonForDonation: '', amount: '' }
    ]);

    const [totalDonationAmount, setTotalDonationAmount] = useState(50000);

    const handleDonationChange = (index, field, value) => {
        const newDonations = [...donations];
        newDonations[index][field] = value;
        setDonations(newDonations);
    };

    const addDonation = () => {
        setDonations([...donations, { receiptNumber: '', transactionType: '', reasonForDonation: '', amount: '' }]);
    };

    const deleteDonation = (index) => {
        const newDonations = donations.filter((_, i) => i !== index);
        setDonations(newDonations);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Donor Details:', donorDetails);
        console.log('Donations:', donations);
        console.log('Total Donation Amount:', totalDonationAmount);
    };

    return (
        <div className="receipt-form">
            <h2>Receipt Details</h2>
            {/* <form onSubmit={handleSubmit}> */}
            <div >
                <h3>Donor Details</h3>
                <form className="donor-details" onSubmit={handleSubmit}>
                    <div className="dd-row">
                        <label>Name of Donor:</label>
                        <input type="text" value={donorDetails.name} readOnly />
                    </div>
                    <div className="dd-row">
                        <label>Phone No.:</label>
                        <input type="text" value={donorDetails.phone} readOnly />
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
                {donations.map((donation, index) => (
                    <div className="donate">
                        <div key={index} className="donation">
                            <div className="dd-row">
                                <label>Receipt Number:</label>
                                <input type="text" value={donation.receiptNumber} onChange={(e) => handleDonationChange(index, 'receiptNumber', e.target.value)} />
                            </div>

                            <div className="dd-row">
                                <label>Transaction Type:</label>
                                <select value={donation.transactionType} onChange={(e) => handleDonationChange(index, 'transactionType', e.target.value)}>
                                    <option value="">Select your Reason</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="dd-row">
                                <label>Reason for Donation:</label>
                                <select value={donation.reasonForDonation} onChange={(e) => handleDonationChange(index, 'reasonForDonation', e.target.value)}>
                                    <option value="">Select your Reason</option>
                                    <option value="Charity">Charity</option>
                                    <option value="Event">Event</option>
                                </select>
                            </div>

                            <div className="dd-row">
                                <label>Donation Amount:</label>
                                <input type="number" value={donation.amount} onChange={(e) => handleDonationChange(index, 'amount', e.target.value)} />
                            </div>
                        </div>
                        <div className='deleteBtn'>
                            <button type="button" onClick={() => deleteDonation(index)}>
                                <span><img src={icons.Trash} alt="" />Delete this Donation</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="total">
                <div className="total-donation-amount">
                    <label>Total Donation Amount: </label>
                    <input type="number" value={totalDonationAmount} onChange={(e) => setTotalDonationAmount(e.target.value)} />
                </div>
                <div className="add-donation">
                    <button type="button" onClick={addDonation}> <span>+</span> Add another Donation</button>
                </div>
            </div>

            <div className="form-buttons">
                <button type="button" className='cancel' onClick={() => console.log('Canceled')}>Cancel</button>
                <button type="submit" className='submit'>Submit</button>
            </div>
            {/* </form> */}
        </div>
    );
<<<<<<< HEAD
=======
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
>>>>>>> f52b676d9e5f80c5385418dcc0cb4847601430de
};

export default ReceiptDonating;
