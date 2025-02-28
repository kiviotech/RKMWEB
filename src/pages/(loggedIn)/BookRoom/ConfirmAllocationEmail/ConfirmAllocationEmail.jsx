import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createNewRoomAllocation } from "../../../../../services/src/services/roomAllocationService";
import { updateBookingRequestById } from "../../../../../services/src/services/bookingRequestService";
import {
  sendBookingConfirmation,
  sendPeerlessConfirmation,
  sendYatriNivasConfirmation
} from "../../../../../services/src/services/emailTemplateService";
import "./ConfirmAllocationEmail.scss";

const ConfirmAllocationEmail = ({
  onClose,
  onSend,
  guestData,
  requestId,
  allocatedGuests,
  allocatedRooms,
}) => {
  const navigate = useNavigate();

  // Add console logs to see the received props
  console.log("ConfirmAllocationEmail - Props received:", {
    guestData,
    requestId,
    allocatedGuests,
    allocatedRooms,
  });

  const handleSend = async () => {
    try {
      // Group allocations by roomId
      const groupedAllocations = allocatedRooms.reduce((acc, curr) => {
        if (!acc[curr.roomId]) {
          acc[curr.roomId] = {
            roomId: curr.roomId,
            guestIds: [],
            startDate: curr.startDate,
            endDate: curr.endDate,
          };
        }
        acc[curr.roomId].guestIds.push(curr.guestId);
        return acc;
      }, {});

      // Create room allocations for each group
      for (const roomGroup of Object.values(groupedAllocations)) {
        await createNewRoomAllocation({
          room_status: "allocated",
          guests: roomGroup.guestIds,
          booking_request: requestId,
          room: roomGroup.roomId,
          start_date: roomGroup.startDate,
          end_date: roomGroup.endDate,
        });
      }

      // Update booking request status
      await updateBookingRequestById(requestId, {
        data: {
          status: "confirmed",
        },
      });

      // Determine accommodation type based on first room's prefix
      const firstRoomPrefix = allocatedRooms[0]?.roomNumber?.split(' ')[0];
      let accommodationType = "Guest House";
      let sendEmailConfirmation = sendBookingConfirmation;

      switch (firstRoomPrefix) {
        case 'GH':
          accommodationType = "Guest House";
          sendEmailConfirmation = sendBookingConfirmation;
          break;
        case 'F':
          accommodationType = "Peerless";
          sendEmailConfirmation = sendPeerlessConfirmation;
          break;
        case 'YN':
          accommodationType = "Yatri Nivas";
          sendEmailConfirmation = sendYatriNivasConfirmation;
          break;
        default:
          accommodationType = "Guest House";
          sendEmailConfirmation = sendBookingConfirmation;
      }

      // Prepare email data
      const emailData = {
        bookingId: `${requestId}`,
        name: allocatedGuests[0]?.attributes?.name || "",
        email: allocatedGuests[0]?.attributes?.email || "",
        checkInDate: new Date(guestData?.attributes?.arrival_date)
          .toISOString()
          .split("T")[0],
        checkOutDate: new Date(guestData?.attributes?.departure_date)
          .toISOString()
          .split("T")[0],
        numberOfGuests: allocatedGuests.length,
        accommodationType: accommodationType,
      };

      // Send the confirmation email using the determined function
      await sendEmailConfirmation(emailData);

      toast.success("Room allocation confirmed and email sent successfully!");
      onClose();
      navigate("/Requests");
    } catch (error) {
      console.error("Error in room allocation process:", error);
      toast.error("Failed to complete room allocation process");
    }
  };

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
            <p>Dear {allocatedGuests[0]?.attributes?.name},</p>
            <p>Namaskar.</p>

            <p>
              We have received, the below email and noted the contents. You are
              welcome to stay at our Guest House during the mentioned period
              i.e. arrival{" "}
              {new Date(guestData?.attributes?.arrival_date)
                .toLocaleDateString("en-GB")
                .split("/")
                .join("-")}{" "}
              and departure{" "}
              {new Date(guestData?.attributes?.departure_date)
                .toLocaleDateString("en-GB")
                .split("/")
                .join("-")}{" "}
              after breakfast at 07:30 a.m. The accommodation will be kept
              reserved for {allocatedGuests?.length} devotees.
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
              Vivekananda bless you all!
            </p>

            <p>With best regards and namaskar again.</p>

            <p>Yours sincerely,</p>
            <p>Swami Lokottarananda</p>
            <p>Adhyaksha</p>
          </div>

          <div className="allocation-modal-actions">
            <button className="allocation-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="allocation-send-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAllocationEmail;
