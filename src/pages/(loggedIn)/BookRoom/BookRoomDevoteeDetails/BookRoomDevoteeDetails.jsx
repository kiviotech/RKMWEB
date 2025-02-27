import React, { useEffect, useState } from "react";
import { fetchBookingRequestById } from "../../../../../services/src/services/bookingRequestService";
import "./BookRoomDevoteeDetails.scss";
import ConfirmAllocationEmail from "../ConfirmAllocationEmail/ConfirmAllocationEmail";

const BookRoomDevoteeDetails = ({ id, selectedGuests, setSelectedGuests, onClear }) => {
  const [devoteeDetails, setDevoteeDetails] = useState(null);
  const [tempAllocations, setTempAllocations] = useState([]);
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);

  // First useEffect for fetching devotee details
  useEffect(() => {
    const fetchDevoteeDetails = async () => {
      const response = await fetchBookingRequestById(id);
      setDevoteeDetails(response.data);
      console.log("Devotee Details:", response.data);

      // Get non-allocated guests and set them as selected by default
      const guests = response.data.attributes.guests.data;
      const nonAllocatedGuests = guests.filter(
        guest => guest.attributes.room_allocations.data.length === 0
      );
      setSelectedGuests(nonAllocatedGuests);
    };
    fetchDevoteeDetails();
  }, [id, setSelectedGuests]);

  // Second useEffect for handling room allocation
  useEffect(() => {
    const handleRoomAllocation = (event) => {
      const { roomNumber, dates, guestId, roomId } = event.detail;
      const newAllocation = {
        guestId: guestId,
        roomNumber: roomNumber,
        roomId: roomId,
        startDate: dates.startDate,
        endDate: dates.endDate
      };
      setTempAllocations(prev => [...prev, newAllocation]);
      // Note: selectedGuests is now managed by BookRoom component
    };

    window.addEventListener('roomAllocated', handleRoomAllocation);
    return () => {
      window.removeEventListener('roomAllocated', handleRoomAllocation);
    };
  }, []);

  if (!devoteeDetails) return <div>Loading...</div>;

  const guests = devoteeDetails.attributes.guests.data;

  const nonAllocatedGuests = guests.filter(
    guest => guest.attributes.room_allocations.data.length === 0 &&
      !tempAllocations.some(allocation => allocation.guestId === guest.id)
  );

  const allocatedGuests = [
    ...guests.filter(guest => guest.attributes.room_allocations.data.length > 0),
    ...guests.filter(guest => tempAllocations.some(allocation => allocation.guestId === guest.id))
  ];

  const handleGuestSelection = (guest) => {
    setSelectedGuests(prev => {
      const isSelected = prev.some(g => g.id === guest.id);
      if (isSelected) {
        return prev.filter(g => g.id !== guest.id);
      } else {
        return [...prev, guest];
      }
    });
  };

  const handleClearAllocations = () => {
    setTempAllocations([]);
    // Reset any selected guests back to the non-allocated list
    const clearedGuests = tempAllocations.map(allocation =>
      guests.find(guest => guest.id === allocation.guestId)
    ).filter(Boolean);
    setSelectedGuests(prev => [...prev, ...clearedGuests]);

    // Trigger refresh of BookRoomBed
    onClear();
  };

  const handleConfirmAllocations = () => {
    console.log("Confirming allocations:", tempAllocations);
    setShowConfirmEmail(true);
  };

  return (
    <div className="devotee-details">
      {showConfirmEmail && (
        <ConfirmAllocationEmail
          onClose={() => setShowConfirmEmail(false)}
          onSend={() => {
            // Handle send logic here
            setShowConfirmEmail(false);
          }}
          guestData={devoteeDetails}
          requestId={id}
          allocatedGuests={allocatedGuests}
          allocatedRooms={tempAllocations}
        />
      )}

      {allocatedGuests.length > 0 && (
        <div className="allocated-guests-card">
          <h2>Allocated Guests</h2>
          <table>
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Relation</th>
              </tr>
            </thead>
            <tbody>
              {allocatedGuests.map((guest) => {
                const tempAllocation = tempAllocations.find(a => a.guestId === guest.id);
                const permanentAllocation = guest.attributes.room_allocations.data[0];

                return (
                  <tr key={guest.id}>
                    <td>
                      {tempAllocation ? tempAllocation.roomNumber :
                        permanentAllocation ? permanentAllocation.attributes.room.data.attributes.room_number : '-'}
                    </td>
                    <td>{guest.attributes.name}</td>
                    <td>{guest.attributes.age}</td>
                    <td>{guest.attributes.gender}</td>
                    <td>{guest.attributes.relationship}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {tempAllocations.length > 0 && (
            <div className="bottom-actions">
              <button
                className="clear-button"
                onClick={handleClearAllocations}
              >
                Clear
              </button>
              <button
                className="confirm-button"
                onClick={handleConfirmAllocations}
                disabled={nonAllocatedGuests.length > 0}
                title={nonAllocatedGuests.length > 0 ? "Please allocate all guests before confirming" : ""}
              >
                Confirm Allocation
              </button>
            </div>
          )}
        </div>
      )}

      {nonAllocatedGuests.length > 0 && (
        <div className="non-allocated-guests-card">
          <h2>Non-Allocated Guests</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Relation</th>
              </tr>
            </thead>
            <tbody>
              {nonAllocatedGuests.map((guest) => (
                <tr key={guest.id}>
                  <td>
                    <div className="guest-name-cell">
                      <input
                        type="checkbox"
                        checked={selectedGuests.some(g => g.id === guest.id)}
                        onChange={() => handleGuestSelection(guest)}
                      />
                      <span className="guest-name">{guest.attributes.name}</span>
                    </div>
                  </td>
                  <td>{guest.attributes.age}</td>
                  <td>{guest.attributes.gender}</td>
                  <td>{guest.attributes.relationship}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!allocatedGuests.length && !nonAllocatedGuests.length && (
        <div className="no-guests-message">
          No guests available
        </div>
      )}
    </div>
  );
};

export default BookRoomDevoteeDetails;
