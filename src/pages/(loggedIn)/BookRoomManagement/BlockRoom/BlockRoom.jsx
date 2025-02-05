import React from "react";

const BlockRoom = () => {
  return (
    <div className="booking-form-container">
      <div className="booking-input-group">
        <label>Room Number</label>
        <select defaultValue="">
          <option value="" disabled>
            Select Room
          </option>
        </select>
      </div>

      <div className="booking-input-group">
        <label>Reason</label>
        <select defaultValue="">
          <option value="" disabled>
            Select reason
          </option>
        </select>
      </div>

      <div className="booking-input-group">
        <label>From Date</label>
        <input type="date" placeholder="dd-mm-yyyy" />
      </div>

      <div className="booking-input-group">
        <label>Departure Date</label>
        <input type="date" placeholder="dd-mm-yyyy" />
      </div>

      <button className="booking-submit-btn">Block Room</button>
    </div>
  );
};

export default BlockRoom;
