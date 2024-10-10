import React, { useState } from "react";
import { icons } from "../../constants";

const GuestDetails = () => {
  const [isQRcodeScanned, setIsQRcodeScanned] = useState(false);
  const guests = [
    {
      name: "Mrs. John Dee",
      age: 35,
      gender: "F",
      relation: "Wife",
      roomNo: "Gh-03",
      bedNo: "202-A",
      id: 1,
    },
    {
      name: "Ms. John Dee",
      age: 5,
      gender: "F",
      relation: "Child",
      roomNo: "Gh-08",
      bedNo: "202-B",
      id: 2,
    },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      {" "}
      <div className="scanned-qr-main-section">
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
        <div className="details-section">
          <h5>Details</h5>
          <div className="details">
            <div className="detail">
              <span style={{ fontWeight: 600 }}>Mobile no. :</span>
              <span>+91 0000000000</span>
            </div>
            <div className="detail">
              <span>Deeksha :</span>
              <span></span>
            </div>
            <div className="detail">
              <span>Donation :</span>
              <span className="donation-status">To be paid</span>
            </div>
            <div className="detail">
              <span>Departure Date:</span>
              <span>00/00/0000</span>
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
              {guests.map((guest) => (
                <div className="tableContBodyEachRow" key={guest.id}>
                  <div className="tbalebody">
                    <img src={icons.dummyUser} alt="user-image" />
                  </div>
                  <div className="tbalebody">{guest.name}</div>
                  <div className="tbalebody">{guest.age}</div>
                  <div className="tbalebody">{guest.gender}</div>
                  <div className="tbalebody">{guest.relation}</div>
                  <div className="tbalebody">{guest.roomNo}</div>
                  <div className="tbalebody">{guest.bedNo}</div>
                  <div className="tbalebody">
                    <button className="validate-button">
                      <img src={icons.eyeHalf} alt="eye-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="validate-guest-button">Validate Guest</button>
        </div>
      </div>
    </>
  );
};

export default GuestDetails;
