import React from "react";
import "./CheckInForm.scss";

const CheckInForm = () => {
  return (
    <div className="check-in-overlay">
      <div className="check-in-modal">
        <div className="modal-header">
          <h3>Check-In & Coupon Issue</h3>
          <button className="close-btn" aria-label="Close">
            &times;
          </button>
        </div>
        <form className="check-in-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="members">Members</label>
              <input type="number" id="members" defaultValue="1" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="room">Room Number</label>
              <input type="text" id="room" placeholder="GH-012" />
            </div>
            <div className="form-group">
              <label htmlFor="coupons">Coupons</label>
              <input type="number" id="coupons" defaultValue="1" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Food Category</label>
            <select id="category">
              <option value="vip">VIP</option>
              <option value="regular">Regular</option>
              <option value="economy">Economy</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="scan-qr-btn">
              <span className="icon">
                <svg width="16" height="16" fill="currentColor" className="bi bi-qr-code" viewBox="0 0 16 16">
                  <path d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM1 2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V1H1v1zm14 13a1 1 0 0 0-1 1H2a1 1 0 0 0-1-1v-1h14v1zm-7-1V9h3v5H8zm0-6V2h3v5H8zM5 9h3V5H5v4zm-1-5h3V2H4v2zM2 2h1v1H2V2zM2 13h1v1H2v-1zM13 2h1v1h-1V2zM13 13h1v1h-1v-1z"/>
                </svg>
              </span>
              <span>Scan QR</span>
            </button>
            <button type="submit" className="confirm-btn">
              Confirm Check-In & Issue Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInForm;
