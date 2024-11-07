import React, { useState } from 'react';
import useDonationStore from '../../../../useDonationStore';
import DonationsHistory from "./DonationsHistory";
import icons from "../../../constants/icons"
import ReceiptDonating from "./ReceiptDonating"
import ReceiptDonated from "./ReceiptDonated"


const DonationDetails = () => {
    const { donations, setSelectedDonation } = useDonationStore(); // Access donations and the setter function
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDonations = donations.filter(donation =>
        donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.reference.includes(searchQuery)
    );

    const [showReceiptPopup, setShowReceiptPopup] = useState(false); // State to control the popup visibility
    const [showReceiptPopup1, setShowReceiptPopup1] = useState(false); 

    const openPopup = () => {
        setShowReceiptPopup(true);
      };
    
      // Function to close the popup
      const closePopup = () => {
        setShowReceiptPopup(false);
      };
       // Function to open the popup
       const openPopup1 = () => {
        setShowReceiptPopup1(true);
      };
    
      // Function to close the popup
      const closePopup1 = () => {
        setShowReceiptPopup1(false);
      };

    // Display the selected donation details
    return (
        <div className="donation-details">
          <DonationsHistory openPopup={openPopup} openPopup1={openPopup1} />


          {showReceiptPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>
              &times;
            </button>
            <ReceiptDonating />
          </div>
        </div>
      )}
      
      {showReceiptPopup1 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup1}>
              &times;
            </button>
            <ReceiptDonated/>
          </div>
        </div>
      )}
            {/* <div className="header">
                <h3>Donation Details</h3>
                <input
                    type="text"
                    placeholder="Search by name or reference"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reference no.</th>
                        <th>Date of Donation</th>
                        <th>Date of Arrival</th>
                        <th>Time until checkout</th>
                        <th>Add Donation</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonations.map((donation, index) => (
                        <tr
                            key={index}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{donation.name}</td>
                            <td>{donation.reference}</td>
                            <td>{donation.date}</td>
                            <td>{donation.arrivalDate}</td>
                            <td>{donation.timeUntilCheckout}</td>
                            <td>
                                <button className='add-donation'>+</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
};

export default DonationDetails;
