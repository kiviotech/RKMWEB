import React, { useEffect, useState } from "react";
import { fetchBookingRequestById } from "../../../../../services/src/services/bookingRequestService";
import "./BookRoomDevoteeDetails.scss";
import ConfirmAllocationEmail from "../ConfirmAllocationEmail/ConfirmAllocationEmail";

const BookRoomDevoteeDetails = ({
  requestId,
  onAllocate,
  allocatedRoomNumber,
  allocatedRoomId,
}) => {
  const [guestData, setGuestData] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [allocatedGuests, setAllocatedGuests] = useState([]);
  const [totalAllocatedCount, setTotalAllocatedCount] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        if (requestId) {
          const response = await fetchBookingRequestById(requestId);
          console.log("Booking Request Data:", response);
          setGuestData(response.data);
          const allGuestIds =
            response.data?.attributes?.guests?.data?.map((guest) => guest.id) ||
            [];
          setSelectedGuests(allGuestIds);
        }
      } catch (error) {
        console.error("Error fetching booking request:", error);
      }
    };

    fetchRequestData();
  }, [requestId]);

  const handleGuestSelect = (guestId) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleAllocate = () => {
    if (
      guestData?.attributes?.arrival_date &&
      guestData?.attributes?.departure_date
    ) {
      const newAllocatedGuests = guestData.attributes.guests.data.filter(
        (guest) => selectedGuests.includes(guest.id)
      );

      setAllocatedGuests((prev) => [...prev, ...newAllocatedGuests]);

      const newTotalCount = totalAllocatedCount + selectedGuests.length;
      setTotalAllocatedCount(newTotalCount);

      const updatedGuestData = {
        ...guestData,
        attributes: {
          ...guestData.attributes,
          guests: {
            ...guestData.attributes.guests,
            data: guestData.attributes.guests.data.filter(
              (guest) => !selectedGuests.includes(guest.id)
            ),
          },
        },
      };
      setGuestData(updatedGuestData);
      setSelectedGuests([]);

      onAllocate(
        guestData.attributes.arrival_date,
        guestData.attributes.departure_date,
        newTotalCount
      );
    }
  };

  const handleConfirmAllocation = () => {
    const emailData = {
      requestId: requestId,
      guestEmail: guestData?.attributes?.email,
      allocatedGuests: allocatedGuests.map((guest) => ({
        ...guest,
        roomNumber: allocatedRoomNumber,
        roomId: allocatedRoomId,
      })),
    };
    console.log("Email Data:", emailData);
    setShowEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
  };

  const handleSendEmail = () => {
    // Add your email sending logic here
    setShowEmailModal(false);
  };

  return (
    <div className="devotee-details">
      {allocatedGuests.length > 0 && (
        <div className="allocated-guests-section">
          <div className="section-content">
            <h2>Allocated Guests</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Relation</th>
                  <th>Room No.</th>
                </tr>
              </thead>
              <tbody>
                {allocatedGuests.map((guest) => (
                  <tr key={guest.id}>
                    <td>{guest.attributes.name}</td>
                    <td>{guest.attributes.age}</td>
                    <td>{guest.attributes.gender}</td>
                    <td>{guest.attributes.relationship}</td>
                    <td>{allocatedRoomNumber || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!guestData?.attributes?.guests?.data?.length && (
              <button
                className="confirm-allocation-button"
                onClick={handleConfirmAllocation}
              >
                Confirm Allocation
              </button>
            )}
          </div>
        </div>
      )}

      {guestData?.attributes?.guests?.data?.length > 0 && (
        <div className="non-allocated-guests-section">
          <div className="section-content">
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
                {guestData?.attributes?.guests?.data?.map((guest) => (
                  <tr
                    key={guest.id}
                    onClick={() => handleGuestSelect(guest.id)}
                  >
                    <td>
                      <div className="guest-name-cell">
                        <input
                          type="checkbox"
                          checked={selectedGuests.includes(guest.id)}
                          onChange={() => {}}
                        />
                        <span className="guest-name">
                          {guest.attributes.name}
                        </span>
                      </div>
                    </td>
                    <td>{guest.attributes.age}</td>
                    <td>{guest.attributes.gender}</td>
                    <td>{guest.attributes.relationship}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="allocate-button" onClick={handleAllocate}>
              Allocate
            </button>
          </div>
        </div>
      )}

      {showEmailModal && (
        <ConfirmAllocationEmail
          onClose={handleCloseEmailModal}
          onSend={handleSendEmail}
          guestData={guestData}
          requestId={requestId}
          allocatedGuests={allocatedGuests}
          allocatedRoomNumber={allocatedRoomNumber}
        />
      )}
    </div>
  );
};

export default BookRoomDevoteeDetails;
