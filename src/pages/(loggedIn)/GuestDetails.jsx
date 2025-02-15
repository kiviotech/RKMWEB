import React, { useState, useEffect } from "react";
import { icons } from "../../constants";
import { fetchGuestDetailsById } from "../../../services/src/services/guestDetailsService";

const GuestDetails = ({ userId, showQRSection, checkout }) => {
  const [guestData, setGuestData] = useState(null);
  const [checkIns, setCheckIns] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGuestDetailsById(userId);
        setGuestData(response.data);
      } catch (error) {
        console.error("Error fetching guest details:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const renderGuests = () => {
    const bookingGuests =
      guestData?.attributes?.booking_request?.data?.attributes?.guests?.data ||
      [];

    return (
      <div className="guests-list">
        <h5>Guests</h5>
        <div className="guest-table">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Age</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Gender</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Relation</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Room No.</th>
              </tr>
            </thead>
            <tbody>
              {bookingGuests.map((guest, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{guest.attributes.name}</td>
                  <td style={{ padding: "10px" }}>
                    {guest.attributes.age || "N/A"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {guest.attributes.gender || "N/A"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {guest.attributes.relationship}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {
                      guestData?.attributes?.room_allocations?.data[0]
                        ?.attributes?.room?.data?.attributes?.room_number
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!guestData) return <div>Loading...</div>;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const validateGuest = () => {
    setCheckIns(true);
  };

  const checkOutGuests = () => {
    alert("Guests have successfully checked out.");
    setCheckIns(false);
  };

  return (
    <>
      <div className="scanned-qr-main-section">
        {showQRSection && (
          <>
            <div className="scanned-qr-sub-section">
              {checkIns ? (
                <div className="qr-code-alert scanned">
                  <img
                    src={icons.qR}
                    alt="icon"
                    style={{ position: "relative", top: "5px" }}
                  />
                  <span style={{ position: "relative", top: "-5px" }}>
                    QR Code is successfully scanned
                  </span>
                </div>
              ) : (
                <div className="qr-code-section">
                  <div className="qr-code-alert">
                    <img
                      src={icons.qR}
                      alt="icon"
                      style={{ position: "relative", top: "5px" }}
                    />
                    <span style={{ position: "relative", top: "-5px" }}>
                      QR Code is not scanned
                    </span>
                  </div>

                  <button className="scan-qr-button" onClick={openModal}>
                    Scan QR Code
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div className="details-section">
          <h5>Details</h5>
          <div className="details">
            <div className="detail">
              <span style={{ fontWeight: 600 }}>Name :</span>
              <span>{guestData.attributes.name}</span>
            </div>
            <div className="detail">
              <span style={{ fontWeight: 600 }}>Mobile no. :</span>
              <span>{guestData.attributes.phone_number}</span>
            </div>
            <div className="detail">
              <span>Deeksha :</span>
              <span>{guestData.attributes.deeksha || "N/A"}</span>
            </div>
            <div className="detail">
              <span>Departure Date:</span>
              <span>{guestData.attributes.departure_date}</span>
            </div>
          </div>
        </div>
        <div className="guests-section">
          {renderGuests()}
          {/* {renderRoomAllocation()} */}

          {checkout ? (
            <button className="checkout-guest-button" onClick={checkOutGuests}>
              Check out
            </button>
          ) : (
            <button className="validate-guest-button" onClick={validateGuest}>
              Validate Guest
            </button>
          )}
        </div>
      </div>

      {/* QR Modal Logic (if needed) */}
      {/* {isModalOpen && (
        <div className="qr-modal">
          <button onClick={() => setIsModalOpen(false)}>Close Modal</button>
        </div>
      )} */}
    </>
  );
};

export default GuestDetails;
