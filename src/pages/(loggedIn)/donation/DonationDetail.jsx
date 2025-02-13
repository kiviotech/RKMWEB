import React, { useState, useEffect } from "react";
import DonationsHistory from "./DonationsHistory";
import icons from "../../../constants/icons";
import ReceiptDonating from "./ReceiptDonating";
import ReceiptDonated from "./ReceiptDonated";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";

const DonationDetails = () => {
  const [guestDetails, setGuestDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  const [showReceiptPopup1, setShowReceiptPopup1] = useState(false);

  useEffect(() => {
    const getGuests = async () => {
      try {
        const response = await fetchGuestDetails();

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
        // console.error("Error fetching guest details:", error);
        setGuestDetails([]);
      } finally {
        setLoading(false);
      }
    };

    getGuests();
  }, []);

  // console.log(guestDetails);

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
            <ReceiptDonated />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
