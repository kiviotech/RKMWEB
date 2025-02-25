import React, { useEffect, useState } from "react";
import { fetchBookingRequestById } from "../../../../../services/src/services/bookingRequestService";
import "./BookRoomDevoteeDetails.scss";
import ConfirmAllocationEmail from "../ConfirmAllocationEmail/ConfirmAllocationEmail";
import ConfirmDormitoryEmail from "../ConfirmDormitoryEmail/ConfirmDormitoryEmail";

const BookRoomDevoteeDetails = ({
  requestId,
  onAllocate,
  allocatedRooms = [],
  onGuestUncheck,
}) => {
  const [guestData, setGuestData] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [allocatedGuests, setAllocatedGuests] = useState([]);
  const [allocatedDevotees, setAllocatedDevotees] = useState([]);
  const [totalAllocatedCount, setTotalAllocatedCount] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDormitoryEmailModal, setShowDormitoryEmailModal] = useState(false);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        if (requestId) {
          const response = await fetchBookingRequestById(requestId);
          // console.log("Booking Request Data:", response);
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

  // useEffect(() => {
  //   console.log("Room allocation updated:", allocatedRooms);
  // }, [allocatedRooms]);

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

      // Pass the room ID along with other room data
      onAllocate(
        guestData.attributes.arrival_date,
        guestData.attributes.departure_date,
        newTotalCount,
        allocatedRooms.map((room) => ({
          ...room,
          id: room.roomId, // Make sure roomId is included
        }))
      );

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
    }
  };

  const handleDevoteeAllocate = () => {
    if (
      guestData?.attributes?.arrival_date &&
      guestData?.attributes?.departure_date
    ) {
      const maleDevotees = {
        gender: "Male",
        count: parseInt(
          guestData?.attributes?.number_of_male_devotees || 0,
          10
        ),
      };
      const femaleDevotees = {
        gender: "Female",
        count: parseInt(
          guestData?.attributes?.number_of_female_devotees || 0,
          10
        ),
      };

      const newDevotees = [maleDevotees, femaleDevotees].filter(
        (d) => d.count > 0
      );
      setAllocatedDevotees(newDevotees);

      const totalCount = newDevotees.reduce((sum, dev) => sum + dev.count, 0);
      setTotalAllocatedCount((prevCount) => prevCount + totalCount);

      // Pass the room ID along with other room data
      onAllocate(
        guestData.attributes.arrival_date,
        guestData.attributes.departure_date,
        totalCount,
        {
          male: maleDevotees.count,
          female: femaleDevotees.count,
          rooms: allocatedRooms.map((room) => ({
            ...room,
            id: room.roomId, // Make sure roomId is included
          })),
        }
      );
    }
  };

  const handleCloseDormitoryEmailModal = () => {
    setShowDormitoryEmailModal(false);
  };

  const handleDormitoryConfirmAllocation = () => {
    const emailData = {
      requestId: requestId,
      guestEmail: guestData?.attributes?.email,
      allocatedGuests: allocatedGuests.map((guest, index) => {
        const room = findRoomForGuest(index);
        return {
          ...guest,
          roomNumber: room?.roomNumber,
          roomId: room?.id,
        };
      }),
    };
    setShowDormitoryEmailModal(true);
  };

  const handleConfirmAllocation = () => {
    const emailData = {
      requestId: requestId,
      guestEmail: guestData?.attributes?.email,
      allocatedGuests: allocatedGuests.map((guest, index) => {
        const room = findRoomForGuest(index);
        return {
          ...guest,
          roomNumber: room?.roomNumber,
          roomId: room?.id,
        };
      }),
    };
    setShowEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
  };

  const handleSendEmail = () => {
    // Add your email sending logic here
    setShowEmailModal(false);
  };

  const findRoomForGuest = (guestIndex, devoteeCount = 1) => {
    console.log("Finding room with params:", {
      guestIndex,
      devoteeCount,
      allocatedRooms,
    });

    if (!Array.isArray(allocatedRooms) || allocatedRooms.length === 0) {
      console.log("No allocated rooms available");
      return null;
    }

    // For devotees, just return the first available room that can accommodate them
    if (devoteeCount > 1) {
      const suitableRoom = allocatedRooms.find(
        (room) => room.bedsAllocated >= devoteeCount
      );
      console.log("Suitable room found for devotees:", suitableRoom);
      return suitableRoom || allocatedRooms[0];
    }

    // For individual guests
    let currentBedCount = 0;
    for (const room of allocatedRooms) {
      if (
        guestIndex >= currentBedCount &&
        guestIndex < currentBedCount + room.bedsAllocated
      ) {
        console.log("Found room for guest:", room);
        return room;
      }
      currentBedCount += room.bedsAllocated;
    }

    // If no specific room found, return the first room
    console.log("Defaulting to first room:", allocatedRooms[0]);
    return allocatedRooms[0];
  };

  const handleAllocatedGuestSelect = (guest) => {
    // Move guest back to non-allocated section
    setGuestData((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        guests: {
          ...prevData.attributes.guests,
          data: [...prevData.attributes.guests.data, guest],
        },
      },
    }));

    // Remove from allocated guests
    setAllocatedGuests((prev) => prev.filter((g) => g.id !== guest.id));

    // Update total allocated count
    setTotalAllocatedCount((prev) => prev - 1);

    // Notify parent component to update bed allocation
    onGuestUncheck(guest);
  };

  // Add this useEffect to monitor room allocations
  useEffect(() => {
    console.log("Current allocated rooms:", allocatedRooms);
    console.log("Current allocated devotees:", allocatedDevotees);
  }, [allocatedRooms, allocatedDevotees]);

  const findRoomsForDevotees = (devotee, startIndex = 0) => {
    if (!Array.isArray(allocatedRooms) || allocatedRooms.length === 0) {
      return [];
    }

    let remainingCount = devotee.count;
    let assignedRooms = [];

    // Calculate starting room based on gender
    const availableRooms = [...allocatedRooms];
    const startRoom =
      devotee.gender === "Male" ? 0 : Math.floor(availableRooms.length / 2);
    const endRoom =
      devotee.gender === "Male"
        ? Math.floor(availableRooms.length / 2)
        : availableRooms.length;

    // Only use rooms in the gender-specific range
    for (let i = startRoom; i < endRoom && remainingCount > 0; i++) {
      const room = availableRooms[i];
      if (!room) continue;

      const bedsInThisRoom = Math.min(room.bedsAllocated, remainingCount);
      assignedRooms.push({
        ...room,
        bedsUsed: bedsInThisRoom,
      });
      remainingCount -= bedsInThisRoom;
    }

    return assignedRooms;
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
                {allocatedGuests.map((guest, index) => {
                  const room = findRoomForGuest(index);
                  return (
                    <tr key={guest.id}>
                      <td>
                        <div className="guest-name-cell">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleAllocatedGuestSelect(guest)}
                          />
                          <span className="guest-name">
                            {guest.attributes.name}
                          </span>
                        </div>
                      </td>
                      <td>{guest.attributes.age}</td>
                      <td>{guest.attributes.gender}</td>
                      <td>{guest.attributes.relationship}</td>
                      <td>{room ? room.roomNumber : "Pending"}</td>
                    </tr>
                  );
                })}
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

      {allocatedDevotees.length > 0 && (
        <div className="allocated-guests-section">
          <div className="section-content">
            <h2>Allocated Devotees</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Count</th>
                  <th>Room No.</th>
                </tr>
              </thead>
              <tbody>
                {allocatedDevotees.map((devotee, index) => {
                  const assignedRooms = findRoomsForDevotees(devotee, index);

                  return (
                    <tr key={devotee.gender}>
                      <td>
                        <div className="guest-name-cell">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleAllocatedGuestSelect(devotee)}
                          />
                          <span className="guest-name">Devotees</span>
                        </div>
                      </td>
                      <td>{devotee.gender}</td>
                      <td>{devotee.count}</td>
                      <td>
                        {assignedRooms.length > 0 ? (
                          <div className="room-allocation-list">
                            {assignedRooms.map((room, idx) => (
                              <div key={idx}>
                                {`${room.roomNumber} (${room.bedsUsed} beds)`}
                                {idx < assignedRooms.length - 1 ? ", " : ""}
                              </div>
                            ))}
                          </div>
                        ) : (
                          "Pending"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              className="confirm-allocation-button"
              onClick={handleDormitoryConfirmAllocation}
            >
              Confirm Allocation
            </button>
          </div>
        </div>
      )}

      {/* First section: Name/Gender/Count */}
      {guestData?.attributes?.number_of_guest_members > 0 &&
      allocatedDevotees.length === 0 &&
      (guestData?.attributes?.number_of_male_devotees > 0 ||
        guestData?.attributes?.number_of_female_devotees > 0) ? (
        <div className="non-allocated-guests-section">
          <div className="section-content">
            <h2>Non-Allocated Guests</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {guestData?.attributes?.number_of_male_devotees > 0 && (
                  <tr>
                    <td>
                      <div className="guest-name-cell">
                        <input type="checkbox" defaultChecked={true} />
                        <span className="guest-name">Devotees</span>
                      </div>
                    </td>
                    <td>Male</td>
                    <td>{guestData?.attributes?.number_of_male_devotees}</td>
                  </tr>
                )}
                {guestData?.attributes?.number_of_female_devotees > 0 && (
                  <tr>
                    <td>
                      <div className="guest-name-cell">
                        <input type="checkbox" defaultChecked={true} />
                        <span className="guest-name">Devotees</span>
                      </div>
                    </td>
                    <td>Female</td>
                    <td>{guestData?.attributes?.number_of_female_devotees}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="allocate-button" onClick={handleDevoteeAllocate}>
              Allocate
            </button>
          </div>
        </div>
      ) : null}

      {/* Second section: Name/Age/Gender/Relation */}
      {guestData?.attributes?.guests?.data?.length > 0 &&
      !(
        guestData?.attributes?.number_of_male_devotees > 0 ||
        guestData?.attributes?.number_of_female_devotees > 0
      ) ? (
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
      ) : null}

      {showEmailModal && (
        <ConfirmAllocationEmail
          onClose={handleCloseEmailModal}
          onSend={handleSendEmail}
          guestData={guestData}
          requestId={requestId}
          allocatedGuests={allocatedGuests}
          allocatedRooms={allocatedRooms}
        />
      )}

      {showDormitoryEmailModal && (
        <ConfirmDormitoryEmail
          onClose={handleCloseDormitoryEmailModal}
          onSend={handleSendEmail}
          guestData={guestData}
          requestId={requestId}
          allocatedGuests={allocatedGuests}
          allocatedRooms={allocatedRooms}
        />
      )}

      <style jsx>{`
        .room-allocation-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .room-allocation-list > div {
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default BookRoomDevoteeDetails;
