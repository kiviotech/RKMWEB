import React, { useState, useEffect } from "react";
import BlockRoom from "../BlockRoom/BlockRoom";
import BookRoom from "../BookRoom/BookRoom";
import AddBlock from "../AddBlock/AddBlock";
import AddRoom from "../AddRoom/AddRoom";
import ImportUsers from "../ImportUsers/ImportUsers";
import "./BookRoomManagementSetting.scss";
import { fetchBookingRequestById } from "../../../../../services/src/services/bookingRequestService";
import { updateRoomAllocationById } from "../../../../../services/src/services/roomAllocationService";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookRoomManagementSetting = ({
  onBlockCreated,
  selectedBlockId,
  onRoomAdded,
  onRoomAllocated,
  guestDetails,
  selectedRooms,
  onClearSelections,
  onClearGuestDetails
}) => {
  const [activeTab, setActiveTab] = useState("block"); // "block", "book", or "import"
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [guestFullDetails, setGuestFullDetails] = useState(null);
  const [originalRoomNumbers, setOriginalRoomNumbers] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    // Store original room numbers when guest details are loaded
    if (guestDetails?.guests) {
      const originals = {};
      guestDetails.guests.forEach((guest, index) => {
        const originalRoom = guestFullDetails?.data?.attributes?.guests?.data?.[0]?.attributes?.room_allocations?.data?.[0]?.attributes?.room?.data?.attributes?.room_number || "Not Assigned";
        originals[index] = originalRoom;
      });
      setOriginalRoomNumbers(originals);
    }
  }, [guestFullDetails, guestDetails]);

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

    const hasNewAllocations = selectedRooms.some(room => room?.roomNumber);
    // Add this check to see if all guests have been assigned rooms
    const allGuestsAssigned = selectedRooms.length >= guestDetails.guests.length;

    return (
      <div className="guest-details-panel" onClick={handleGuestDetailsPanelClick}>
        {guestDetails.guests.map((guest, index) => {
          const selectedRoom = selectedRooms[index];
          const originalRoomNumber = originalRoomNumbers[index] || "Not Assigned";

          return (
            <div key={index} className="guest-card">
              <div className="guest-header">
                <h3>{guest.name}</h3>
                <span className="room-number">
                  {selectedRoom?.roomNumber ? (
                    <>
                      <span className="previous-room">{originalRoomNumber}</span>
                      <span className="arrow"> → </span>
                      <span className="new-room">{selectedRoom.roomNumber}</span>
                    </>
                  ) : (
                    originalRoomNumber
                  )}
                </span>
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

        {/* Modify the action buttons section */}
        {hasNewAllocations && (
          <div className="allocation-actions">
            <button
              className="clear-btn"
              onClick={() => {
                onClearSelections();
                if (onBlockCreated) {
                  onBlockCreated();
                }
              }}
            >
              Clear
            </button>
            <button
              className="reallocate-btn"
              disabled={!allGuestsAssigned}
              title={!allGuestsAssigned ? "Please assign rooms to all guests before reallocating" : ""}
              onClick={async () => {
                // Log guest and room allocation details before clearing
                const allocationDetails = guestDetails.guests.map((guest, index) => {
                  const selectedRoom = selectedRooms[index];
                  const roomAllocationId = guestFullDetails?.data?.attributes?.guests?.data?.[index]?.attributes?.room_allocations?.data?.[0]?.id;

                  return {
                    guestId: guest.id,
                    guestName: guest.name,
                    bookingRequestId: guest.bookingRequestId,
                    newRoomId: selectedRoom?.roomId,
                    newRoomNumber: selectedRoom?.roomNumber,
                    roomAllocationId: roomAllocationId || 'No previous allocation'
                  };
                });

                try {
                  // Get all guest IDs
                  const guestIds = guestDetails.guests.map(guest => guest.id);

                  // For each allocation that needs to be updated
                  for (const allocation of allocationDetails) {
                    if (allocation.roomAllocationId && allocation.roomAllocationId !== 'No previous allocation') {
                      const updateData = {
                        room_status: "allocated",
                        guests: guestIds,
                        booking_request: {
                          id: allocation.bookingRequestId
                        },
                        room: {
                          id: allocation.newRoomId
                        }
                      }

                      await updateRoomAllocationById(allocation.roomAllocationId, updateData);
                    }
                  }

                  // Clear selections and guest details
                  onClearSelections();
                  onClearGuestDetails();
                  setActiveTab('block');

                  // Scroll to top of the page
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });

                  if (onBlockCreated) {
                    onBlockCreated();
                  }
                } catch (error) {
                  console.error("Error updating room allocations:", error);
                  toast.error('Failed to reallocate rooms. Please try again.');
                }
              }}
            >
              Reallocate Room
            </button>
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
              <button
                className={`booking-tab-btn ${activeTab === "import" ? "active" : ""}`}
                onClick={() => setActiveTab("import")}
              >
                Import Users
              </button>
            </div>

            {activeTab === "block" ? (
              <BlockRoom
                selectedBlockId={selectedBlockId}
                onRoomBlocked={onBlockCreated}
              />
            ) : activeTab === "book" ? (
              <BookRoom
                selectedBlockId={selectedBlockId}
                onRoomAllocated={onRoomAllocated}
              />
            ) : (
              <ImportUsers />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookRoomManagementSetting;
