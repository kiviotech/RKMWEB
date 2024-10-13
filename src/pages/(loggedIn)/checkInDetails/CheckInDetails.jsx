import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./CheckInDetails.scss";
import { icons } from "../../../constants";
import SearchBar from "../../../components/ui/SearchBar";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import GuestDetails from "../GuestDetails";
import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";

const CheckInDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [approvedAllocations, setApprovedAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQRcodeScanned, setIsQRcodeScanned] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQRcodeScanned(true);
  };

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await fetchBookingRequests();
        const allAllocations = response.data;

        const approvedAllocations = allAllocations.filter(
          (allocation) => allocation.attributes.status === "approved"
        );

        setApprovedAllocations(approvedAllocations);
        setFilteredAllocations(approvedAllocations);

        if (approvedAllocations.length > 0) {
          setSelectedUser(approvedAllocations[0]);
        }
      } catch (error) {
        console.error("Error fetching room allocations: ", error);
      }
    };

    fetchAllocations();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredAllocations(approvedAllocations);
    } else {
      const filtered = approvedAllocations.filter((allocation) =>
        allocation.attributes.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAllocations(filtered);
      if (filtered.length > 0) {
        setSelectedUser(filtered[0]);
      }
    }
  };

  return (
    <div className="check-in-main-container">
      <div className="check-in-datails">
        <div className="header">
          <CommonHeaderTitle title="Check-ins" />
          <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((allocation) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    key={allocation.id}
                    onClick={() => handleSelectUser(allocation)}
                    className={
                      selectedUser?.id === allocation.id ? "selected-row" : ""
                    }
                  >
                    <td>Mr. {allocation.attributes.name}</td>
                    <td>{allocation.id}</td>
                    <td>
                      <button className="check-in-button">Check in</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No approved room allocations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUser && (
        <GuestDetails selectedUser={selectedUser} showQRSection={true} />
      )}

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
