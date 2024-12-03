import React, { useState, useEffect } from "react";
import "./BookRoom.scss";
import filledBedImage from "../../../assets/icons/filledBedImage.jpeg";
import emptyBedImage from "../../../assets/icons/emptyBedImage.jpeg";
import hoverImage from "../../../assets/icons/hoverImage.jpeg";
import selectedImage from "../../../assets/icons/selectedImage.jpeg";
import { fetchRooms, updateRoomById } from "../../../../services/src/services/roomService";
import { useLocation, useNavigate } from 'react-router-dom';
import { BsListUl } from 'react-icons/bs';
import { IoGrid } from "react-icons/io5";

// Add these new components at the top of the file
const AllocatedGuestsTable = ({ guests, onConfirmAllocation, roomsData }) => {
  const allocatedGuests = guests?.filter(guest => guest.roomNo && guest.roomNo !== "-") || [];

  // Group guests by room number
  const guestsByRoom = allocatedGuests.reduce((acc, guest) => {
    if (!acc[guest.roomNo]) {
      acc[guest.roomNo] = [];
    }
    acc[guest.roomNo].push(guest);
    return acc;
  }, {});

  const handleConfirm = () => {
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
          <button 
            className="confirm-button"
            onClick={handleConfirm}
          >
            Confirm Allocation
          </button>
        </>
      ) : (
        <div className="no-guests-message">No guests allocated</div>
      )}
    </div>
  );
};

const NonAllocatedGuestsTable = ({ guests, onSelect, selectedGuests }) => {
  if (!guests || guests.length === 0) {
    return (
      <div className="guests-table">
        <h3>Non-Allocated Guests</h3>
        <div className="no-guests-message">No guests available</div>
      </div>
    );
  }

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
          {guests.map((guest, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedGuests[index] !== false}
                  onChange={() => onSelect(index)}
                />
              </td>
              <td>{guest.name}</td>
              <td>{guest.age}</td>
              <td>{guest.gender}</td>
              <td>{guest.relation}</td>
            </tr>
          ))}
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
  const month = date.toLocaleString('default', { month: 'short' });
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
const RoomListView = ({ rooms, activeTab }) => {
  const getCategoryDetails = () => {
    switch (activeTab) {
      case "Guest house":
        return {
          text: "Guest House",
          color: "#7ACD06"
        };
      case "F":
        return {
          text: "Peerless Flat",
          color: "#F2930D"
        };
      case "Yatri Niwas":
        return {
          text: "Yatri Niwas",
          color: "#FF4B4B"  // You can adjust this color as needed
        };
      default:
        return {
          text: "",
          color: "#000000"
        };
    }
  };

  const { text, color } = getCategoryDetails();

  return (
    <div className="room-list-view">
      <div className="room-category-header" style={{ color }}>
        {text}
      </div>
      <div className="room-list-grid">
        {rooms.map((room, index) => (
          <div key={index} className="room-list-item">
            <div className="room-number">{room.name}</div>
            <div className="available-count">{room.availableBeds}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const guestData = location.state?.guestData;

  console.log('Guest IDs:', guestData?.additionalGuests?.map(guest => guest.id));

  const [activeTab, setActiveTab] = useState("Guest house"); // State for active tab
  const [arrivalDate, setArrivalDate] = useState(""); // State for arrival date
  const [departureDate, setDepartureDate] = useState(""); // State for departure date
  const [dates, setDates] = useState([]); // State for storing the date range
  const [sortType, setSortType] = useState(""); // State to store the selected room type
  const [clickedBeds, setClickedBeds] = useState({
    "Guest house": {},
    "F": {},
    "Yatri Niwas": {}
  });
  const [hoveredBeds, setHoveredBeds] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRight, setIsLoadingRight] = useState(false);
  const [isLoadingLeft, setIsLoadingLeft] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [roomsData, setRoomsData] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [allocatedGuestsList, setAllocatedGuestsList] = useState([]); // Add this new state
  const [selectedBedData, setSelectedBedData] = useState(null);
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    if (guestData) {
      if (guestData.arrivalDate) {
        setArrivalDate(new Date(guestData.arrivalDate).toISOString().split('T')[0]);
      }
      if (guestData.departureDate) {
        setDepartureDate(new Date(guestData.departureDate).toISOString().split('T')[0]);
      }
    }
  }, [guestData]);

  // Initialize selectedGuests when guestData changes
  useEffect(() => {
    if (guestData?.additionalGuests) {
      // Initialize all guests as selected (true)
      setSelectedGuests(new Array(guestData.additionalGuests.length).fill(true));
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
      [activeTab]: {}
    };

    let bedsNeeded = selectedGuestCount;
    let selectedBeds = [];
    let roomAssignments = [];

    // Modified logic for F category
    if (activeTab === 'F') {
      // Find rooms with available beds
      const availableRooms = filteredRooms.filter(room => room.availableBeds > 0);
      
      for (let roomIndex = 0; roomIndex < filteredRooms.length && bedsNeeded > 0; roomIndex++) {
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
      for (let roomIndex = 0; roomIndex < filteredRooms.length && bedsNeeded > 0; roomIndex++) {
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

    const selectedGuestsList = guestData.additionalGuests.filter((_, index) => selectedGuests[index]);
    const newAllocatedGuests = selectedGuestsList.map((guest, index) => ({
      ...guest,
      roomNo: roomAssignments[index]
    }));

    setAllocatedGuestsList(prev => [...prev, ...newAllocatedGuests]);
    setSelectedGuests(prev => prev.map((isSelected) => false));
  };

  const getBeds = (beds, roomIndex, dateIndex) => {
    const room = roomsData[roomIndex];
    const currentDate = new Date(dates[dateIndex]);
    
    if (!room) {
      console.error("No room found for index:", roomIndex);
      return null;
    }

    const currentRoom = filteredRooms[roomIndex];
    const totalBeds = currentRoom.beds;
    const availableBeds = currentRoom.availableBeds;

    const handleBedClick = (bedIndex, bedId, isFilled) => {
      const bedData = {
        bed: {
          index: bedIndex,
          id: bedId,
          status: isFilled ? 'occupied' : 'available',
          date: dates[dateIndex]
        },
        room: {
          ...room.attributes,
          id: room.id,
          roomNumber: currentRoom.name,
          type: currentRoom.type,
          category: currentRoom.category,
          totalBeds,
          availableBeds,
          guests: room.attributes.guests?.data || []
        }
      };

      setSelectedBedData(bedData);

      // Only allow bed selection if there are guest IDs and the bed isn't filled
      if (!isFilled && guestData?.additionalGuests?.some(guest => guest.id)) {
        const newClickedBeds = {
          ...clickedBeds,
          [activeTab]: {
            ...clickedBeds[activeTab],
            [bedId]: !clickedBeds[activeTab]?.[bedId]
          }
        };
        setClickedBeds(newClickedBeds);
      }
    };

    if (activeTab === 'F') {
      const filledBedCount = totalBeds - availableBeds;
      
      return (
        <div className={`bed-grid beds-${totalBeds}`}>
          {[...Array(totalBeds)].map((_, bedIndex) => {
            const bedId = `${roomIndex}-${dateIndex}-${bedIndex}`;
            const isClicked = clickedBeds[activeTab]?.[bedId];
            const isFilled = bedIndex < filledBedCount;

            let bedImage = emptyBedImage;
            if (isFilled) {
              bedImage = filledBedImage;
            } else if (isClicked) {
              bedImage = selectedImage;
            }

            return (
              <div
                key={bedId}
                className={`bed-icon ${isFilled ? 'filled' : 'empty'}`}
                title={isFilled ? "Occupied" : "Available"}
                onClick={() => handleBedClick(bedIndex, bedId, isFilled)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={bedImage}
                  alt="bed"
                  className={`bed-img ${!isFilled && isClicked ? "clicked-img" : ""}`}
                />
              </div>
            );
          })}
        </div>
      );
    }

    // For non-F blocks
    const occupiedBeds = room.attributes.guests?.data?.filter(guest => {
      const arrivalDate = new Date(guest.attributes.arrival_date);
      const departureDate = new Date(guest.attributes.departure_date);
      return currentDate >= arrivalDate && currentDate <= departureDate;
    }).length || 0;

    return (
      <div className={`bed-grid beds-${totalBeds}`}>
        {[...Array(totalBeds)].map((_, bedIndex) => {
          const bedId = `${roomIndex}-${dateIndex}-${bedIndex}`;
          const isClicked = clickedBeds[activeTab]?.[bedId];
          const isFilled = bedIndex < occupiedBeds;

          let bedImage = emptyBedImage;
          if (isFilled) {
            bedImage = filledBedImage;
          } else if (isClicked) {
            bedImage = selectedImage;
          }

          return (
            <div
              key={bedId}
              className={`bed-icon ${isFilled ? 'filled' : 'empty'}`}
              title={isFilled ? "Occupied" : "Available"}
              onClick={() => handleBedClick(bedIndex, bedId, isFilled)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={bedImage}
                alt="bed"
                className={`bed-img ${!isFilled && isClicked ? "clicked-img" : ""}`}
              />
            </div>
          );
        })}
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
        initialDates.push(date.toISOString().split('T')[0]);
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
        console.log('Fetched rooms data:', response.data);
        setRoomsData(response.data); // Store the fetched rooms data
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, []);

  const filteredRooms = roomsData
    .filter((room) => {
      // Ensure room category exists and convert to lowercase for comparison
      const roomCategory = (room.attributes?.room_category || '').trim().toLowerCase();
      const activeTabLower = activeTab.toLowerCase();
      
      switch (activeTabLower) {
        case 'f':
          // Strictly match F category
          return roomCategory === 'f';
        
        case 'guest house':
          // Only match guest house variations, explicitly exclude 'f'
          return (roomCategory === 'guesthouse' || 
                  roomCategory === 'guest house' || 
                  roomCategory === 'guest-house') && 
                  roomCategory !== 'f';
        
        case 'yatri niwas':
          // Only match yatri niwas variations, explicitly exclude 'f'
          return (roomCategory === 'yatriniwas' || 
                  roomCategory === 'yatri niwas' || 
                  roomCategory === 'yatri-niwas' ||
                  roomCategory === 'yatri') && 
                  roomCategory !== 'f';
        
        default:
          return false;
      }
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
      category: room.attributes.room_category,
      id: room.id
    }));

  // Update the renderDateGrid function to include the list view toggle
  const renderDateGrid = () => {
    return (
      <div className="grid-container" onScroll={handleScroll}>
        {isToggled ? (
          <RoomListView rooms={filteredRooms} activeTab={activeTab} />
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
                    rawData: roomsData[roomIndex]?.attributes || {}
                  };
                  console.log('Room Data:', roomData);
                };

                return (
                  <div key={roomIndex} className="grid-row">
                    <div 
                      className="room-cell"
                      onClick={handleRoomClick}
                      style={{ cursor: 'pointer' }}
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

  const handleConfirmAllocation = async (confirmedGuests) => {
    try {
      const guestsByRoom = confirmedGuests.reduce((acc, guest) => {
        if (!acc[guest.roomNo]) {
          acc[guest.roomNo] = [];
        }
        acc[guest.roomNo].push(guest);
        return acc;
      }, {});

      for (const [roomNo, guests] of Object.entries(guestsByRoom)) {
        const room = roomsData.find(r => r.attributes.room_number === roomNo);
        if (!room) continue;

        // Get the current room data
        const currentRoomResponse = await fetchRooms();
        const currentRoom = currentRoomResponse.data.find(r => r.id === room.id);
        
        if (!currentRoom) {
          console.error(`Room with ID ${room.id} not found`);
          continue;
        }

        // Get current available beds
        const currentAvailableBeds = parseInt(currentRoom.attributes.available_beds) || 0;
        const newAvailableBeds = currentAvailableBeds - guests.length;

        // Process guest data
        const guestConnections = guests
          .filter(guest => guest.id)
          .map(guest => ({
            id: guest.id,
            type: "guest"
          }));

        console.log('Guest connections:', guestConnections);

        const updateData = {
          data: {
            available_beds: newAvailableBeds,
            guests: {
              connect: guestConnections.map(guest => guest.id)
            }
          }
        };

        console.log('Room ID:', room.id);
        console.log('Update data:', JSON.stringify(updateData, null, 2));

        try {
          const updateResponse = await updateRoomById(room.id, updateData);
          console.log('Update response:', updateResponse);
        } catch (updateError) {
          console.error('Error updating room:', updateError.response?.data);
          throw updateError;
        }
      }

      setAllocatedGuestsList([]);
      setClickedBeds({
        "Guest house": {},
        "F": {},
        "Yatri Niwas": {}
      });

      alert("Room allocation confirmed successfully!");
      navigate('/Requests');
      
    } catch (error) {
      console.error("Error confirming allocation:", error);
      console.error("Error details:", error.response?.data);
      console.error("Full error object:", error);
      alert("Failed to confirm room allocation. Please try again.");
    }
  };

  return (
    <div className="attithi-booking-wrapper">
      <div className="booking-header-panel">
        <div className="booking-controls-group">
          <div className="booking-tab-group">
            {["Guest house", "F", "Yatri Niwas"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>


        <div className="booking-date-panel">
        <div className="booking-filter-control">
          <div className="view-toggle">
            <button 
              className={!isToggled ? 'active' : ''} 
              onClick={() => setIsToggled(false)}
            >
              <IoGrid />
            </button>
            <button 
              className={isToggled ? 'active' : ''} 
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
        <div className="booking-grid">
          {renderDateGrid()}
        </div>
        {selectedBedData && !guestData?.additionalGuests?.some(guest => guest.id) ? (
          <div className="details-panel-container">
            <BedDetailsPanel bedData={selectedBedData} />
          </div>
        ) : (
          // Only show guest allocation tables if guestData exists and has valid guest IDs
          guestData?.additionalGuests?.some(guest => guest.id) && (
            <div className="guests-panel">
              <AllocatedGuestsTable 
                guests={allocatedGuestsList} 
                onConfirmAllocation={handleConfirmAllocation}
                roomsData={roomsData}
              />
              <NonAllocatedGuestsTable 
                guests={guestData.additionalGuests.filter((_, index) => 
                  !allocatedGuestsList.some(allocated => 
                    allocated.name === guestData.additionalGuests[index].name
                  )
                )}
                selectedGuests={selectedGuests}
                onSelect={(index) => {
                  setSelectedGuests(prev => {
                    const newSelected = [...prev];
                    newSelected[index] = !newSelected[index];
                    return newSelected;
                  });
                }}
              />
              {guestData.additionalGuests.some((_, index) => 
                !allocatedGuestsList.some(allocated => 
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
    </div>
  );
};

export default BookRoom;
