import React from "react";
import "./ManualEntry.scss";

const ManualEntry = ({ onClose }) => {
  return (
    <div className="manual-entry-overlay">
      <div className="manual-entry-modal">
        <div className="modal-header">
          <h3>Manual Entry</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="manual-entry-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="John Doe" />
          </div>

          <div className="form-group">
            <label htmlFor="members">Members</label>
            <input type="number" id="members" placeholder="1" />
          </div>

          <div className="form-group">
            <label htmlFor="coupons">Coupons</label>
            <select id="coupons">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="food-category">Food Category</label>
            <select id="food-category">
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
              <option value="Economy">Economy</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Add Member and Issue Coupon
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualEntry;
