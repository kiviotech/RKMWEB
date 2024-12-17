import React, { useState, useEffect } from "react";
import "./BookRoom.scss";
import filledBedImage from "../../../assets/icons/filledBedImage.jpeg";
import emptyBedImage from "../../../assets/icons/emptyBedImage.jpeg";
import hoverImage from "../../../assets/icons/hoverImage.jpeg";
import selectedImage from "../../../assets/icons/selectedImage.jpeg";
import {
  fetchRooms,
  updateRoomById,
} from "../../../../services/src/services/roomService";
import { useLocation, useNavigate } from "react-router-dom";
import { BsListUl } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import { updateBookingRequestById } from "../../../../services/src/services/bookingRequestService";

// Add these new components at the top of the file
const AllocatedGuestsTable = ({
  guests,
  onConfirmAllocation,
  roomsData,
  hasUnallocatedGuests,
  onReset,
}) => {
  const allocatedGuests =
    guests?.filter((guest) => guest.roomNo && guest.roomNo !== "-") || [];

  // Group guests by room number
  const guestsByRoom = allocatedGuests.reduce((acc, guest) => {
    if (!acc[guest.roomNo]) {
      acc[guest.roomNo] = [];
    }
    acc[guest.roomNo].push(guest);
    return acc;
  }, {});

  const handleConfirm = () => {
    if (hasUnallocatedGuests) {
      alert("Please allocate all guests before confirming");
      return;
    }

    if (onConfirmAllocation) {
      onConfirmAllocation(allocatedGuests);
    }
  };

  return (
    <div className="guests-table">
      <h3>Allocated Guests</h3>
      {allocatedGuests.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Relation</th>
                <th>Room No.</th>
              </tr>
            </thead>
            <tbody>
              {allocatedGuests.map((guest, index) => (
                <tr key={index}>
                  <td>{guest.name}</td>
                  <td>{guest.age}</td>
                  <td>{guest.gender}</td>
                  <td>{guest.relation}</td>
                  <td>{guest.roomNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "10px",
            }}
          >
            <button className="confirm-button" onClick={handleConfirm}>
              Confirm Allocation
            </button>
            <button
              className="reset-button"
              onClick={onReset}
              disabled={allocatedGuests.length === 0}
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        <div className="no-guests-message">No guests allocated</div>
      )}
    </div>
  );
};

const NonAllocatedGuestsTable = ({
  guests,
  onSelect,
  selectedGuests,
  guestData,
}) => {
  if (!guests || guests.length === 0) {
    return (
      <div className="guests-table">
        <h3>Non-Allocated Guests</h3>
        <div className="no-guests-message">No guests available</div>
      </div>
    );
  }

  const findOriginalIndex = (guest) => {
    return guestData.additionalGuests.findIndex((g) => g.name === guest.name);
  };

  return (
    <div className="guests-table">
      <h3>Non-Allocated Guests</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Relation</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => {
            const originalIndex = findOriginalIndex(guest);
            return (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedGuests[originalIndex] || false}
                    onChange={() => onSelect(originalIndex)}
                  />
                </td>
                <td>{guest.name}</td>
                <td>{guest.age}</td>
                <td>{guest.gender}</td>
                <td>{guest.relation}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Add this new component for availability display
const AvailabilityBox = ({ availableBeds }) => (
  <div className="availability-box">
    <div className="count">{availableBeds}</div>
    <div className="status">Available</div>
  </div>
);

// Add this new helper function near the top of your component
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}${month} ${year}`;
};

// Add this new component
const BedDetailsPanel = ({ bedData }) => {
  if (!bedData) return null;

  const { bed, room } = bedData;
  const guests = room.guests || [];

  return (
    <div className="bed-details-panel">
      {guests.map((guest, index) => (
        <div key={index} className="guest-card">
          <div className="guest-info">
            <div className="guest-header">
              <h3>Mr. {guest.attributes.name}</h3>
              <span className="room-number">{room.room_number}</span>
            </div>

            <div className="guest-details-grid">
              <div className="detail-row">
                <span className="label">Age :</span>
                <span className="value">{guest.attributes.age}</span>
              </div>

              <div className="detail-row">
                <span className="label">Ph. No. :</span>
                <span className="value">{guest.attributes.phone_number}</span>
              </div>

              <div className="detail-row">
                <span className="label">Gender :</span>
                <span className="value">{guest.attributes.gender}</span>
              </div>

              <div className="detail-row">
                <span className="label">Email :</span>
                <span className="value">{guest.attributes.email}</span>
              </div>
            </div>

            <div className="dates">
              <div className="date-row">
                <span className="label">Arrival Date:</span>
                <span className="value">{guest.attributes.arrival_date}</span>
              </div>
              <div className="date-row">
                <span className="label">Departure Date:</span>
                <span className="value">{guest.attributes.departure_date}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Add this new component for the list view
const RoomListView = ({ rooms, activeTab, onRoomSelect, selectedGuests }) => {
  // Group rooms by category, ensuring case-insensitive matching
  const roomsByCategory = rooms.reduce((acc, room) => {
    const category = room.category?.toLowerCase()?.trim() || "";
    let normalizedCategory;

    if (category.includes("guest")) {
      normalizedCategory = "guest house";
    } else if (category === "f") {
      normalizedCategory = "peerless flat";
    } else if (category.includes("yatri")) {
      normalizedCategory = "yatri niwas";
    } else {
      normalizedCategory = "other";
    }

    if (!acc[normalizedCategory]) {
      acc[normalizedCategory] = [];
    }
    acc[normalizedCategory].push(room);
    return acc;
  }, {});

  const normalizedActiveTab = activeTab?.toLowerCase().trim();

  // Filter rooms based on the normalized activeTab
  const filteredRooms = roomsByCategory[normalizedActiveTab] || [];

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "guest house":
        return "#7ACD06";
      case "peerless flat":
        return "#F2930D";
      case "yatri niwas":
        return "#FF4B4B";
      default:
        return "#000000";
    }
  };

  return (
    <div className="room-list-view">
      {filteredRooms.length > 0 ? (
        <div className="category-section">
          <div
            className="room-category-header"
            style={{ color: getCategoryColor(normalizedActiveTab) }}
          >
            {activeTab}
          </div>
          <div className="room-list-grid">
            {filteredRooms.map((room, index) => {
              const canAllocate = room.availableBeds > 0;
              const selectedGuestsCount =
                selectedGuests?.filter(Boolean).length || 0;
              const isDisabled = !canAllocate || selectedGuestsCount === 0;

              return (
                <div
                  key={index}
                  className={`room-list-item ${isDisabled ? "disabled" : ""}`}
                  onClick={() => {
                    if (isDisabled) {
                      if (!canAllocate) {
                        alert("This room has no available beds");
                      } else if (selectedGuestsCount === 0) {
                        alert("Please select guests to allocate");
                      }
                      return;
                    }
                    onRoomSelect(room);
                  }}
                  style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                >
                  <div className="room-number">{room.name}</div>
                  <div className="available-count">{room.availableBeds}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>No rooms available for this category.</div>
      )}
    </div>
  );
};

// Remove the Modal import and add this custom modal component
const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">{children}</div>
    </div>
  );
};

// Update the email modal component
const ConfirmationEmailModal = ({
  isOpen,
  onClose,
  guestData,
  arrivalDate,
  departureDate,
  onSend,
}) => {
  const navigate = useNavigate();
  const [emailContent, setEmailContent] = useState(`Dear Devotee,

Namoskar,

We have received, the below email and noted the contents. You are welcome to stay at our Guest House during the mentioned period i.e arrival - ${arrivalDate} and departure - ${departureDate} after breakfast at 07.30 a.m. The accommodation will be kept reserved for - devotees

Please bring a hard copy of this letter for ready reference along with your ID Proof or copy of your ID Proof (Aadhaar/ PAN/ Voter Card/Passport) Also, try to reach the Math Office to do the registration formalities between 09.00 to 11.00 a.m. on the day of arrival

May Sri Ramakrishna, Holy Mother Sri Sarada Devi and Swami Vivekananda bless you all !

Pranam and namaskar again.

Yours sincerely,

Swami Lokahanananda
Adhyaksha
RAMAKRISHNA MATH & RAMAKRISHNA MISSION, KAMANKUNUR`);

  useEffect(() => {
    setEmailContent((prevContent) => {
      return prevContent.replace(
        /arrival - .* and departure - .*/,
        `arrival - ${arrivalDate} and departure - ${departureDate}`
      );
    });
  }, [arrivalDate, departureDate]);

  const handleSend = async () => {
    try {
      // Call the onSend prop function and wait for it to complete
      await onSend();
      onClose();
      navigate("/Requests");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email and allocate rooms. Please try again.");
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="email-template">
        <div className="email-header">
          <span className="close-button" onClick={onClose}>
            ×
          </span>
          <div className="email-fields">
            <div className="field">
              <span>From:</span>
              <span className="email-address">emailaddress@gmail.com</span>
            </div>
            <div className="field">
              <span>To:</span>
              <div className="recipient-tags">
                {guestData?.additionalGuests?.map((guest, index) => (
                  <div key={index} className="recipient-chip">
                    <div className="avatar">A</div>
                    <span className="name">{guest.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="email-content">
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="email-content-textarea"
          />
        </div>

        <div className="email-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSend} className="send-button">
            Send
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

// Add this new date formatting helper function
const formatDateDDMMYYYY = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Add this new component for the guest popup
const GuestDetailsPopup = ({ guest, position }) => {
  if (!guest) return null;

  return (
    <div
      className="guest-popup"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: "200px",
      }}
    >
      <h4>{guest.attributes.name}</h4>
      <div>Age: {guest.attributes.age}</div>
      <div>Gender: {guest.attributes.gender}</div>
      <div>Phone: {guest.attributes.phone_number}</div>
      <div>Email: {guest.attributes.email}</div>
      <div>Arrival: {formatDateDDMMYYYY(guest.attributes.arrival_date)}</div>
      <div>
        Departure: {formatDateDDMMYYYY(guest.attributes.departure_date)}
      </div>
    </div>
  );
};

const BookRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const guestData = location.state?.guestData;

  // console.log('Request ID in BookRoom:', guestData?.requestId);
  // console.log('Guest IDs:', guestData?.additionalGuests?.map(guest => guest.id));

  const [activeTab, setActiveTab] = useState("Guest house"); // State for active tab
  const [arrivalDate, setArrivalDate] = useState(""); // State for arrival date
  const [departureDate, setDepartureDate] = useState(""); // State for departure date
  const [dates, setDates] = useState([]); // State for storing the date range
  const [sortType, setSortType] = useState(""); // State to store the selected room type
  const [clickedBeds, setClickedBeds] = useState({
    "Guest house": {},
    "Peerless Flat": {},
    "Yatri Niwas": {},
  });
  const [hoveredBeds, setHoveredBeds] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRight, setIsLoadingRight] = useState(false);
  const [isLoadingLeft, setIsLoadingLeft] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [roomsData, setRoomsData] = useState([]);
  const [originalRoomData, setOriginalRoomData] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [allocatedGuestsList, setAllocatedGuestsList] = useState([]); // Add this new state
  const [selectedBedData, setSelectedBedData] = useState(null);
  const [isToggled, setIsToggled] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [confirmedGuestsForAllocation, setConfirmedGuestsForAllocation] =
    useState([]);
  const [hoveredGuestData, setHoveredGuestData] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (guestData) {
      if (guestData.arrivalDate) {
        setArrivalDate(
          new Date(guestData.arrivalDate).toISOString().split("T")[0]
        );
      }
      if (guestData.departureDate) {
        setDepartureDate(
          new Date(guestData.departureDate).toISOString().split("T")[0]
        );
      }
    }
  }, [guestData]);

  // Update the useEffect that initializes selectedGuests
  useEffect(() => {
    if (guestData?.additionalGuests) {
      // Initialize all guests as selected (true)
      setSelectedGuests(
        new Array(guestData.additionalGuests.length).fill(true)
      );
    }
  }, [guestData]);

  const handleMouseEnter = (bedId) => {
    setHoveredBeds((prev) => ({
      ...prev,
      [bedId]: true, // Set hover state to true for this bed
    }));
  };

  const handleMouseLeave = (bedId) => {
    setHoveredBeds((prev) => ({
      ...prev,
      [bedId]: false, // Set hover state to false for this bed
    }));
  };

  const handleAllocateClick = () => {
    if (!arrivalDate || !departureDate) {
      alert("Please select arrival and departure dates");
      return;
    }

    const selectedGuestCount = selectedGuests.filter(Boolean).length;
    if (selectedGuestCount === 0) {
      alert("Please select at least one guest to allocate");
      return;
    }

    const newClickedBeds = {
      ...clickedBeds,
      [activeTab]: {},
    };

    let bedsNeeded = selectedGuestCount;
    let selectedBeds = [];
    let roomAssignments = [];

    // Modified logic for F category
    if (activeTab === "F") {
      // Find rooms with available beds
      const availableRooms = filteredRooms.filter(
        (room) => room.availableBeds > 0
      );

      for (
        let roomIndex = 0;
        roomIndex < filteredRooms.length && bedsNeeded > 0;
        roomIndex++
      ) {
        const room = filteredRooms[roomIndex];
        const availableBeds = room.availableBeds;
        const totalBeds = room.beds;
        const filledBedCount = totalBeds - availableBeds;

        // Calculate how many beds we can allocate in this room
        const bedsToAllocateInThisRoom = Math.min(availableBeds, bedsNeeded);

        // Allocate beds in this room
        for (let i = 0; i < bedsToAllocateInThisRoom; i++) {
          const bedIndex = filledBedCount + i;
          selectedBeds.push({ roomIndex, bedIndex });
          roomAssignments.push(room.name);
          bedsNeeded--;
        }

        if (bedsNeeded === 0) break;
      }
    } else {
      // Existing logic for other categories
      for (
        let roomIndex = 0;
        roomIndex < filteredRooms.length && bedsNeeded > 0;
        roomIndex++
      ) {
        const room = roomsData[roomIndex];
        const availableBeds = room?.attributes?.available_beds ?? 0;
        const totalBeds = room?.attributes?.beds ?? 0;
        const filledBedCount = totalBeds - availableBeds;

        const bedsToAllocateInThisRoom = Math.min(availableBeds, bedsNeeded);

        for (let i = 0; i < bedsToAllocateInThisRoom; i++) {
          const bedIndex = filledBedCount + i;
          selectedBeds.push({ roomIndex, bedIndex });
          roomAssignments.push(filteredRooms[roomIndex].name);
          bedsNeeded--;
        }
      }
    }

    if (bedsNeeded > 0) {
      alert("Not enough available beds for the selected guests");
      return;
    }

    // Select the beds for all dates in the range
    dates.forEach((dateStr, dateIndex) => {
      const currentDate = new Date(dateStr);
      const arrivalDateTime = new Date(arrivalDate);
      const departureDateTime = new Date(departureDate);

      if (currentDate >= arrivalDateTime && currentDate <= departureDateTime) {
        selectedBeds.forEach(({ roomIndex, bedIndex }) => {
          const bedId = `${roomIndex}-${dateIndex}-${bedIndex}`;
          newClickedBeds[activeTab][bedId] = true;
        });
      }
    });

    setClickedBeds(newClickedBeds);

    const selectedGuestsList = guestData.additionalGuests.filter(
      (_, index) => selectedGuests[index]
    );
    const newAllocatedGuests = selectedGuestsList.map((guest, index) => ({
      ...guest,
      roomNo: roomAssignments[index],
    }));

    setAllocatedGuestsList((prev) => [...prev, ...newAllocatedGuests]);
    setSelectedGuests((prev) => prev.map((isSelected) => false));
  };

  const handleBedAllocation = (
    bedIndex,
    bedId,
    isFilled,
    roomIndex,
    dateIndex
  ) => {
    if (isFilled) return;

    const isCurrentlySelected = clickedBeds[activeTab]?.[bedId];

    const arrivalDateTime = new Date(arrivalDate);
    const departureDateTime = new Date(departureDate);

    if (isCurrentlySelected) {
      const newClickedBeds = { ...clickedBeds };
      dates.forEach((dateStr, idx) => {
        const currentDate = new Date(dateStr);
        if (
          currentDate >= arrivalDateTime &&
          currentDate <= departureDateTime
        ) {
          const dateBedId = `${roomIndex}-${idx}-${bedIndex}`;
          if (newClickedBeds[activeTab]) {
            delete newClickedBeds[activeTab][dateBedId];
          }
        }
      });

      setClickedBeds(newClickedBeds);

      const currentRoom = filteredRooms[roomIndex];
      const guestToRemove = allocatedGuestsList.find(
        (guest) => guest.roomNo === currentRoom.name
      );

      if (guestToRemove) {
        const originalGuestIndex = guestData.additionalGuests.findIndex(
          (g) => g.name === guestToRemove.name
        );

        if (originalGuestIndex !== -1) {
          setSelectedGuests((prev) => {
            const newSelected = [...prev];
            newSelected[originalGuestIndex] = true;
            return newSelected;
          });
        }

        setAllocatedGuestsList((prev) =>
          prev.filter((guest) => guest !== guestToRemove)
        );
      }

      setRoomsData((prevRooms) =>
        prevRooms.map((r) => {
          if (r.attributes.room_number === currentRoom.name) {
            return {
              ...r,
              attributes: {
                ...r.attributes,
                available_beds: parseInt(r.attributes.available_beds) + 1,
              },
            };
          }
          return r;
        })
      );

      setSelectedBedData(null);
      return;
    }

    const selectedUnallocatedGuest = guestData?.additionalGuests?.find(
      (guest, index) =>
        selectedGuests[index] &&
        !allocatedGuestsList.some((allocated) => allocated.name === guest.name)
    );

    if (!selectedUnallocatedGuest) {
      alert("Please select a guest to allocate first");
      return;
    }

    const currentRoom = filteredRooms[roomIndex];
    const newAllocatedGuest = {
      ...selectedUnallocatedGuest,
      roomNo: currentRoom.name,
    };

    setAllocatedGuestsList((prev) => [...prev, newAllocatedGuest]);

    const guestIndex = guestData.additionalGuests.findIndex(
      (g) => g.name === selectedUnallocatedGuest.name
    );
    if (guestIndex !== -1) {
      setSelectedGuests((prev) => {
        const newSelected = [...prev];
        newSelected[guestIndex] = false;
        return newSelected;
      });
    }

    const newClickedBeds = { ...clickedBeds };
    dates.forEach((dateStr, idx) => {
      const currentDate = new Date(dateStr);
      if (currentDate >= arrivalDateTime && currentDate <= departureDateTime) {
        const dateBedId = `${roomIndex}-${idx}-${bedIndex}`;
        if (!newClickedBeds[activeTab]) {
          newClickedBeds[activeTab] = {};
        }
        newClickedBeds[activeTab][dateBedId] = true;
      }
    });

    setClickedBeds(newClickedBeds);

    const bedData = {
      bed: {
        index: bedIndex,
        id: bedId,
        status: "selected",
        date: dates[dateIndex],
      },
      room: {
        ...currentRoom,
        guests: [newAllocatedGuest],
      },
    };
    setSelectedBedData(bedData);
  };

  // Update the getBeds function
  const getBeds = (beds, roomIndex, dateIndex) => {
    const currentRoom = filteredRooms[roomIndex];
    const originalRoomData = roomsData.find((r) => r.id === currentRoom.id);
    const currentDate = dates[dateIndex];

    // Get all guests for this room
    const roomGuests = originalRoomData?.attributes?.guests?.data || [];

    const handleBedHover = (event, bedIndex) => {
      if (bedIndex < roomGuests.length) {
        const guest = roomGuests[bedIndex];
        const rect = event.currentTarget.getBoundingClientRect();
        setPopupPosition({
          x: rect.right - 30,
          y: rect.top - 200,
        });
        setHoveredGuestData(guest);
      }
    };

    const handleBedLeave = () => {
      setHoveredGuestData(null);
    };

    // Calculate occupied beds for the current date
    const occupiedBedsCount = roomGuests.reduce((count, guest) => {
      const arrivalDate = new Date(guest.attributes.arrival_date);
      const departureDate = new Date(guest.attributes.departure_date);
      const currentDateTime = new Date(currentDate);

      if (currentDateTime >= arrivalDate && currentDateTime <= departureDate) {
        return count + 1;
      }
      return count;
    }, 0);

    return (
      <div className={`bed-grid beds-${beds}`}>
        {[...Array(beds)].map((_, bedIndex) => {
          const bedId = `${roomIndex}-${dateIndex}-${bedIndex}`;
          const isClicked = clickedBeds[activeTab]?.[bedId];
          const isFilled = bedIndex < occupiedBedsCount;

          let bedImage;
          if (isFilled) {
            bedImage = filledBedImage;
          } else if (isClicked) {
            bedImage = selectedImage;
          } else if (hoveredBeds[bedId]) {
            bedImage = hoverImage;
          } else {
            bedImage = emptyBedImage;
          }

          return (
            <div
              key={bedId}
              className={`bed-icon ${isFilled ? "filled" : "empty"}`}
              title={isFilled ? "Occupied" : "Available"}
              onClick={() =>
                handleBedAllocation(
                  bedIndex,
                  bedId,
                  isFilled,
                  roomIndex,
                  dateIndex
                )
              }
              onMouseEnter={(e) => {
                if (isFilled) {
                  handleBedHover(e, bedIndex);
                } else {
                  !isFilled && handleMouseEnter(bedId);
                }
              }}
              onMouseLeave={() => {
                if (isFilled) {
                  handleBedLeave();
                } else {
                  !isFilled && handleMouseLeave(bedId);
                }
              }}
              style={{
                cursor: isFilled ? "default" : "pointer",
                position: "relative",
              }}
            >
              <img
                src={bedImage}
                alt="bed"
                className={`bed-img ${
                  !isFilled && isClicked ? "clicked-img" : ""
                }`}
              />
            </div>
          );
        })}
        {hoveredGuestData && (
          <GuestDetailsPopup
            guest={hoveredGuestData}
            position={popupPosition}
          />
        )}
      </div>
    );
  };

  // Function to get ordinal suffix for date
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Updated generateDates function
  const generateDates = (baseDate, numberOfDays, direction = "right") => {
    const dateArray = [];
    const currentDate = new Date(baseDate);

    if (direction === "left") {
      for (let i = numberOfDays - 1; i >= 0; i--) {
        const tempDate = new Date(currentDate);
        tempDate.setDate(currentDate.getDate() - i);
        dateArray.unshift(tempDate.toISOString().split("T")[0]); // Use ISO format
      }
    } else {
      for (let i = 0; i < numberOfDays; i++) {
        const tempDate = new Date(currentDate);
        tempDate.setDate(currentDate.getDate() + i);
        dateArray.push(tempDate.toISOString().split("T")[0]); // Use ISO format
      }
    }

    return dateArray;
  };

  // Update the useEffect that initializes dates to ensure we have the correct date range
  useEffect(() => {
    const initializeDates = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Use the arrival date if it exists, otherwise use today's date
      const startDate = arrivalDate ? new Date(arrivalDate) : today;
      setStartDate(startDate);

      // Generate dates for the next 6 months starting from the startDate
      const initialDates = [];
      for (let i = 0; i < 180; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        initialDates.push(date.toISOString().split("T")[0]);
      }
      setDates(initialDates);
    };

    initializeDates();
  }, [arrivalDate]);

  // Update the handleScroll function
  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;

    // Handle scrolling right (future dates)
    if (scrollWidth - (scrollLeft + clientWidth) < 300 && !isLoadingRight) {
      setIsLoadingRight(true);

      setTimeout(() => {
        const lastDate = dates[dates.length - 1];
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const newDates = generateDates(nextDate, 31, "right");

        setDates((prevDates) => [...prevDates, ...newDates]);
        setIsLoadingRight(false);
      }, 300);
    }
  };

  // Update the useEffect to store the fetched data
  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await fetchRooms();
        console.log("Response:", response.data);
        const processedRooms = response.data.map((room) => ({
          ...room,
          attributes: {
            ...room.attributes,
            original_available_beds: parseInt(room.attributes.available_beds),
          },
        }));
        setRoomsData(processedRooms);
        setOriginalRoomData(processedRooms); // Store original data
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, []);

  // Update the filteredRooms logic
  const filteredRooms = roomsData
    .filter((room) => {
      if (isToggled) {
        // When in list view, show all rooms
        return true;
      }

      // Normalize room category for comparison
      const roomCategory = (room.attributes?.room_category || "")
        .trim()
        .toLowerCase();
      const activeTabLower = activeTab.toLowerCase();

      // Special handling for Peerless Flat category
      if (activeTabLower === "peerless flat") {
        return roomCategory === "f";
      }

      // Handle other categories
      if (activeTabLower === "guest house") {
        return ["guesthouse", "guest house", "guest-house"].includes(
          roomCategory
        );
      }

      if (activeTabLower === "yatri niwas") {
        return ["yatriniwas", "yatri niwas", "yatri-niwas", "yatri"].includes(
          roomCategory
        );
      }

      return false;
    })
    .filter((room) => {
      if (!sortType) return true;
      return room.attributes.room_type === sortType;
    })
    .map((room) => ({
      name: room.attributes.room_number,
      beds: parseInt(room.attributes.beds) || 0,
      availableBeds: parseInt(room.attributes.available_beds) || 0,
      type: room.attributes.room_type,
      category:
        room.attributes.room_category === "f"
          ? "Peerless Flat"
          : room.attributes.room_category,
      id: room.id,
      rawAttributes: room.attributes,
    }));

  const handleRoomSelection = (room) => {
    const unallocatedGuests = guestData.additionalGuests.filter(
      (guest, index) =>
        selectedGuests[index] &&
        !allocatedGuestsList.some((allocated) => allocated.name === guest.name)
    );

    const selectedUnallocatedGuest = unallocatedGuests[0];

    if (!selectedUnallocatedGuest) {
      alert("No guests available to allocate");
      return;
    }

    const newAllocatedGuest = {
      ...selectedUnallocatedGuest,
      roomNo: room.name,
    };

    setAllocatedGuestsList((prev) => [...prev, newAllocatedGuest]);

    const newSelectedGuests = [...selectedGuests];
    const guestIndex = guestData.additionalGuests.findIndex(
      (g) => g.name === selectedUnallocatedGuest.name
    );
    if (guestIndex !== -1) {
      newSelectedGuests[guestIndex] = false;
    }
    setSelectedGuests(newSelectedGuests);

    // Update room's available beds
    setRoomsData((prevRooms) =>
      prevRooms.map((r) => {
        if (r.attributes.room_number === room.name) {
          return {
            ...r,
            attributes: {
              ...r.attributes,
              available_beds: parseInt(r.attributes.available_beds) - 1,
            },
          };
        }
        return r;
      })
    );
  };

  // Update the renderDateGrid function to use the new handleRoomSelection
  const renderDateGrid = () => {
    return (
      <div className="grid-container" onScroll={handleScroll}>
        {isToggled ? (
          <RoomListView
            rooms={filteredRooms}
            activeTab={activeTab}
            onRoomSelect={handleRoomSelection}
            selectedGuests={selectedGuests}
          />
        ) : (
          <>
            <div className="grid-header">
              <div className="corner-cell"></div>
              {isLoadingLeft && (
                <div className="date-cell">
                  <span className="loading-indicator">...</span>
                </div>
              )}
              {dates.map((date, index) => (
                <div key={index} className="date-cell">
                  {formatDate(date)}
                </div>
              ))}
              {isLoadingRight && (
                <div className="date-cell">
                  <span className="loading-indicator">...</span>
                </div>
              )}
            </div>
            <div className="grid-body">
              {filteredRooms.map((room, roomIndex) => {
                // Handler for room click
                const handleRoomClick = () => {
                  const roomData = {
                    roomNumber: room.name,
                    roomType: room.type,
                    roomCategory: room.category,
                    totalBeds: room.beds,
                    availableBeds: room.availableBeds,
                    roomId: room.id,
                    rawData: roomsData[roomIndex]?.attributes || {},
                  };
                  console.log("Room Data:", roomData);
                };

                return (
                  <div key={roomIndex} className="grid-row">
                    <div
                      className="room-cell"
                      onClick={handleRoomClick}
                      style={{ cursor: "pointer" }}
                    >
                      {room.name}
                    </div>
                    {dates.map((_, dateIndex) => (
                      <div
                        key={dateIndex}
                        className={`grid-cell ${
                          activeTab === "Yatri Niwas" ? "yatri-niwas-cell" : ""
                        }`}
                      >
                        {activeTab === "Yatri Niwas" ? (
                          <AvailabilityBox availableBeds={room.availableBeds} />
                        ) : (
                          getBeds(room.beds, roomIndex, dateIndex)
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const handleConfirmAllocation = (confirmedGuests) => {
    if (confirmedGuests.length === 0) {
      alert("No guests have been allocated");
      return;
    }
    setConfirmedGuestsForAllocation(confirmedGuests);
    setIsEmailModalOpen(true);
  };

  const handleEmailSend = async () => {
    try {
      const guestsByRoom = confirmedGuestsForAllocation.reduce((acc, guest) => {
        if (!acc[guest.roomNo]) {
          acc[guest.roomNo] = [];
        }
        acc[guest.roomNo].push(guest);
        return acc;
      }, {});

      // Process each room allocation
      for (const [roomNo, guests] of Object.entries(guestsByRoom)) {
        const room = roomsData.find((r) => r.attributes.room_number === roomNo);
        if (!room) continue;

        const currentRoomResponse = await fetchRooms();
        const currentRoom = currentRoomResponse.data.find(
          (r) => r.id === room.id
        );

        if (!currentRoom) {
          throw new Error(`Room with ID ${room.id} not found`);
        }

        const currentAvailableBeds =
          parseInt(currentRoom.attributes.available_beds) || 0;
        const newAvailableBeds = currentAvailableBeds - guests.length;

        const guestConnections = guests
          .filter((guest) => guest.id)
          .map((guest) => ({
            id: guest.id,
            type: "guest",
          }));

        const updateData = {
          data: {
            available_beds: newAvailableBeds,
            guests: {
              connect: guestConnections.map((guest) => guest.id),
            },
          },
        };

        await updateRoomById(room.id, updateData);
      }

      // Update booking request status
      const bookingRequestId = guestData?.requestId;
      if (bookingRequestId) {
        const bookingUpdateData = {
          data: {
            status: "confirmed",
          },
        };
        await updateBookingRequestById(bookingRequestId, bookingUpdateData);
      }

      // Reset all states after successful confirmation
      handleReset();

      return true;
    } catch (error) {
      console.error("Error updating rooms or booking request:", error);
      throw error;
    }
  };

  const handleReset = () => {
    // Reset rooms to original state
    setRoomsData(originalRoomData);

    // Reset all allocations
    setAllocatedGuestsList([]);

    // Reset all bed selections
    setClickedBeds({
      "Guest house": {},
      "Peerless Flat": {},
      "Yatri Niwas": {},
    });

    // Reset all guests to selected
    if (guestData?.additionalGuests) {
      setSelectedGuests(
        new Array(guestData.additionalGuests.length).fill(true)
      );
    }

    // Reset bed data
    setSelectedBedData(null);
  };

  return (
    <div className="attithi-booking-wrapper">
      <div className="booking-header-panel">
        <div className="booking-controls-group">
          {isToggled ? (
            <div className="booking-tab-group">
              {["Guest house", "Peerless Flat", "Yatri Niwas"].map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          ) : (
            <div className="booking-tab-group">
              {["Guest house", "Peerless Flat", "Yatri Niwas"].map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="booking-date-panel">
          <div className="booking-filter-control">
            <div className="view-toggle">
              <button
                className={!isToggled ? "active" : ""}
                onClick={() => setIsToggled(false)}
              >
                <IoGrid />
              </button>
              <button
                className={isToggled ? "active" : ""}
                onClick={() => setIsToggled(true)}
              >
                <BsListUl />
              </button>
            </div>
            <span className="filter-label">Sort by</span>
            <select
              className="filter-select"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="AC Rooms">AC</option>
              <option value="Non-AC Rooms">Non-AC</option>
            </select>
          </div>
          <div className="date-wrapper">
            <input
              type="date"
              id="arrival-date"
              value={arrivalDate}
              disabled
              className="date-input"
            />
            <label htmlFor="arrival-date" className="date-label">
              Arrival date
            </label>
          </div>

          <div className="date-departurewrapper">
            <input
              type="date"
              id="departure-date"
              value={departureDate}
              disabled
              className="date-input"
            />
            <label htmlFor="departure-date" className="date-label">
              Departure date
            </label>
          </div>
        </div>
      </div>
      <div className="booking-content">
        <div className="booking-grid">{renderDateGrid()}</div>
        {!guestData?.additionalGuests?.some((guest) => guest.id) ? (
          <div className="details-panel-container">
            {selectedBedData && <BedDetailsPanel bedData={selectedBedData} />}
          </div>
        ) : (
          // Only show guest allocation tables if guestData exists and has valid guest IDs
          guestData?.additionalGuests?.some((guest) => guest.id) && (
            <div className="guests-panel">
              <AllocatedGuestsTable
                guests={allocatedGuestsList}
                onConfirmAllocation={handleConfirmAllocation}
                roomsData={roomsData}
                hasUnallocatedGuests={guestData?.additionalGuests?.some(
                  (_, index) =>
                    !allocatedGuestsList.some(
                      (allocated) =>
                        allocated.name ===
                        guestData.additionalGuests[index].name
                    )
                )}
                onReset={handleReset}
              />
              <NonAllocatedGuestsTable
                guests={guestData.additionalGuests.filter(
                  (_, index) =>
                    !allocatedGuestsList.some(
                      (allocated) =>
                        allocated.name ===
                        guestData.additionalGuests[index].name
                    )
                )}
                selectedGuests={selectedGuests}
                onSelect={(index) => {
                  setSelectedGuests((prev) => {
                    const newSelected = [...prev];
                    newSelected[index] = !newSelected[index];
                    return newSelected;
                  });
                }}
                guestData={guestData}
              />
              {guestData.additionalGuests.some(
                (_, index) =>
                  !allocatedGuestsList.some(
                    (allocated) =>
                      allocated.name === guestData.additionalGuests[index].name
                  )
              ) && (
                <button
                  className="allocate-button"
                  onClick={handleAllocateClick}
                >
                  Allocate
                </button>
              )}
            </div>
          )
        )}
      </div>
      <ConfirmationEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        guestData={guestData}
        arrivalDate={arrivalDate}
        departureDate={departureDate}
        onSend={handleEmailSend}
      />
    </div>
  );
};

export default BookRoom;
