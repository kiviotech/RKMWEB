import React, { useState } from "react";
import Modal from "react-modal";
import "./CheckInDetails.scss";
import { icons } from "../../../constants";
import SearchBar from "../../../components/ui/SearchBar";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import GuestDetails from "../GuestDetails";

const CheckInDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQRcodeScanned(true);
  };

  return (
    <div className="check-in-main-container">
      <div className="check-in-datails">
        <div className="header">
          <CommonHeaderTitle title="Check-ins" />
          <SearchBar />
        </div>
        <div className="progressBar">
          <div className="progress">
            <div className="progress-fill" style={{ width: "53%" }}></div>
          </div>
          <div className="progress-text">Checked-in: 53/120</div>
        </div>
        <div className="table-section">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reference no.</th>
                {/* <th>Room no.</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mr. John Dee</td>
                <td>20240103-002</td>
                {/* <td>Gh-03</td> */}
                <td>
                  <button className="check-in-button">Check in</button>
                </td>
              </tr>
              <tr>
                <td>Mr. John Dee</td>
                <td>20240103-002</td>
                {/* <td>Gh-08</td> */}
                <td>
                  <button className="check-in-button">Check in</button>
                </td>
              </tr>
              <tr>
                <td>Mr. John Dee</td>
                <td>20240103-002</td>
                {/* <td>Gh-12</td> */}
                <td>
                  <button className="check-in-button">Check in</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <GuestDetails />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="QR Code Scanner"
        className="qr-code-modal"
        overlayClassName="qr-code-modal-overlay"
      >
        <div className="qr-code-popup">
          <div className="qr-code-popup-header">
            <button onClick={closeModal} className="close-button">
              &times;
            </button>
          </div>
          <div className="qr-code-scanner">
            <p style={{ paddingTop: "30px" }}>
              Align the QR Code within the frame to scan
            </p>
            <div className="qr-code-frame">
              {/* Place your QR code scanner component or logic here */}
              <p>Scanning...</p>
            </div>
          </div>
          <button onClick={closeModal} className="cancel-button">
            Cancel Scanning
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CheckInDetails;
