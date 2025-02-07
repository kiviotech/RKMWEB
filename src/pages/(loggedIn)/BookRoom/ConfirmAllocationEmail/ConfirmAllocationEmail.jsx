import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createNewRoomAllocation } from "../../../../../services/src/services/roomAllocationService";
import "./ConfirmAllocationEmail.scss";

const ConfirmAllocationEmail = ({
  onClose,
  onSend,
  guestData,
  requestId,
  allocatedGuests,
  allocatedRoomNumber,
  allocatedRoomId,
}) => {
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      const allocationData = {
        room_status: "allocated",
        guests: {
          connect: allocatedGuests.map((guest) => guest.id),
        },
        booking_request: [requestId],
        room: [allocatedRoomId],
      };

      await createNewRoomAllocation(allocationData);

      toast.success("Room allocation created successfully!");

      onSend();
      onClose();

      // Navigate to the Requests page
      navigate("/Requests");
    } catch (error) {
      console.error("Error creating room allocation:", error);
      toast.error("Failed to create room allocation. Please try again.");
    }
  };

  console.log("Email Component Data:", {
    requestId,
    guestEmail: guestData?.attributes?.email,
    allocatedGuests,
    roomNumber: allocatedRoomNumber,
    roomId: allocatedRoomId,
  });

  return (
    <div className="allocation-email-overlay">
      <div className="allocation-email-modal">
        <button className="allocation-close-button" onClick={onClose}>
          ×
        </button>

        <div className="allocation-email-form">
          <div className="allocation-form-group">
            <label>From:</label>
            <span className="allocation-from-email">rck4043@gmail.com</span>
          </div>

          <div className="allocation-form-group">
            <label>To:</label>
            <div className="allocation-recipient-tags">
              {allocatedGuests.map((guest) => (
                <div key={guest.id} className="allocation-recipient-tag">
                  <span className="allocation-avatar">
                    {guest.attributes.email?.charAt(0)?.toUpperCase()}
                  </span>
                  <span className="allocation-name">
                    {guest.attributes.email}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="allocation-email-content"
            contentEditable={true}
            suppressContentEditableWarning={true}
            style={{ outline: "none" }}
          >
            <p>Dear Devotee,</p>
            <p>Namaskar.</p>

            <p>
              We have received, the below email and noted the contents. You are
              welcome to stay at our Guest House during the mentioned period
              i.e. arrival {guestData?.attributes?.arrival_date} and departure{" "}
              {guestData?.attributes?.departure_date} after breakfast at 07:30
              a.m. The accommodation will be kept reserved for{" "}
              {allocatedGuests?.length} devotees in Room No.{" "}
              {allocatedRoomNumber}
            </p>

            <p>
              Please bring a hard copy of this letter for ready reference along
              with your ID Proof or copy of your ID Proof (Aadhaar/ PAN/ Voter
              Card/Passport) Also, try to reach the Math Office to do the
              registration formalities between 09.00 to 11.00 a.m. on the day of
              arrival
            </p>

            <p>
              May Sri Ramakrishna, Holy Mother Sri Sarada Devi and Swami
              Vivekananda bless you all I
            </p>

            <p>With best regards and namaskar again.</p>

            <p>Yours sincerely,</p>
            <p>Swami Lokottarananda</p>
            <p>Adhyaksha</p>
            <p>RAMAKRISHNA MATH & RAMAKRISHNA MISSION, KAMARPUKUR</p>
          </div>

          <div className="allocation-modal-actions">
            <button className="allocation-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="allocation-send-button"
              onClick={handleSendEmail}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAllocationEmail;
