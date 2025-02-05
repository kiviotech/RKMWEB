import React from "react";

const BookRoom = () => {
  return (
    <div className="booking-form-container">
      <div className="booking-input-group">
        <label>Guest Name</label>
        <input type="text" placeholder="Enter the Full Name" />
      </div>

      <div className="booking-input-group">
        <label>Phone Number</label>
        <input type="tel" placeholder="Enter phone number" />
      </div>

      <div className="booking-input-group">
        <label>Room Number</label>
        <select defaultValue="">
          <option value="" disabled>
            Select the room number
          </option>
        </select>
      </div>

      <div className="booking-input-group">
        <label>Booking type</label>
        <select defaultValue="">
          <option value="" disabled>
            Select the booking type
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

      <button className="booking-submit-btn">Book Room</button>
    </div>
  );
};

export default BookRoom;
