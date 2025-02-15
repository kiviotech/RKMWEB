import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./CheckInDetails.scss";
import { icons } from "../../../constants";
import SearchBar from "../../../components/ui/SearchBar";
import CommonHeaderTitle from "../../../components/ui/CommonHeaderTitle";
import GuestDetails from "../GuestDetails";
import { fetchBookingRequests } from "../../../../services/src/services/bookingRequestService";
import dayjs from "dayjs";
import {
  fetchRoomAllocationsForCheckin,
  updateRoomAllocationById,
} from "../../../../services/src/services/roomAllocationService";

const CheckInDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allAllocations, setAllAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQRcodeScanned, setIsQRcodeScanned] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [checkIns, setCheckIns] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [processingAllocation, setProcessingAllocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const todayFormatted = today.toISOString().split("T")[0];

      try {
        const bookingResponse = await fetchRoomAllocationsForCheckin(
          todayFormatted
        );
        const bookingData = bookingResponse.data;
        setAllAllocations(bookingData);
        setFilteredAllocations(bookingData);
        setTotalRequests(bookingData.length);
        if (bookingData.length > 0) {
          setSelectedUser(bookingData[0]);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckInClick = (booking, e) => {
    e.stopPropagation();
    setProcessingAllocation(booking);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCheckIn = async () => {
    try {
      const payload = {
        data: {
          room_status: "occupied",
        },
      };
      const response = await updateRoomAllocationById(selectedUser.id, payload);

      if (response.ok) {
        const updatedAllocations = allAllocations.map((allocation) => {
          if (allocation.id === processingAllocation.id) {
            return {
              ...allocation,
              attributes: {
                ...allocation.attributes,
                room_status: "occupied",
              },
            };
          }
          return allocation;
        });

        setAllAllocations(updatedAllocations);
        setFilteredAllocations(updatedAllocations);
        setCheckIns((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating check-in status:", error);
    } finally {
      setIsConfirmModalOpen(false);
      setProcessingAllocation(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQRcodeScanned(true);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAllocations(allAllocations);
    } else {
      const filtered = allAllocations.filter((booking) =>
        booking.attributes.name.toLowerCase().includes(query.toLowerCase())
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
            <div
              className="progress-fill"
              style={{ width: `${(checkIns / totalRequests) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Checked-in: {checkIns}/{totalRequests}
          </div>
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
              {allAllocations.length === 0 ? (
                <tr>
                  <td colSpan="3">No check-ins scheduled for tomorrow.</td>
                </tr>
              ) : (
                filteredAllocations.map((booking) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    key={booking.id}
                    onClick={() => handleSelectUser(booking)}
                    className={
                      selectedUser?.id === booking.id ? "selected-row" : ""
                    }
                  >
                    <td>
                      {
                        booking?.attributes?.booking_request?.data?.attributes
                          ?.name
                      }
                    </td>
                    <td style={{ textAlign: "center" }}>{booking.id}</td>
                    <td>
                      <button
                        className={`check-in-button ${
                          booking?.attributes?.room_status === "occupied"
                            ? "checked-in"
                            : ""
                        }`}
                        onClick={(e) => handleCheckInClick(booking, e)}
                        disabled={
                          booking?.attributes?.room_status === "occupied"
                        }
                      >
                        {booking?.attributes?.room_status === "occupied"
                          ? "Checked In"
                          : "Check in"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        className="check-in-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>Confirm Check-in</h2>
          <p>
            Are you sure you want to check in{" "}
            {selectedUser?.attributes?.booking_request?.data?.attributes?.name}?
          </p>
          <div className="modal-buttons">
            <button
              className="cancel-button"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </button>
            <button className="confirm-button" onClick={handleConfirmCheckIn}>
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {selectedUser && (
        <GuestDetails
          userId={selectedUser?.attributes?.guests?.data?.[0]?.id}
          showQRSection={true}
          checkout={false}
        />
      )}
    </div>
  );
};

export default CheckInDetails;
