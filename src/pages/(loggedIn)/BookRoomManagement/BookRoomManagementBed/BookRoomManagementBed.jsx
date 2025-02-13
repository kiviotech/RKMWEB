import React, { useEffect, useState, useRef } from "react";
import "./BookRoomManagementBed.scss";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";

const BookRoomManagementBed = ({ blockId, refreshTrigger }) => {
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

  const renderBeds = (
    numberOfBeds,
    roomBlockings,
    roomAllocations,
    currentDate
  ) => {
    const beds = [];

    // Get tooltip content based on allocations and blockings
    const getTooltipContent = () => {
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
              <strong>Last Updated:</strong>{" "}
              {new Date(blocking.attributes.updatedAt).toLocaleString()}
            </p>
          </div>
        );
      }

      return null;
    };

    const tooltipContent = getTooltipContent();

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
            <img
              src={
                isBlocked || occupiedBeds >= 1 ? icons.filledBed : icons.Group2
              }
              alt="bed"
              className="bed-icon"
            />
            <img
              src={
                isBlocked || occupiedBeds >= 2 ? icons.filledBed : icons.Group2
              }
              alt="bed"
              className="bed-icon"
            />
          </div>
          <div className="bottom-row">
            <img
              src={
                isBlocked || occupiedBeds >= 3 ? icons.filledBed : icons.Group2
              }
              alt="bed"
              className="bed-icon"
            />
          </div>
        </div>
      );
    } else {
      const fullGroups = Math.floor(numberOfBeds / 2);
      const remainingBeds = numberOfBeds % 2;

      for (let i = 0; i < fullGroups; i++) {
        beds.push(
          <div key={`group-${i}`} className="bed-group">
            <img
              src={
                isBlocked || occupiedBeds > i * 2
                  ? icons.filledBed
                  : icons.Group2
              }
              alt="bed"
              className="bed-icon"
            />
            <img
              src={
                isBlocked || occupiedBeds > i * 2 + 1
                  ? icons.filledBed
                  : icons.Group2
              }
              alt="bed"
              className="bed-icon"
            />
          </div>
        );
      }

      if (remainingBeds > 0) {
        beds.push(
          <div key="remaining" className="bed-group">
            <img
              src={
                isBlocked || occupiedBeds > fullGroups * 2
                  ? icons.filledBed
                  : icons.Group2
              }
              alt="bed"
              className="bed-icon"
            />
          </div>
        );
      }
    }

    return beds;
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

export default BookRoomManagementBed;
