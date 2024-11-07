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
// };

// export default ReceiptDonating;




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