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
      const primaryEmail = allocatedGuests[0]?.attributes?.email || "";
      const ccEmails = allocatedGuests
        .slice(1) // Skip the first guest (primary recipient)
        .map(guest => guest.attributes?.email)
        .filter(email => email && email.trim() !== "" && email !== primaryEmail); // Filter out empty emails and duplicates

      const emailData = {
        bookingId: `${requestId}`,
        name: allocatedGuests[0]?.attributes?.name || "",
        email: primaryEmail,
        cc: ccEmails, // Add CC emails field
        checkInDate: new Date(guestData?.attributes?.arrival_date)
          .toISOString()
          .split("T")[0],
        checkOutDate: new Date(guestData?.attributes?.departure_date)
          .toISOString()
          .split("T")[0],
        numberOfGuests: allocatedGuests.length,
        accommodationType: accommodationType,
        roomDetails: allocatedRooms.map(room => room.roomNumber).join(", ") // Include allocated room numbers
      };

      // Send the confirmation email using the determined function
      try {
        console.log('Sending email with data:', emailData);
        await sendEmailConfirmation(emailData);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue with allocation but notify about email failure
        toast.warning('Room allocation completed, but there was an issue sending the confirmation email.');
      }

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
            <span className="allocation-from-email">guesthouse@kamarpukurmath.org</span>
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
              We have received your booking request and are pleased to confirm your stay at our Guest House.
              Your accommodation has been successfully reserved for the period:
            </p>
            
            <p style={{ marginLeft: "20px" }}>
              <strong>Check-in:</strong> {new Date(guestData?.attributes?.arrival_date)
                .toLocaleDateString("en-GB", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
              <br />
              <strong>Check-out:</strong> {new Date(guestData?.attributes?.departure_date)
                .toLocaleDateString("en-GB", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                (after breakfast at 07:30 a.m.)
            </p>
            
            <p>
              <strong>Accommodation Details:</strong>
            </p>
            <p style={{ marginLeft: "20px" }}>
              <strong>Number of Guests:</strong> {allocatedGuests?.length} devotee{allocatedGuests?.length > 1 ? 's' : ''}
              <br />
              <strong>Room(s) Allocated:</strong> {allocatedRooms.map(room => room.roomNumber).join(", ")}
            </p>
            
            <p>
              <strong>Important Information:</strong>
            </p>
            <ul style={{ marginLeft: "20px" }}>
              <li>Please bring a hard copy of this confirmation email for reference at check-in</li>
              <li>All guests must present a valid ID proof (Aadhaar/PAN/Voter Card/Passport)</li>
              <li>Please complete registration formalities at the Math Office between 09:00 AM to 11:00 AM on your arrival day</li>
            </ul>

            <p>
              May Sri Ramakrishna, Holy Mother Sri Sarada Devi and Swami
              Vivekananda bless you all!
            </p>

            <p>With best regards and namaskar,</p>

            <p>Yours sincerely,</p>
            <p>Swami Lokottarananda</p>
            <p>Adhyaksha</p>
            <p>RAMAKRISHNA MATH & RAMAKRISHNA MISSION, KAMARPUKUR</p>
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
