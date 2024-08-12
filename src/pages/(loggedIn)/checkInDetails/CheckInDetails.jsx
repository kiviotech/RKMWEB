import React, { useState } from 'react';
import Modal from 'react-modal';
import './CheckInDetails.scss';
import { icons } from '../../../constants';
import SearchBar from '../../../components/ui/SearchBar';
import CommonHeaderTitle from '../../../components/ui/CommonHeaderTitle';

const guests = [
  { name: "Mrs. John Dee", age: 35, gender: "F", relation: "Wife", id: 1 },
  { name: "Ms. John Dee", age: 5, gender: "F", relation: "Child", id: 2 },
];

const CheckInDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRcodeScanned, setIsQRcodeScanned] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

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
            <div className="progress-fill" style={{ width: '53%' }}></div>
          </div>
          <div className="progress-text">Checked-in: 53/120</div>
        </div>
        <div className="table-section">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reference no.</th>
                <th>Room no.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mr. John Dee</td>
                <td>20240103-002</td>
                <td>Gh-03</td>
                <td><button className="check-in-button">Check in</button></td>
              </tr>
              <tr>
                <td>Mr. John Dee</td>
                <td>20240103-002</td>
                <td>Gh-08</td>
                <td><button className="check-in-button">Check in</button></td>
              </tr>
              <tr>
                <td>Mr. John Dee</td>
                <td>20240103-002</td>
                <td>Gh-12</td>
                <td><button className="check-in-button">Check in</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="scanned-qr-main-section">
        {isQRcodeScanned ? (
          <div className="qr-code-alert scanned">
            <img src={icons.qR} alt="icon" style={{ position: 'relative', top: '5px' }} />
            <span style={{ position: 'relative', top: '-5px' }}>QR Code is successfully scanned</span>
          </div>
        ) : (
          <div className="qr-code-section">
            <div className="qr-code-alert">
              <img src={icons.qR} alt="icon" style={{ position: 'relative', top: '5px' }} />
              <span style={{ position: 'relative', top: '-5px' }}>QR Code is not scanned</span>
            </div>

            <button className="scan-qr-button" onClick={openModal}>Scan QR Code</button>
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="QR Code Scanner"
        className="qr-code-modal"
        overlayClassName="qr-code-modal-overlay"
      >
        <div className="qr-code-popup">
          <div className="qr-code-popup-header">
            <button onClick={closeModal} className="close-button">&times;</button>
          </div>
          <div className="qr-code-scanner">
            <p style={{ paddingTop: '30px' }}>Align the QR Code within the frame to scan</p>
            <div className="qr-code-frame">
              {/* Place your QR code scanner component or logic here */}
              <p>Scanning...</p>
            </div>
          </div>
          <button onClick={closeModal} className="cancel-button">Cancel Scanning</button>
        </div>
      </Modal>
    </div>
  );
};

export default CheckInDetails;