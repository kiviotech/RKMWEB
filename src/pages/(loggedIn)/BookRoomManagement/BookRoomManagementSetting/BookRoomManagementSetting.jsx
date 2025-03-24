import React, { useState, useEffect } from "react";
import BlockRoom from "../BlockRoom/BlockRoom";
import BookRoom from "../BookRoom/BookRoom";
import AddBlock from "../AddBlock/AddBlock";
import AddRoom from "../AddRoom/AddRoom";
import "./BookRoomManagementSetting.scss";
import { fetchBookingRequestById } from "../../../../../services/src/services/bookingRequestService";

const BookRoomManagementSetting = ({
  onBlockCreated,
  selectedBlockId,
  onRoomAdded,
  onRoomAllocated,
  guestDetails,
  selectedRooms,
  onClearSelections
}) => {
  const [activeTab, setActiveTab] = useState("block"); // "block" or "book"
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [guestFullDetails, setGuestFullDetails] = useState(null);

  useEffect(() => {
    const fetchGuestDetails = async () => {
      if (guestDetails?.guests?.[0]?.bookingRequestId) {
        try {
          const response = await fetchBookingRequestById(guestDetails.guests[0].bookingRequestId);
          console.log("Booking Request Details:", response);
          setGuestFullDetails(response);
        } catch (error) {
          console.error("Error fetching guest details:", error);
        }
      }
    };

    fetchGuestDetails();
  }, [guestDetails]);

  const handleAddBlockClick = () => {
    setShowAddBlock(true);
    setShowAddRoom(false);
  };

  const handleAddRoomClick = () => {
    setShowAddRoom(true);
    setShowAddBlock(false);
  };

  const handleCloseAddBlock = () => {
    setShowAddBlock(false);
  };

  // Add this function to prevent click propagation
  const handleGuestDetailsPanelClick = (e) => {
    e.stopPropagation();
  };

  // Add this function to handle bed selection
  const handleBedSelection = (roomNumber, details) => {
    // You can add logic here to handle the bed selection
    console.log('Selected bed in room:', roomNumber, details);
  };

  const renderGuestDetailsPanel = () => {
    if (!guestDetails) return null;

    return (
      <div className="guest-details-panel" onClick={handleGuestDetailsPanelClick}>
        {guestDetails.guests.map((guest, index) => {
          // Find the selected room for this guest
          const selectedRoom = selectedRooms[index];
          const roomNumber = selectedRoom?.roomNumber ||
            guestFullDetails?.data?.attributes?.guests?.data?.[0]?.attributes?.room_allocations?.data?.[0]?.attributes?.room?.data?.attributes?.room_number ||
            "Not Assigned";

          return (
            <div key={index} className="guest-card">
              <div className="guest-header">
                <h3>Mr. {guest.name}</h3>
                <span className="room-number">{roomNumber}</span>
              </div>

              <div className="guest-info-grid">
                <div className="info-row">
                  <div className="info-item">
                    <span className="label">Age :</span>
                    <span className="value">
                      {guestFullDetails?.data?.attributes?.age || "34"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Ph. No.:</span>
                    <span className="value">{guest.phoneNumber}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <span className="label">Gender :</span>
                    <span className="value">
                      {guestFullDetails?.data?.attributes?.gender || "M"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email :</span>
                    <span className="value email-value">
                      {guestFullDetails?.data?.attributes?.email || guest.email || 'john.dee@gmail.com'}
                    </span>
                  </div>
                </div>

                <div className="dates-row">
                  <div className="date-item">
                    <span className="date-label">Arrival Date:</span>
                    <span className="date-value">
                      {new Date(guest.arrivalDate).toLocaleDateString('en-GB') || '00/00/0000'}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Departure Date:</span>
                    <span className="date-value">
                      {new Date(guest.departureDate).toLocaleDateString('en-GB') || '00/00/0000'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add a summary of selected rooms if any */}
        {selectedRooms.length > 0 && (
          <div className="selected-rooms-summary">
            <h4>Selected Rooms:</h4>
            {selectedRooms.map((room, index) => (
              <div key={index} className="selected-room-item">
                <span>Room {room.roomNumber}</span>
                {room.guestName && <span> - {room.guestName}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Add this function to get the number of guests
  const getGuestCount = () => {
    return guestDetails?.guests?.length || 0;
  };

  return (
    <div className="booking-management-wrapper">
      {/* Show guest details panel if available */}
      {renderGuestDetailsPanel()}

      {/* Pass the guest count to the parent component */}
      {guestDetails && (
        <div className="guest-count-info">
          <span>Total Guests: {getGuestCount()}</span>
        </div>
      )}

      {/* Only show these elements if there are no guest details */}
      {!guestDetails && (
        <>
          <div className="action-buttons">
            <button className="add-block-btn" onClick={handleAddBlockClick}>
              Add New Building
            </button>
            <button className="add-room-btn" onClick={() => setShowAddRoom(true)}>
              Add Room
            </button>
          </div>

          {showAddBlock && (
            <AddBlock
              onClose={handleCloseAddBlock}
              onBlockCreated={onBlockCreated}
            />
          )}
          {showAddRoom && (
            <AddRoom
              onClose={() => setShowAddRoom(false)}
              selectedBlockId={selectedBlockId}
              onRoomAdded={onRoomAdded}
            />
          )}

          <div className="booking-management-form">
            <div className="booking-tab-controls">
              <button
                className={`booking-tab-btn ${activeTab === "block" ? "active" : ""}`}
                onClick={() => setActiveTab("block")}
              >
                Block Room
              </button>
              <button
                className={`booking-tab-btn ${activeTab === "book" ? "active" : ""}`}
                onClick={() => setActiveTab("book")}
              >
                Allocate Room
              </button>
            </div>

            {activeTab === "block" ? (
              <BlockRoom
                selectedBlockId={selectedBlockId}
                onRoomBlocked={onBlockCreated}
              />
            ) : (
              <BookRoom
                selectedBlockId={selectedBlockId}
                onRoomAllocated={onRoomAllocated}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookRoomManagementSetting;
