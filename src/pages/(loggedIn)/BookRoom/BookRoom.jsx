import React, { useState, useEffect } from "react";
import "./BookRoom.scss";
import filledBedImage from "../../../assets/icons/filledBedImage.jpeg";
import emptyBedImage from "../../../assets/icons/emptyBedImage.jpeg";
import hoverImage from "../../../assets/icons/hoverImage.jpeg";
import selectedImage from "../../../assets/icons/selectedImage.jpeg";
import { fetchRooms } from "../../../../services/src/services/roomService";
import { useLocation } from 'react-router-dom';

// Add these new components at the top of the file
const AllocatedGuestsTable = ({ guests }) => {
  // Filter out guests that don't have a room number
  const allocatedGuests = guests?.filter(guest => guest.roomNo && guest.roomNo !== "-") || [];

  return (
    <div className="guests-table">
      <h3>Allocated Guests</h3>
      {allocatedGuests.length > 0 ? (
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
      ) : (
        <div className="no-guests-message">No guests allocated</div>
      )}
    </div>
  );
};

const NonAllocatedGuestsTable = ({ guests, onSelect, selectedGuests }) => (
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

// Add this new component for availability display
const AvailabilityBox = ({ count }) => (
  <div className="availability-box">
    <div className="count">{count}</div>
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

const BookRoom = () => {
  const location = useLocation();
  const guestData = location.state?.guestData;

  const [activeTab, setActiveTab] = useState("Guest house"); // State for active tab
  const [arrivalDate, setArrivalDate] = useState(""); // State for arrival date
  const [departureDate, setDepartureDate] = useState(""); // State for departure date
  const [dates, setDates] = useState([]); // State for storing the date range
  const [sortType, setSortType] = useState(""); // State to store the selected room type
  const [clickedBeds, setClickedBeds] = useState({});
  const [hoveredBeds, setHoveredBeds] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRight, setIsLoadingRight] = useState(false);
  const [isLoadingLeft, setIsLoadingLeft] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [roomsData, setRoomsData] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);

  useEffect(() => {
    if (guestData) {
      console.log("Received guest data:", guestData);
      
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

  const handleBedClick = (bedId) => {
    if (!arrivalDate || !departureDate) {
      alert("Please select valid arrival and departure dates");
      return;
    }

    const [roomIndex, dateIndex, bedIndex] = bedId.split('-').map(Number);

    // Convert arrival and departure dates to Date objects
    const arrivalDateTime = new Date(arrivalDate);
    arrivalDateTime.setUTCHours(0, 0, 0, 0);
    
    const departureDateTime = new Date(departureDate);
    departureDateTime.setUTCHours(0, 0, 0, 0);

    // Create new clicked beds state
    const newClickedBeds = { ...clickedBeds };
    
    // Clear any existing selections for this bed number
    Object.keys(newClickedBeds).forEach(key => {
      const [existingRoom, , existingBed] = key.split('-').map(Number);
      if (existingRoom === roomIndex && existingBed === bedIndex) {
        delete newClickedBeds[key];
      }
    });

    // Select beds only for the dates within the range
    dates.forEach((dateStr, index) => {
      const currentDate = new Date(dateStr);
      currentDate.setUTCHours(0, 0, 0, 0);
      
      // Check if current date is within the selected range
      if (currentDate >= arrivalDateTime && currentDate <= departureDateTime) {
        const currentBedId = `${roomIndex}-${index}-${bedIndex}`;
        newClickedBeds[currentBedId] = true;
      }
    });

    // Log for debugging
    console.log('Date Selection:', {
      dates: dates.map(d => new Date(d).toISOString()),
      arrival: arrivalDateTime.toISOString(),
      departure: departureDateTime.toISOString(),
      selectedBeds: Object.keys(newClickedBeds)
    });

    setClickedBeds(newClickedBeds);
  };

  const getBeds = (beds, roomIndex, dateIndex) => {
    return (
      <div className={`bed-grid beds-${beds.length}`}>
        {beds.map((status, bedIndex) => {
          const bedId = `${roomIndex}-${dateIndex}-${bedIndex}`; // Unique identifier for each bed
          const isClicked = clickedBeds[bedId]; // Check if clicked
          const isHovered = hoveredBeds[bedId]; // Check if hovered
          const isEmptyBed = status === "empty"; // Only apply hover and click on empty beds

          return (
            <div
              key={bedId}
              className={`bed-icon ${status} ${
                isClicked && isEmptyBed ? "clicked" : ""
              }`}
              title={status === "filled" ? "Occupied" : "Available"}
              onClick={() => isEmptyBed && handleBedClick(bedId)} // Allow click only on empty beds
              onMouseEnter={() => isEmptyBed && handleMouseEnter(bedId)} // Handle hover
              onMouseLeave={() => isEmptyBed && handleMouseLeave(bedId)} // Remove hover effect
            >
              <img
                src={
                  isClicked
                    ? selectedImage // Show clicked purple image
                    : isHovered
                    ? hoverImage // Show purple image on hover
                    : status === "filled"
                    ? filledBedImage // Show filled bed image
                    : emptyBedImage // Show empty bed image
                }
                alt="bed"
                className={`bed-img ${
                  isClicked && isEmptyBed ? "clicked-img" : ""
                }`}
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);

    // Generate dates for the next 6 months
    const initialDates = [];
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      initialDates.push(date.toISOString().split('T')[0]);
    }
    setDates(initialDates);
  }, []);

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
        setRoomsData(response.data); // Store the fetched rooms data
        console.log("Fetched rooms data:", response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, []);

  // Update the filteredRooms to use the fetched data
  const filteredRooms = roomsData
    .filter((room) => room.attributes.room_category === activeTab)
    .filter((room) => {
      if (!sortType) return true;
      return room.attributes.room_type === sortType;
    })
    .map((room) => ({
      name: room.attributes.room_number,
      beds: Array(room.attributes.beds).fill(
        room.attributes.status === "available" ? "empty" : "filled"
      ),
      type: room.attributes.room_type,
    }));

  const renderDateGrid = () => {
    return (
      <div className="grid-container" onScroll={handleScroll}>
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
          {filteredRooms.map((room, roomIndex) => (
            <div key={roomIndex} className="grid-row">
              <div className="room-cell">{room.name}</div>
              {dates.map((_, dateIndex) => (
                <div
                  key={dateIndex}
                  className={`grid-cell ${
                    activeTab === "Yatri Niwas" ? "yatri-niwas-cell" : ""
                  }`}
                >
                  {activeTab === "Yatri Niwas" ? (
                    <AvailabilityBox
                      count={room.beds.filter((bed) => bed === "empty").length}
                    />
                  ) : (
                    <div className={`bed-grid beds-${room.beds.length}`}>
                      {room.beds.map((status, bedIndex) => {
                        const bedId = `${roomIndex}-${dateIndex}-${bedIndex}`;
                        const isClicked = clickedBeds[bedId];
                        
                        return (
                          <div
                            key={bedIndex}
                            className={`bed-icon ${status}`}
                            title={status === "filled" ? "Occupied" : "Available"}
                            onClick={() => handleBedClick(bedId)}
                          >
                            <img
                              src={isClicked ? selectedImage : emptyBedImage}
                              alt="bed"
                              className="bed-img"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
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

          <div className="booking-filter-control">
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
        </div>

        <div className="booking-date-panel">
          <div className="date-wrapper">
            <input
              type="date"
              id="arrival-date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
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
              onChange={(e) => setDepartureDate(e.target.value)}
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
        {guestData && (
          <div className="guests-panel">
            <AllocatedGuestsTable 
              guests={[
                { 
                  name: guestData?.guestDetails?.name, 
                  age: guestData?.guestDetails?.age,
                  gender: guestData?.guestDetails?.gender,
                  relation: "Self",
                  roomNo: "-" 
                },
                ...(guestData?.additionalGuests || []).map(guest => ({
                  ...guest,
                  roomNo: "-"
                }))
              ].filter(guest => guest.roomNo)} 
            />
            <NonAllocatedGuestsTable 
              guests={guestData?.additionalGuests || []}
              selectedGuests={selectedGuests}
              onSelect={(index) => {
                setSelectedGuests(prev => {
                  const newSelected = [...prev];
                  newSelected[index] = !newSelected[index];
                  return newSelected;
                });
              }}
            />
            <button 
              className="allocate-button"
              onClick={() => {/* Handle allocation */}}
            >
              Allocate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRoom;
