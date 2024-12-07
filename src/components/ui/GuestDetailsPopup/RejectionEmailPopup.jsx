import React, { useState } from "react";
import "./RejectionEmailPopup.scss";

const RejectionEmailPopup = ({ onClose, onSubmit }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);

  const reasons = ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5"];

  const handleCheckboxChange = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedReasons);
    onClose();
  };

  return (
    <div className="attithi-rejection-overlay">
      <div className="attithi-rejection-content">
        <button className="attithi-rejection-close" onClick={onClose}>
          X
        </button>
        <h3 className="attithi-rejection-title">
          Select the reason to add in the rejection email
        </h3>
        <div className="attithi-rejection-reasons">
          {reasons.map((reason, index) => (
            <label key={index} className="attithi-rejection-option">
              <input
                type="checkbox"
                checked={selectedReasons.includes(reason)}
                onChange={() => handleCheckboxChange(reason)}
                className="attithi-rejection-checkbox"
              />
              {reason}
            </label>
          ))}
        </div>
        <div className="attithi-rejection-actions">
          <button
            className="attithi-rejection-send"
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0}
          >
            Send Mail
          </button>
          <button className="attithi-rejection-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionEmailPopup;
