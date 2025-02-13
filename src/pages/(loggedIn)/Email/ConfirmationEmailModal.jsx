import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConfirmationEmailModal.scss";

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">{children}</div>
    </div>
  );
};

const ConfirmationEmailModal = ({
  isOpen,
  onClose,
  guestData,
  arrivalDate,
  departureDate,
  onSend,
}) => {
  const navigate = useNavigate();
  const [emailContent, setEmailContent] = useState(`Dear Devotee,

Namoskar,

We have received, the below email and noted the contents. You are welcome to stay at our Guest House during the mentioned period i.e arrival - ${arrivalDate} and departure - ${departureDate} after breakfast at 07.30 a.m. The accommodation will be kept reserved for - devotees

Please bring a hard copy of this letter for ready reference along with your ID Proof or copy of your ID Proof (Aadhaar/ PAN/ Voter Card/Passport) Also, try to reach the Math Office to do the registration formalities between 09.00 to 11.00 a.m. on the day of arrival

May Sri Ramakrishna, Holy Mother Sri Sarada Devi and Swami Vivekananda bless you all !

Pranam and namaskar again.

Yours sincerely,

Swami Lokahanananda
Adhyaksha
RAMAKRISHNA MATH & RAMAKRISHNA MISSION, KAMANKUNUR`);

  useEffect(() => {
    setEmailContent((prevContent) => {
      return prevContent.replace(
        /arrival - .* and departure - .*/,
        `arrival - ${arrivalDate} and departure - ${departureDate}`
      );
    });
  }, [arrivalDate, departureDate]);

  const handleSend = async () => {
    try {
      await onSend();
      onClose();
      navigate("/Requests");
    } catch (error) {
      // console.error("Error sending email:", error);
      alert("Failed to send email and allocate rooms. Please try again.");
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="email-template">
        <div className="email-header">
          <span className="close-button" onClick={onClose}>
            ×
          </span>
          <div className="email-fields">
            <div className="field">
              <span>From:</span>
              <span className="email-address">emailaddress@gmail.com</span>
            </div>
            <div className="field">
              <span>To:</span>
              <div className="recipient-tags">
                {guestData?.additionalGuests?.map((guest, index) => (
                  <div key={index} className="recipient-chip">
                    <div className="avatar">A</div>
                    <span className="name">{guest.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="email-content">
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="email-content-textarea"
          />
        </div>

        <div className="email-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSend} className="send-button">
            Send
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmationEmailModal;
