import React, { useEffect, useState, useRef } from "react";
import "./BookRoomManagementBed.scss";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";
import { useNavigate } from "react-router-dom";

const BookRoomManagementBed = ({ blockId, refreshTrigger, viewMode }) => {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Generate dates for the entire year
  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      const currentDate = new Date();
      // Generate dates for next 365 days
      for (let i = 0; i < 365; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        datesArray.push({
          day: date.getDate(),
          month: date.toLocaleString("default", { month: "short" }),
          year: date.getFullYear(),
        });
      }
      setDates(datesArray);
    };

    generateDates();
  }, []);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (blockId) {
        try {
          setIsLoading(true);
          const blockData = await blockService.fetchBlockById(blockId);
          const roomsData = blockData.data.attributes.rooms.data;
          // console.log("Block Data:", blockData);
          // console.log("Rooms Data:", roomsData);
          setRooms(roomsData);
        } catch (error) {
          console.error("Error fetching block details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlockDetails();
  }, [blockId, refreshTrigger]);

  const handleBedManagementClick = (allocation) => {
    if (allocation) {
      // Get the booking request ID from the first guest's booking request
      const bookingRequestId =
        allocation.attributes.guests.data[0]?.attributes?.booking_request?.data
          ?.id;
      console.log("Booking Request ID:", allocation);
      if (bookingRequestId) {
        navigate("/requests", {
          state: {
            activeTab: "confirmed",
            openGuestDetails: true,
            requestId: bookingRequestId,
          },
        });
      } else {
        console.warn("No booking request ID found for this allocation");
      }
    }
  };

  const renderBeds = (
    numberOfBeds,
    roomBlockings,
    roomAllocations,
    currentDate
  ) => {
    const beds = [];

    // Get tooltip content based on allocations and blockings
    const tooltipContent = getTooltipContent(
      roomBlockings,
      roomAllocations,
      currentDate,
      handleBedManagementClick
    );

    // Check both blockings and allocations
    const isBlocked = roomBlockings?.some((blocking) => {
      const fromDate = new Date(blocking.attributes.from_date);
      const toDate = new Date(blocking.attributes.to_date);
      const checkDate = new Date(
        currentDate.year,
        new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
        currentDate.day,
        0,
        0,
        0
      );
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    // Check allocations and count occupied beds
    const occupiedBeds =
      roomAllocations?.data?.reduce((count, allocation) => {
        const fromDate = new Date(
          allocation.attributes.guests.data[0].attributes.arrival_date
        );
        const toDate = new Date(
          allocation.attributes.guests.data[0].attributes.departure_date
        );
        const checkDate = new Date(
          currentDate.year,
          new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
          currentDate.day,
          0,
          0,
          0
        );
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (checkDate >= fromDate && checkDate <= toDate) {
          return count + allocation.attributes.guests.data.length;
        }
        return count;
      }, 0) || 0;

    // Helper function to get bed icon based on allocation status and recommendation letter
    const getBedIcon = (bedIndex) => {
      if (isBlocked) {
        // Check blocking status and return appropriate icon
        const blocking = roomBlockings?.find((blocking) => {
          const fromDate = new Date(blocking.attributes.from_date);
          const toDate = new Date(blocking.attributes.to_date);
          const checkDate = new Date(
            currentDate.year,
            new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
            currentDate.day,
            0,
            0,
            0
          );
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(0, 0, 0, 0);
          return checkDate >= fromDate && checkDate <= toDate;
        });

        if (blocking) {
          switch (blocking.attributes.room_block_status) {
            case "blocked":
              return icons.Group_4;
            case "maintenance":
              return icons.Group_3;
            case "reserved":
              return icons.Group_5;
            default:
              return icons.filledBed;
          }
        }
        return icons.filledBed;
      }

      const allocation = roomAllocations?.data?.find((allocation) => {
        const fromDate = new Date(
          allocation.attributes.guests.data[0].attributes.arrival_date
        );
        const toDate = new Date(
          allocation.attributes.guests.data[0].attributes.departure_date
        );
        const checkDate = new Date(
          currentDate.year,
          new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
          currentDate.day,
          0,
          0,
          0
        );
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        return checkDate >= fromDate && checkDate <= toDate;
      });

      if (allocation && bedIndex < allocation.attributes.guests.data.length) {
        const guest = allocation.attributes.guests.data[bedIndex];
        const hasRecommendationLetter =
          guest?.attributes?.booking_request?.data?.attributes
            ?.recommendation_letter?.data;
        return hasRecommendationLetter ? icons.Group_2 : icons.Group_1;
      }

      return icons.Group2;
    };

    if (numberOfBeds > 4) {
      beds.push(
        <div
          key="bed-count-layout"
          className="bed-count-layout"
          data-tooltip={tooltipContent ? "true" : undefined}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className="bed-count-box">
            <span className="bed-number">{numberOfBeds}</span>
            <span className="bed-status">
              {isBlocked
                ? "Blocked"
                : occupiedBeds > 0
                ? "Occupied"
                : "Available"}
            </span>
          </div>
        </div>
      );
    } else if (numberOfBeds === 3) {
      beds.push(
        <div
          key="three-bed-layout"
          className="three-bed-layout"
          data-tooltip={tooltipContent ? "true" : undefined}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className="top-row">
            <img src={getBedIcon(0)} alt="bed" className="bed-icon" />
            <img src={getBedIcon(1)} alt="bed" className="bed-icon" />
          </div>
          <div className="bottom-row">
            <img src={getBedIcon(2)} alt="bed" className="bed-icon" />
          </div>
        </div>
      );
    } else {
      const fullGroups = Math.floor(numberOfBeds / 2);
      const remainingBeds = numberOfBeds % 2;

      const bedGroups = [];
      for (let i = 0; i < fullGroups; i++) {
        bedGroups.push(
          <div key={`group-${i}`} className="bed-group">
            <img src={getBedIcon(i * 2)} alt="bed" className="bed-icon" />
            <img src={getBedIcon(i * 2 + 1)} alt="bed" className="bed-icon" />
          </div>
        );
      }

      if (remainingBeds > 0) {
        bedGroups.push(
          <div key="remaining" className="bed-group">
            <img
              src={getBedIcon(fullGroups * 2)}
              alt="bed"
              className="bed-icon"
            />
          </div>
        );
      }

      beds.push(
        <div
          key="bed-layout"
          className="bed-layout"
          data-tooltip={tooltipContent ? "true" : undefined}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          {bedGroups}
        </div>
      );
    }

    return beds;
  };

  // Helper function to add ordinal suffix to dates
  const getOrdinalSuffix = (day) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = day % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  // Add helper function to calculate available beds
  const getAvailableBedsForDate = (room, date) => {
    const totalBeds = room.attributes.no_of_beds;
    const allocations = room.attributes.room_allocations?.data || [];
    const blockings = room.attributes.room_blockings?.data || [];

    // Check if room is blocked
    const isBlocked = blockings.some((blocking) => {
      const fromDate = new Date(blocking.attributes.from_date);
      const toDate = new Date(blocking.attributes.to_date);
      const checkDate = new Date(
        date.year,
        new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
        date.day,
        0,
        0,
        0
      );
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      return checkDate >= fromDate && checkDate <= toDate;
    });

    if (isBlocked) return 0;

    // Calculate occupied beds from allocations
    const occupiedBeds = allocations.reduce((count, allocation) => {
      const guests = allocation.attributes.guests.data;
      if (!guests || guests.length === 0) return count;

      const fromDate = new Date(guests[0].attributes.arrival_date);
      const toDate = new Date(guests[0].attributes.departure_date);
      const checkDate = new Date(
        date.year,
        new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
        date.day,
        0,
        0,
        0
      );

      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      if (checkDate >= fromDate && checkDate <= toDate) {
        return count + guests.length; // Count all guests in the allocation
      }
      return count;
    }, 0);

    const availableBeds = totalBeds - occupiedBeds;
    return Math.max(0, availableBeds); // Ensure we don't return negative numbers
  };

  const renderListView = () => {
    return (
      <div className="list-view-container">
        <div className="room-numbers-column">
          <div className="list-header fixed-column">Room No.</div>
          {rooms.map((room) => (
            <div key={room.id} className="room-info">
              <div className="room-number">
                {room.attributes.room_number}
                <span className="capacity">({room.attributes.no_of_beds})</span>
              </div>
            </div>
          ))}
        </div>

        <div className="scrollable-content" ref={scrollContainerRef}>
          <div className="header-row">
            <div className="scrollable-dates">
              {dates.map((date, index) => (
                <div key={index} className="date-column">
                  <div className="year">{date.year}</div>
                  <div>{`${date.day} ${date.month}`}</div>
                </div>
              ))}
            </div>
          </div>

          {rooms.map((room) => (
            <div key={room.id} className="list-row">
              {dates.map((date, index) => {
                const availableBeds = getAvailableBedsForDate(room, date);
                const tooltipContent = getTooltipContent(
                  room.attributes.room_blockings?.data,
                  room.attributes.room_allocations,
                  date
                );

                // Check for room blocking status
                const blocking = room.attributes.room_blockings?.data?.find(
                  (blocking) => {
                    const fromDate = new Date(blocking.attributes.from_date);
                    const toDate = new Date(blocking.attributes.to_date);
                    const checkDate = new Date(
                      date.year,
                      new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
                      date.day,
                      0,
                      0,
                      0
                    );

                    fromDate.setHours(0, 0, 0, 0);
                    toDate.setHours(0, 0, 0, 0);

                    return checkDate >= fromDate && checkDate <= toDate;
                  }
                );

                // Check for guest allocation and recommendation letter
                const allocation = room.attributes.room_allocations?.data?.find(
                  (allocation) => {
                    const fromDate = new Date(
                      allocation.attributes.guests.data[0].attributes.arrival_date
                    );
                    const toDate = new Date(
                      allocation.attributes.guests.data[0].attributes.departure_date
                    );
                    const checkDate = new Date(
                      date.year,
                      new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
                      date.day,
                      0,
                      0,
                      0
                    );

                    fromDate.setHours(0, 0, 0, 0);
                    toDate.setHours(0, 0, 0, 0);

                    return checkDate >= fromDate && checkDate <= toDate;
                  }
                );

                const hasRecommendationLetter =
                  allocation?.attributes.guests.data[0]?.attributes
                    ?.booking_request?.data?.attributes?.recommendation_letter
                    ?.data;

                // Determine background color based on conditions
                let backgroundColor = "inherit";

                if (blocking) {
                  switch (blocking.attributes.room_block_status) {
                    case "maintenance":
                      backgroundColor = "#666666";
                      break;
                    case "blocked":
                      backgroundColor = "#FFFF00";
                      break;
                    case "reserved":
                      backgroundColor = "#00b050";
                      break;
                  }
                } else if (allocation) {
                  backgroundColor = hasRecommendationLetter
                    ? "#FF6D01"
                    : "#F28E86";
                }

                return (
                  <div
                    key={index}
                    className="availability-box"
                    data-tooltip={tooltipContent ? "true" : undefined}
                    style={{ backgroundColor }}
                  >
                    <div className="bed-count">{availableBeds}</div>
                    <div className="availability-label">Available</div>
                    {tooltipContent && (
                      <div className="custom-tooltip">{tooltipContent}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bed-management-container">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : viewMode === "dashboard" ? (
        renderListView()
      ) : (
        <div className="bed-grid">
          <div className="room-numbers-column">
            <div className="room-header fixed-column"></div>
            {rooms.map((room) => (
              <div key={room.id} className="room-number">
                {room.attributes.room_number}
              </div>
            ))}
          </div>

          <div className="scrollable-content" ref={scrollContainerRef}>
            <div className="header-row">
              <div className="scrollable-dates">
                {dates.map((date, index) => (
                  <div key={index} className="date-header">
                    <div className="year">{date.year}</div>
                    <div>{`${date.day} ${date.month}`}</div>
                  </div>
                ))}
              </div>
            </div>

            {rooms.map((room) => (
              <div key={room.id} className="room-row">
                <div className="scrollable-beds">
                  {dates.map((date, dateIndex) => (
                    <div key={dateIndex} className="bed-cell">
                      {renderBeds(
                        room.attributes.no_of_beds,
                        room.attributes.room_blockings?.data,
                        room.attributes.room_allocations,
                        date
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Update the getTooltipContent function signature to accept the handler
const getTooltipContent = (
  roomBlockings,
  roomAllocations,
  currentDate,
  onBedManagementClick
) => {
  // Check for allocations first
  const allocation = roomAllocations?.data?.find((allocation) => {
    const fromDate = new Date(
      allocation.attributes.guests.data[0].attributes.arrival_date
    );
    const toDate = new Date(
      allocation.attributes.guests.data[0].attributes.departure_date
    );
    const checkDate = new Date(
      currentDate.year,
      new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
      currentDate.day
    );
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= fromDate && checkDate <= toDate;
  });

  if (allocation) {
    const guests = allocation.attributes.guests.data;
    return (
      <div
        className="tooltip-content"
        onClick={() => onBedManagementClick(allocation)}
        style={{ cursor: "pointer" }}
      >
        <h4>Room Allocation Details:</h4>
        {guests.map((guest, index) => (
          <div key={index} className="guest-details">
            <p>
              <strong>Guest {index + 1}:</strong>
            </p>
            <p>Name: {guest.attributes.name}</p>
            <p>From: {guest.attributes.arrival_date}</p>
            <p>To: {guest.attributes.departure_date}</p>
            <p>Phone: {guest.attributes.phone_number}</p>
          </div>
        ))}
      </div>
    );
  }

  // Check for blockings if no allocation
  const blocking = roomBlockings?.find((blocking) => {
    const fromDate = new Date(blocking.attributes.from_date);
    const toDate = new Date(blocking.attributes.to_date);
    const checkDate = new Date(
      currentDate.year,
      new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
      currentDate.day
    );
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= fromDate && checkDate <= toDate;
  });

  if (blocking) {
    return (
      <div className="tooltip-content">
        <h4>Room Blocking Details:</h4>
        <p>
          <strong>Status:</strong> {blocking.attributes.room_block_status}
        </p>
        <p>
          <strong>From:</strong> {blocking.attributes.from_date}
        </p>
        <p>
          <strong>To:</strong> {blocking.attributes.to_date}
        </p>
        <p>
          <strong>Reason:</strong> {blocking.attributes.reason_for_blocking}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(blocking.attributes.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(blocking.attributes.updatedAt).toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

export default BookRoomManagementBed;
