import React from "react";
import "./BookRoomManagement.scss";

const BookRoomManagementSetting = () => {
  return (
    <div className="book-room-container">
      <button className="add-block-btn">Add Block</button>

      <div className="room-form">
        <div className="tab-buttons">
          <button className="tab-btn active">Block Room</button>
          <button className="tab-btn">Book Room</button>
        </div>

        <div className="form-group">
          <label>Room Number</label>
          <select defaultValue="">
            <option value="" disabled>
              Select Room
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Reason</label>
          <select defaultValue="">
            <option value="" disabled>
              Select reason
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>From Date</label>
          <input type="date" placeholder="dd-mm-yyyy" />
        </div>

        <div className="form-group">
          <label>Departure Date</label>
          <input type="date" placeholder="dd-mm-yyyy" />
        </div>

        <button className="block-room-btn">Block Room</button>
      </div>
    </div>
  );
};

export default BookRoomManagementSetting;
