import React, { useState } from "react";
import { icons } from "../../constants";

const GuestDetails = ({ selectedUser, showQRSection }) => {
  const { attributes } = selectedUser;
  const guests = attributes.guests?.data || [];
  const [isQRcodeScanned, setIsQRcodeScanned] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="scanned-qr-main-section">
        {showQRSection && (
          <>
            <div className="scanned-qr-sub-section">
              {isQRcodeScanned ? (
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
              <span>{attributes.name}</span>
            </div>
            <div className="detail">
              <span style={{ fontWeight: 600 }}>Mobile no. :</span>
              <span>{attributes.phone_number}</span>
            </div>
            <div className="detail">
              <span>Deeksha :</span>
              <span>{attributes.deeksha}</span>
            </div>
            <div className="detail">
              <span>Donation :</span>
              <span className="donation-statuss">To be paid</span>
            </div>
            <div className="detail">
              <span>Departure Date:</span>
              <span>{attributes.departure_date}</span>
            </div>
          </div>
        </div>
        <div className="guests-section">
          <h5>Guests</h5>
          <div className="tableCont">
            <div className="tableContHeader">
              <div className="tableheader"></div>
              <div className="tableheader"></div>
              <div className="tableheader">Age</div>
              <div className="tableheader">Gender</div>
              <div className="tableheader">Relation</div>
              <div className="tableheader">Room no.</div>
              <div className="tableheader">Bed no.</div>
              <div className="tableheader">ID</div>
            </div>
            <div className="tableContBody">
              {guests.length > 0 ? (
                guests.map((guest) => (
                  <div className="tableContBodyEachRow" key={guest.id}>
                    <div className="tbalebody">
                      <img src={icons.dummyUser} alt="user-image" />
                    </div>
                    <div className="tbalebody">{guest.attributes.name}</div>
                    <div className="tbalebody">{guest.attributes.age}</div>
                    <div className="tbalebody">{guest.attributes.gender}</div>
                    <div className="tbalebody">
                      {guest.attributes.relationship}
                    </div>
                    <div className="tbalebody">{guest.attributes.roomNo}</div>
                    <div className="tbalebody">{guest.attributes.bedNo}</div>
                    <div className="tbalebody">
                      <button className="validate-button">
                        <img src={icons.eyeHalf} alt="eye-icon" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No guests available for this user.</div>
              )}
            </div>
          </div>
          <button className="validate-guest-button">Validate Guest</button>
        </div>
      </div>
    </>
  );
};

export default GuestDetails;
