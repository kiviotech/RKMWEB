import React, { useEffect, useState, useRef } from "react";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";
import { useNavigate } from "react-router-dom";
import "./BookRoomBed.scss";

const BookRoomBed = ({
  blockId,
  selectedDateRange,
  numberOfBedsToAllocate,
  refreshTrigger,
  onRoomAllocation,
  arrivalDate,
  departureDate,
  viewMode,
}) => {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [allocatedRoomNumber, setAllocatedRoomNumber] = useState(null);
  const [allocatedRooms, setAllocatedRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      if (!arrivalDate) return;

      const startDate = new Date(arrivalDate);
      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        datesArray.push({
          day: date.getDate(),
          month: date.toLocaleString("default", { month: "short" }),
          year: date.getFullYear(),
        });
      }
      setDates(datesArray);
    };

    generateDates();
  }, [arrivalDate]);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (blockId) {
        try {
          setIsLoading(true);
          const blockData = await blockService.fetchBlockById(blockId);
          const roomsData = blockData.data.attributes.rooms.data;
          console.log("Rooms Data:", roomsData);
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

  const handleBedClick = (allocation) => {
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

  const getTooltipContent = (roomBlockings, roomAllocations, currentDate) => {
    const allocation = roomAllocations?.data?.find((allocation) => {
      console.log("Allocation:", roomAllocations);
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
          onClick={() => handleBedClick(allocation)}
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

  const renderBeds = (
    numberOfBeds,
    roomBlockings,
    roomAllocations,
    currentDate,
    room
  ) => {
    const beds = [];

    // Check blockings
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

    // Get number of allocated beds for current date
    const allocatedBedsCount =
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
          // Count the number of guests in this allocation
          return count + allocation.attributes.guests.data.length;
        }
        return count;
      }, 0) || 0;

    const isSelected =
      selectedDateRange &&
      (() => {
        // Create date strings for comparison
        const checkDateStr = `${currentDate.year}-${String(
          new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.day).padStart(2, "0")}`;

        // Use the exact date strings from selectedDateRange
        return (
          checkDateStr >= selectedDateRange.arrivalDate &&
          checkDateStr <= selectedDateRange.departureDate
        );
      })();

    const tooltipContent = getTooltipContent(
      roomBlockings,
      roomAllocations,
      currentDate
    );

    // Modify renderBedIcon to handle allocated beds count
    const renderBedIcon = (bedIndex) => {
      if (isSelected && isFirstAvailableRoom(room, currentDate)) {
        const roomAllocation = allocatedRooms.find(
          (allocation) => allocation.roomNumber === room.attributes.room_number
        );
        if (roomAllocation && bedIndex < roomAllocation.bedsAllocated) {
          return icons.selectedImage;
        }
      }

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
              return icons.Group_7;
            case "cleaning":
              return icons.Group_3;
            default:
              return icons.filledBed;
          }
        }
        return icons.filledBed;
      } else if (bedIndex < allocatedBedsCount) {
        // Check if there's an allocation with recommendation letter
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

        if (allocation) {
          const guest = allocation.attributes.guests.data[bedIndex];
          const hasRecommendationLetter =
            guest?.attributes?.booking_request?.data?.attributes
              ?.recommendation_letter?.data;
          return hasRecommendationLetter ? icons.Group_2 : icons.Group_1;
        }
        return icons.Group_1;
      } else {
        return icons.Group2;
      }
    };

    if (numberOfBeds > 4) {
      beds.push(
        <div
          key="bed-count-layout"
          className="bed-count-layout"
          title={tooltipContent ? "" : undefined}
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
                : allocatedBedsCount > 0
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
          title={tooltipContent ? "" : undefined}
          data-tooltip={tooltipContent ? "true" : undefined}
        >
          {tooltipContent && (
            <div className="custom-tooltip">{tooltipContent}</div>
          )}
          <div className="top-row">
            <img src={renderBedIcon(0)} alt="bed" className="bed-icon" />
            <img src={renderBedIcon(1)} alt="bed" className="bed-icon" />
          </div>
          <div className="bottom-row">
            <img src={renderBedIcon(2)} alt="bed" className="bed-icon" />
          </div>
        </div>
      );
    } else {
      // For other bed configurations
      const fullGroups = Math.floor(numberOfBeds / 2);
      const remainingBeds = numberOfBeds % 2;
      let bedCount = 0;

      const bedGroups = [];
      for (let i = 0; i < fullGroups; i++) {
        bedGroups.push(
          <div key={`group-${i}`} className="bed-group">
            <img
              src={renderBedIcon(bedCount++)}
              alt="bed"
              className="bed-icon"
            />
            <img
              src={renderBedIcon(bedCount++)}
              alt="bed"
              className="bed-icon"
            />
          </div>
        );
      }

      if (remainingBeds > 0) {
        bedGroups.push(
          <div key="remaining" className="bed-group">
            <img src={renderBedIcon(bedCount)} alt="bed" className="bed-icon" />
          </div>
        );
      }

      beds.push(
        <div
          key="bed-layout"
          className="bed-layout"
          title={tooltipContent ? "" : undefined}
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

  // Update findFirstAvailableRoom to handle multiple room allocations
  useEffect(() => {
    if (selectedDateRange && numberOfBedsToAllocate > 0) {
      const result = findFirstAvailableRoom();

      if (result && onRoomAllocation) {
        setAllocatedRooms(result);
        onRoomAllocation(result); // Pass the array of all allocated rooms
      } else {
        setAllocatedRooms([]);
      }
    }
  }, [selectedDateRange, numberOfBedsToAllocate, rooms]);

  const findFirstAvailableRoom = () => {
    if (
      !selectedDateRange ||
      !selectedDateRange.arrivalDate ||
      !selectedDateRange.departureDate
    ) {
      return null;
    }

    let remainingBedsNeeded = numberOfBedsToAllocate;
    let allocatedRoomsResult = [];

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];

      // First check if room has any allocations
      const existingAllocations = room.attributes.room_allocations?.data || [];

      let hasConflict = false;

      if (existingAllocations.length > 0) {
        for (const allocation of existingAllocations) {
          const guests = allocation.attributes.guests.data;
          if (!guests || guests.length === 0) continue;

          const existingArrival = guests[0].attributes.arrival_date;
          const existingDeparture = guests[0].attributes.departure_date;

          const hasOverlap =
            selectedDateRange.arrivalDate <= existingDeparture &&
            selectedDateRange.departureDate >= existingArrival;

          if (hasOverlap) {
            hasConflict = true;
            break;
          }
        }

        if (hasConflict) {
          continue;
        }
      }

      // Check for room blockings
      const roomBlockings = room.attributes.room_blockings?.data || [];
      const isBlocked = roomBlockings.some((blocking) => {
        const blockStart = blocking.attributes.from_date;
        const blockEnd = blocking.attributes.to_date;
        return (
          selectedDateRange.arrivalDate <= blockEnd &&
          selectedDateRange.departureDate >= blockStart
        );
      });

      if (isBlocked) {
        continue;
      }

      // Check room capacity
      const availableBeds = room.attributes.no_of_beds;

      if (availableBeds > 0) {
        const bedsToAllocate = Math.min(availableBeds, remainingBedsNeeded);
        allocatedRoomsResult.push({
          roomNumber: room.attributes.room_number,
          roomId: room.id,
          bedsAllocated: bedsToAllocate,
        });

        remainingBedsNeeded -= bedsToAllocate;

        if (remainingBedsNeeded <= 0) {
          break;
        }
      }
    }

    if (allocatedRoomsResult.length > 0) {
      return allocatedRoomsResult; // Return the array of all allocated rooms
    }

    return null;
  };

  // Update isFirstAvailableRoom to check against all allocated rooms
  const isFirstAvailableRoom = (room, date) => {
    if (!selectedDateRange || !allocatedRooms.length) return false;
    return allocatedRooms.some(
      (allocated) => allocated.roomNumber === room.attributes.room_number
    );
  };

  const renderListView = () => {
    return (
      <div className="list-view-container">
        <div className="list-header">
          <div className="room-column">Room No.</div>
          {dates.slice(0, 5).map((date, index) => (
            <div key={index} className="date-column">
              {`${date.day}${getOrdinalSuffix(date.day)} ${date.month}`}
            </div>
          ))}
        </div>

        {rooms.map((room) => (
          <div key={room.id} className="list-row">
            <div className="room-info">
              <div className="room-number">
                {room.attributes.room_number}
                <span className="capacity">({room.attributes.no_of_beds})</span>
              </div>
            </div>

            {dates.slice(0, 5).map((date, index) => {
              const availableBeds = getAvailableBedsForDate(room, date);
              const tooltipContent = getTooltipContent(
                room.attributes.room_blockings?.data,
                room.attributes.room_allocations,
                date
              );

              return (
                <div
                  key={index}
                  className="availability-box"
                  data-tooltip={tooltipContent ? "true" : undefined}
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
    );
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

    // Create a proper Date object for comparison
    const checkDate = new Date(
      date.year,
      new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
      date.day,
      0,
      0,
      0
    );

    // Check if room is blocked
    const isBlocked = blockings.some((blocking) => {
      const fromDate = new Date(blocking.attributes.from_date);
      const toDate = new Date(blocking.attributes.to_date);
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
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      if (checkDate >= fromDate && checkDate <= toDate) {
        return count + guests.length;
      }
      return count;
    }, 0);

    return totalBeds - occupiedBeds;
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

            {rooms.map((room, roomIndex) => (
              <div key={room.id} className="room-row">
                <div className="scrollable-beds">
                  {dates.map((date, dateIndex) => (
                    <div key={dateIndex} className="bed-cell">
                      {renderBeds(
                        room.attributes.no_of_beds,
                        room.attributes.room_blockings?.data,
                        room.attributes.room_allocations,
                        date,
                        room
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

export default BookRoomBed;
