import React, { useEffect, useState } from "react";
import "./BookRoomManagementBed.scss";
import { icons } from "../../../../constants";
import * as blockService from "../../../../../services/src/services/blockService";

const BookRoomManagementBed = ({ blockId }) => {
  const dates = ["21st Nov", "22nd Nov", "23rd Nov", "24th Nov", "25th Nov"];
  const [rooms, setRooms] = useState([]);

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
  }, [blockId]);

  const renderBeds = (numberOfBeds) => {
    const beds = [];
    // Create groups of 2 beds
    const fullGroups = Math.floor(numberOfBeds / 2);
    const remainingBeds = numberOfBeds % 2;

    // Add full groups of 2 beds
    for (let i = 0; i < fullGroups; i++) {
      beds.push(
        <div key={`group-${i}`} className="bed-group">
          <img src={icons.Group2} alt="bed" className="bed-icon" />
          <img src={icons.Group2} alt="bed" className="bed-icon" />
        </div>
      );
    }

    // Add remaining single bed if any
    if (remainingBeds > 0) {
      beds.push(
        <div key="remaining" className="bed-group">
          <img src={icons.Group2} alt="bed" className="bed-icon" />
        </div>
      );
    }

    return beds;
  };

  return (
    <div className="bed-management-container">
      <div className="bed-grid">
        <div className="header-row">
          <div className="room-header"></div>
          {dates.map((date, index) => (
            <div key={index} className="date-header">
              {date}
            </div>
          ))}
        </div>

        {rooms.map((room) => (
          <div key={room.id} className="room-row">
            <div className="room-number">{room.attributes.room_number}</div>
            {dates.map((_, dateIndex) => (
              <div key={dateIndex} className="bed-cell">
                {renderBeds(room.attributes.no_of_beds)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookRoomManagementBed;
