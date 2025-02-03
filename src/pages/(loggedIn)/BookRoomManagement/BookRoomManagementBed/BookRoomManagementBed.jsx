import React from "react";
import "./BookRoomManagementBed.scss";
import { BiBed } from "react-icons/bi";
import { icons } from "../../../../constants";

const BookRoomManagementBed = () => {
  const dates = ["21st Nov", "22nd Nov", "23rd Nov", "24th Nov", "25th Nov"];
  const rooms = ["GH-22", "GH-23", "GH-24", "GH-25", "GH-26", "GH-27"];

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

        {rooms.map((room, roomIndex) => (
          <div key={roomIndex} className="room-row">
            <div className="room-number">{room}</div>
            {dates.map((_, dateIndex) => (
              <div key={dateIndex} className="bed-cell">
                <div className="bed-group">
                  <img src={icons.Group2} alt="bed" className="bed-icon" />
                  <img src={icons.Group2} alt="bed" className="bed-icon" />
                </div>
                <div className="bed-group">
                  <img src={icons.Group2} alt="bed" className="bed-icon" />
                  <img src={icons.Group2} alt="bed" className="bed-icon" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookRoomManagementBed;
