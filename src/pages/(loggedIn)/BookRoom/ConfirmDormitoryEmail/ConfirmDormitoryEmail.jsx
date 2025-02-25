import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createNewRoomAllocation } from "../../../../../services/src/services/roomAllocationService";
import { updateBookingRequestById } from "../../../../../services/src/services/bookingRequestService";

const ConfirmDormitoryEmail = ({
  onClose,
  onSend,
  guestData,
  requestId,
  allocatedGuests,
  allocatedRooms,
}) => {
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      let guestIndex = 0; // Keep track of which guests have been allocated

      // Create separate allocations for each room
      for (const room of allocatedRooms) {
        // Get the specific guests for this room
        const guestsForRoom = allocatedGuests.slice(
          guestIndex,
          guestIndex + room.bedsAllocated
        );

        // Update the guest index for the next room
        guestIndex += room.bedsAllocated;

        const allocationData = {
          room_status: "allocated",
          guests: {
            connect: guestsForRoom.map((guest) => guest.id),
          },
          booking_request: [requestId],
          room: [room.roomId],
        };

        // console.log(`Creating allocation for room ${room.roomNumber}:`, {
        //   roomNumber: room.roomNumber,
        //   guestCount: guestsForRoom.length,
        //   guestIds: guestsForRoom.map((g) => g.id),
        // });

        await createNewRoomAllocation(allocationData);
      }

      // Update booking request status to confirmed
      const updateData = {
        data: {
          status: "confirmed",
        },
      };

      await updateBookingRequestById(requestId, updateData);
      // console.log("Booking request status updated to confirmed");

      toast.success(
        "Room allocations created and booking request updated successfully!"
      );
      onSend();
      onClose();
      navigate("/Requests");
    } catch (error) {
      // console.error("Error in room allocation process:", error);
      toast.error(
        "Failed to complete the allocation process. Please try again."
      );
    }
  };

  // Format room numbers for display
  const formatRoomNumbers = () => {
    return allocatedRooms
      .map((room) => `${room.roomNumber} (${room.bedsAllocated} beds)`)
      .join(", ");
  };

  // console.log("Email Component Data:", {
  //   requestId,
  //   guestEmail: guestData?.attributes?.email,
  //   allocatedGuests,
  //   allocatedRooms,
  // });

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

export default ConfirmDormitoryEmail;
