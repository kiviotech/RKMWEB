import React, { useState, useEffect } from "react";
import "./RejectionEmailPopup.scss";
import {
  sendNoRoomsRegret,
  sendRevisitRegret,
  sendSpecialCelebrationRegret,
} from "../../../../services/src/services/emailTemplateService";

const RejectionEmailPopup = ({ onClose, onSubmit, guestDetail }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState("");

  const reasons = [
    "No Rooms Available.",
    "Revisit in 6 months",
    "Special Celebrations (Below 10k)",
    "Special Celebrations (Above 10k)",
  ];

  const arrivalDate = guestDetail?.data?.attributes?.arrival_date;
  const departureDate = guestDetail?.data?.attributes?.departure_date;

  const handleCheckboxChange = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (selectedReasons.length === 0) {
      alert("Please select at least one reason.");
      return;
    }

    // Format dates for better display
    const formattedArrivalDate = arrivalDate
      ? new Date(arrivalDate).toLocaleDateString()
      : "N/A";
    const formattedDepartureDate = departureDate
      ? new Date(departureDate).toLocaleDateString()
      : "N/A";

    let content = `Dear Devotee,

Namoskar,

We have received the below email and noted the contents. You are welcome to stay at our Guest House during the mentioned period i.e arrival - ${formattedArrivalDate} and departure - ${formattedDepartureDate}

Please bring a hard copy of this letter for ready reference along with your ID Proof or copy of your ID Proof (Aadhaar/ PAN/ Voter Card/Passport). Also, try to reach the Math Office to do the registration formalities between 09.00 to 11.00 a.m. on the day of arrival.

May Sri Ramakrishna, Holy Mother Sri Sarada Devi, and Swami Vivekananda bless you all!

Pranam and namaskar again.

Yours sincerely,
Swami Lokahanananda`;

    setEmailContent(content);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    try {
      const emailData = {
        bookingId: `${guestDetail?.data?.id}`,
        name:
          guestDetail?.data?.attributes?.guests?.data[0]?.attributes?.name ||
          "",
        email:
          guestDetail?.data?.attributes?.guests?.data[0]?.attributes?.email ||
          "",
        checkInDate: new Date(arrivalDate).toISOString().split("T")[0],
        checkOutDate: new Date(departureDate).toISOString().split("T")[0],
        numberOfGuests:
          guestDetail?.data?.attributes?.guests?.data?.length || 0,
      };

      // Determine which email template to use based on selected reasons
      if (selectedReasons.includes("No Rooms Available.")) {
        await sendNoRoomsRegret(emailData);
      } else if (selectedReasons.includes("Revisit in 6 months")) {
        await sendRevisitRegret(emailData);
      } else if (
        selectedReasons.includes("Special Celebrations (Below 10k)") ||
        selectedReasons.includes("Special Celebrations (Above 10k)")
      ) {
        await sendSpecialCelebrationRegret(emailData);
      }

      onSubmit(selectedReasons);
      setIsEmailModalOpen(false);
      alert("Email sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending rejection email:", error);
      alert("Failed to send rejection email. Please try again.");
    }
  };

  const ConfirmationEmailModal = ({
    isOpen,
    onClose,
    emailContent,
    onSend,
    guestDetail,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="confirmation-email-overlay">
        <div className="confirmation-email-content">
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
                    {guestDetail?.data?.attributes?.guests?.data?.map(
                      (guest, index) => (
                        <div key={index} className="recipient-chip">
                          <div className="avatar">A</div>
                          <span className="name">{guest.attributes.name}</span>
                        </div>
                      )
                    )}
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
              <button onClick={onSend} className="send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="attithi-rejection-overlay">
      <div className="attithi-rejection-content">
        <button className="attithi-rejection-close" onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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

      <ConfirmationEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailContent={emailContent}
        onSend={handleSendEmail}
        guestDetail={guestDetail}
      />
    </div>
  );
};

export default RejectionEmailPopup;
