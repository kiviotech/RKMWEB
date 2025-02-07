import React, { useEffect, useState, useRef } from "react";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";
import "./BookRoomBed.scss";

const BookRoomBed = ({
  blockId,
  selectedDateRange,
  numberOfBedsToAllocate,
  refreshTrigger,
  onRoomAllocation,
}) => {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [allocatedRoomNumber, setAllocatedRoomNumber] = useState(null);
  const [allocatedRooms, setAllocatedRooms] = useState([]);

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

  const getTooltipContent = (roomBlockings, roomAllocations, currentDate) => {
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
        <div className="tooltip-content">
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
        // Find the allocated room info for this room
        const roomAllocation = allocatedRooms.find(
          (allocation) => allocation.roomNumber === room.attributes.room_number
        );

        // Only show selected beds up to the number of beds allocated for this room
        if (roomAllocation && bedIndex < roomAllocation.bedsAllocated) {
          return icons.selectedImage;
        }
      }

      if (isBlocked) {
        return icons.filledBed;
      } else if (bedIndex < allocatedBedsCount) {
        // Show filled bed for each guest
        return icons.filledBed;
      } else {
        return icons.Group2;
      }
    };

    if (numberOfBeds === 3) {
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
        console.log("All allocated rooms:", result);
        setAllocatedRooms(result);
        onRoomAllocation(result); // Pass the array of all allocated rooms
      } else {
        console.log("No suitable rooms found or onRoomAllocation not provided");
        setAllocatedRooms([]);
      }
    }
  }, [selectedDateRange, numberOfBedsToAllocate, rooms]);

  const findFirstAvailableRoom = () => {
    console.log("Finding room for dates:", selectedDateRange);

    if (
      !selectedDateRange ||
      !selectedDateRange.arrivalDate ||
      !selectedDateRange.departureDate
    ) {
      console.log("No date range selected");
      return null;
    }

    console.log(
      "Looking for room between:",
      selectedDateRange.arrivalDate,
      "and",
      selectedDateRange.departureDate
    );

    let remainingBedsNeeded = numberOfBedsToAllocate;
    let allocatedRoomsResult = [];

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      console.log("\n----------------------------------------");
      console.log("Checking room:", room.attributes.room_number);

      // First check if room has any allocations
      const existingAllocations = room.attributes.room_allocations?.data || [];
      console.log("Room allocations found:", existingAllocations);

      let hasConflict = false;

      if (existingAllocations.length > 0) {
        for (const allocation of existingAllocations) {
          const guests = allocation.attributes.guests.data;
          if (!guests || guests.length === 0) continue;

          const existingArrival = guests[0].attributes.arrival_date;
          const existingDeparture = guests[0].attributes.departure_date;

          console.log("\nDate comparison:");
          console.log(
            "New booking period:",
            selectedDateRange.arrivalDate,
            "to",
            selectedDateRange.departureDate
          );
          console.log(
            "Existing booking period:",
            existingArrival,
            "to",
            existingDeparture
          );

          const hasOverlap =
            selectedDateRange.arrivalDate <= existingDeparture &&
            selectedDateRange.departureDate >= existingArrival;

          if (hasOverlap) {
            hasConflict = true;
            break;
          }
        }

        if (hasConflict) {
          console.log("❌ Skipping room due to date conflict");
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
        console.log("❌ Room is blocked, skipping");
        continue;
      }

      // Check room capacity
      const availableBeds = room.attributes.no_of_beds;
      console.log("\nRoom capacity check:");
      console.log("Available beds:", availableBeds);
      console.log("Remaining beds needed:", remainingBedsNeeded);

      if (availableBeds > 0) {
        const bedsToAllocate = Math.min(availableBeds, remainingBedsNeeded);
        allocatedRoomsResult.push({
          roomNumber: room.attributes.room_number,
          roomId: room.id,
          bedsAllocated: bedsToAllocate,
        });

        remainingBedsNeeded -= bedsToAllocate;
        console.log(
          `✅ Allocated ${bedsToAllocate} beds in room ${room.attributes.room_number}`
        );

        if (remainingBedsNeeded <= 0) {
          break;
        }
      }
    }

    if (allocatedRoomsResult.length > 0) {
      return allocatedRoomsResult; // Return the array of all allocated rooms
    }

    console.log("\n❌ No suitable rooms found");
    return null;
  };

  // Update isFirstAvailableRoom to check against all allocated rooms
  const isFirstAvailableRoom = (room, date) => {
    if (!selectedDateRange || !allocatedRooms.length) return false;
    return allocatedRooms.some(
      (allocated) => allocated.roomNumber === room.attributes.room_number
    );
  };

  return (
    <div className="bed-management-container">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
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
