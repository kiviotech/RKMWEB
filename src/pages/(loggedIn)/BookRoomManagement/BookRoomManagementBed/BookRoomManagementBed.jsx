import React, { useEffect, useState, useRef } from "react";
import "./BookRoomManagementBed.scss";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";

const BookRoomManagementBed = ({ blockId, refreshTrigger }) => {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState([]);
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
          const blockData = await blockService.fetchBlockById(blockId);
          const roomsData = blockData.data.attributes.rooms.data;
          setRooms(roomsData);
        } catch (error) {
          console.error("Error fetching block details:", error);
        }
      }
    };

    fetchBlockDetails();
  }, [blockId, refreshTrigger]);

  const renderBeds = (numberOfBeds) => {
    const beds = [];

    if (numberOfBeds === 3) {
      // Special case for 3 beds - L-shaped arrangement
      beds.push(
        <div key="three-bed-layout" className="three-bed-layout">
          <div className="top-row">
            <img src={icons.Group2} alt="bed" className="bed-icon" />
            <img src={icons.Group2} alt="bed" className="bed-icon" />
          </div>
          <div className="bottom-row">
            <img src={icons.Group2} alt="bed" className="bed-icon" />
          </div>
        </div>
      );
    } else {
      // Original logic for other numbers of beds
      const fullGroups = Math.floor(numberOfBeds / 2);
      const remainingBeds = numberOfBeds % 2;

      for (let i = 0; i < fullGroups; i++) {
        beds.push(
          <div key={`group-${i}`} className="bed-group">
            <img src={icons.Group2} alt="bed" className="bed-icon" />
            <img src={icons.Group2} alt="bed" className="bed-icon" />
          </div>
        );
      }

      if (remainingBeds > 0) {
        beds.push(
          <div key="remaining" className="bed-group">
            <img src={icons.Group2} alt="bed" className="bed-icon" />
          </div>
        );
      }
    }

    return beds;
  };

  return (
    <div className="bed-management-container">
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
                {dates.map((_, dateIndex) => (
                  <div key={dateIndex} className="bed-cell">
                    {renderBeds(room.attributes.no_of_beds)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookRoomManagementBed;
