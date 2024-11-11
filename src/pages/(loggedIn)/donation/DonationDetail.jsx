<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import DonationsHistory from "./DonationsHistory";
import icons from "../../../constants/icons";
import ReceiptDonating from "./ReceiptDonating";
import ReceiptDonated from "./ReceiptDonated";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";
=======
import React, { useState } from 'react';
import useDonationStore from '../../../../useDonationStore';
import DonationsHistory from "./DonationsHistory";
import icons from "../../../constants/icons"
import ReceiptDonating from "./ReceiptDonating"
import ReceiptDonated from "./ReceiptDonated"

>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a

const DonationDetails = () => {
  const [guestDetails, setGuestDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  const [showReceiptPopup1, setShowReceiptPopup1] = useState(false);

  useEffect(() => {
    const getGuests = async () => {
      try {
        const response = await fetchGuestDetails();

<<<<<<< HEAD
        if (response && response.data && Array.isArray(response.data)) {
          const guests = response.data.map((item) => ({
            id: item.id,
            ...item.attributes,
          }));
          setGuestDetails(guests);
        } else {
          setGuestDetails([]);
        }
      } catch (error) {
        console.error("Error fetching guest details:", error);
        setGuestDetails([]);
      } finally {
        setLoading(false);
      }
    };

    getGuests();
  }, []);

  console.log(guestDetails);

  const openPopup = () => {
    setShowReceiptPopup(true);
  };

  const closePopup = () => {
    setShowReceiptPopup(false);
  };

  const openPopup1 = () => {
    setShowReceiptPopup1(true);
  };

  const closePopup1 = () => {
    setShowReceiptPopup1(false);
  };

  return (
    <div className="donation-details">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DonationsHistory
          guestDetails={guestDetails}
          limit={10}
          openPopup={openPopup}
          openPopup1={openPopup1}
        />
      )}

      {showReceiptPopup && (
=======
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
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>
              &times;
            </button>
            <ReceiptDonating />
          </div>
<<<<<<< HEAD
=======
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
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
        </div>
      )}

      {showReceiptPopup1 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup1}>
              &times;
            </button>
            <ReceiptDonated />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
