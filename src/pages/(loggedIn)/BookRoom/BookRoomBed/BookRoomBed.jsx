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
    isFirstAvailableRoom
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
        const checkDate = new Date(
          currentDate.year,
          new Date(Date.parse(`01 ${currentDate.month} 2000`)).getMonth(),
          currentDate.day
        );
        const arrivalDate = new Date(selectedDateRange.arrivalDate);
        const departureDate = new Date(selectedDateRange.departureDate);

        return checkDate >= arrivalDate && checkDate <= departureDate;
      })();

    const tooltipContent = getTooltipContent(
      roomBlockings,
      roomAllocations,
      currentDate
    );

    // Modify renderBedIcon to handle allocated beds count
    const renderBedIcon = (bedIndex) => {
      if (
        isSelected &&
        isFirstAvailableRoom &&
        bedIndex < numberOfBedsToAllocate
      ) {
        return icons.selectedImage;
      } else if (isBlocked) {
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

  // Find the first available room for the selected date range
  const isFirstAvailableRoom = (roomIndex, date) => {
    if (!selectedDateRange) return false;

    // Check all previous rooms to see if they're available
    for (let i = 0; i < roomIndex; i++) {
      const previousRoom = rooms[i];
      const isBlocked = previousRoom.attributes.room_blockings?.data?.some(
        (blocking) => {
          const fromDate = new Date(blocking.attributes.from_date);
          const toDate = new Date(blocking.attributes.to_date);
          const checkDate = new Date(
            date.year,
            new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
            date.day
          );

          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(0, 0, 0, 0);

          return checkDate >= fromDate && checkDate <= toDate;
        }
      );

      // If we find an available previous room, this is not the first available
      if (!isBlocked) return false;
    }

    // If we get here, this is the first available room
    return true;
  };

  // Update this function to return both room number and ID
  const findFirstAvailableRoom = (date) => {
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const isBlocked = room.attributes.room_blockings?.data?.some(
        (blocking) => {
          const fromDate = new Date(blocking.attributes.from_date);
          const toDate = new Date(blocking.attributes.to_date);
          const checkDate = new Date(
            date.year,
            new Date(Date.parse(`01 ${date.month} 2000`)).getMonth(),
            date.day
          );

          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(0, 0, 0, 0);

          return checkDate >= fromDate && checkDate <= toDate;
        }
      );

      if (!isBlocked) {
        return {
          roomNumber: room.attributes.room_number,
          roomId: room.id,
        };
      }
    }
    return null;
  };

  // Update the useEffect to handle both room number and ID
  useEffect(() => {
    if (selectedDateRange && numberOfBedsToAllocate > 0) {
      const arrivalDate = new Date(selectedDateRange.arrivalDate);
      const room = findFirstAvailableRoom({
        year: arrivalDate.getFullYear(),
        month: arrivalDate.toLocaleString("default", { month: "short" }),
        day: arrivalDate.getDate(),
      });

      if (room && onRoomAllocation) {
        onRoomAllocation(room.roomNumber, room.roomId);
      }
    }
  }, [selectedDateRange, numberOfBedsToAllocate]);

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
                        isFirstAvailableRoom(roomIndex, date)
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
