import React, { useEffect, useState } from "react";
import { fetchBookingRequestById } from "../../../../../services/src/services/bookingRequestService";
import "./BookDormitoryRoomDevoteeDetails.scss";
import ConfirmDormitoryEmail from "../ConfirmDormitoryEmail/ConfirmDormitoryEmail";

const BookDormitoryRoomDevoteeDetails = ({ id, selectedGuests, setSelectedGuests, onClear }) => {
  const [devoteeDetails, setDevoteeDetails] = useState(null);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [isMaleSelected, setIsMaleSelected] = useState(false);
  const [isFemaleSelected, setIsFemaleSelected] = useState(false);
  const [allocatedRooms, setAllocatedRooms] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const fetchDevoteeDetails = async () => {
      const response = await fetchBookingRequestById(id);
      setDevoteeDetails(response.data);
    };
    fetchDevoteeDetails();
  }, [id]);

  useEffect(() => {
    if (selectedGuests.length > 0) {
      const roomNumber = selectedGuests[0]?.roomNumber;
      const roomId = selectedGuests[0]?.roomId;
      const count = selectedGuests[0]?.attributes?.count || 0;
      const gender = selectedGuests[0]?.attributes?.gender;

      if (roomNumber && count && gender) {
        setAllocatedRooms(prev => {
          return [...prev, {
            roomNumber,
            roomId,
            count,
            gender,
            name: `${gender === 'M' ? 'Male' : 'Female'} Devotees`
          }];
        });

        if (gender === 'M') {
          setMaleCount(0);
          setIsMaleSelected(false);
        } else if (gender === 'F') {
          setFemaleCount(0);
          setIsFemaleSelected(false);
        }

        setSelectedGuests([]);
      }
    }
  }, [selectedGuests, setSelectedGuests]);

  if (!devoteeDetails) return <div>Loading...</div>;

  const guests = devoteeDetails.attributes.guests.data;
  const nonAllocatedGuests = guests.filter(
    guest => guest.attributes.room_allocations.data.length === 0
  );
  const allocatedGuests = guests.filter(
    guest => guest.attributes.room_allocations.data.length > 0
  );

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

  const calculateRemainingCounts = () => {
    const allocatedMaleCount = allocatedRooms
      .filter(room => room.gender === 'M')
      .reduce((sum, room) => sum + room.count, 0);

    const allocatedFemaleCount = allocatedRooms
      .filter(room => room.gender === 'F')
      .reduce((sum, room) => sum + room.count, 0);

    const totalMaleCount = devoteeDetails?.attributes?.number_of_male_devotees || 0;
    const totalFemaleCount = devoteeDetails?.attributes?.number_of_female_devotees || 0;

    return {
      remainingMale: Math.max(0, totalMaleCount - allocatedMaleCount),
      remainingFemale: Math.max(0, totalFemaleCount - allocatedFemaleCount),
      allocatedMale: allocatedMaleCount,
      allocatedFemale: allocatedFemaleCount,
      totalMale: totalMaleCount,
      totalFemale: totalFemaleCount
    };
  };

  const handleIncrement = (gender) => {
    const counts = calculateRemainingCounts();
    const maxCount = gender === 'M' ? counts.remainingMale : counts.remainingFemale;
    const currentCount = gender === 'M' ? maleCount : femaleCount;
    const setCount = gender === 'M' ? setMaleCount : setFemaleCount;
    const isSelected = gender === 'M' ? isMaleSelected : isFemaleSelected;

    if (isSelected && currentCount < maxCount) {
      const newCount = currentCount + 1;
      setCount(newCount);

      const newDevotees = Array(newCount).fill(null).map((_, index) => ({
        id: `${gender.toLowerCase()}-${Date.now()}-${index}`,
        attributes: {
          gender,
          name: `${gender === 'M' ? 'Male' : 'Female'} Devotee ${index + 1}`,
          count: newCount
        }
      }));
      setSelectedGuests(newDevotees);
    }
  };

  const handleDecrement = (gender) => {
    const currentCount = gender === 'M' ? maleCount : femaleCount;
    const setCount = gender === 'M' ? setMaleCount : setFemaleCount;
    const isSelected = gender === 'M' ? isMaleSelected : isFemaleSelected;

    if (isSelected && currentCount > 1) {
      const newCount = currentCount - 1;
      setCount(newCount);

      const newDevotees = Array(newCount).fill(null).map((_, index) => ({
        id: `${gender.toLowerCase()}-${Date.now()}-${index}`,
        attributes: {
          gender,
          name: `${gender === 'M' ? 'Male' : 'Female'} Devotee ${index + 1}`,
          count: newCount
        }
      }));
      setSelectedGuests(newDevotees);
    }
  };

  const handleGenderSelection = (gender, isSelected) => {
    setMaleCount(0);
    setFemaleCount(0);
    setIsMaleSelected(false);
    setIsFemaleSelected(false);
    setSelectedGuests([]);

    if (isSelected) {
      const { remainingMale, remainingFemale } = calculateRemainingCounts();
      const maxCount = gender === 'M' ? remainingMale : remainingFemale;

      if (gender === 'M') {
        setIsMaleSelected(true);
        setMaleCount(maxCount);
        const newDevotees = Array(maxCount).fill(null).map((_, index) => ({
          id: `${gender.toLowerCase()}-${Date.now()}-${index}`,
          attributes: {
            gender,
            name: `Male Devotee ${index + 1}`,
            count: maxCount
          }
        }));
        setSelectedGuests(newDevotees);
      } else {
        setIsFemaleSelected(true);
        setFemaleCount(maxCount);
        const newDevotees = Array(maxCount).fill(null).map((_, index) => ({
          id: `${gender.toLowerCase()}-${Date.now()}-${index}`,
          attributes: {
            gender,
            name: `Female Devotee ${index + 1}`,
            count: maxCount
          }
        }));
        setSelectedGuests(newDevotees);
      }
    }
  };

  const handleClearAllocations = () => {
    setAllocatedRooms([]);
    setMaleCount(0);
    setFemaleCount(0);
    setIsMaleSelected(false);
    setIsFemaleSelected(false);
    setSelectedGuests([]);
    if (onClear) onClear();
  };

  const handleConfirmAllocations = () => {
    const { remainingMale, remainingFemale } = calculateRemainingCounts();
    if (remainingMale > 0 || remainingFemale > 0) {
      alert("Please allocate all devotees before confirming");
      return;
    }
    // console.log("Confirming allocations:", allocatedRooms);
    setShowEmailModal(true);
  };

  return (
    <div className="devotee-details">
      {showEmailModal && (
        <ConfirmDormitoryEmail
          onClose={() => setShowEmailModal(false)}
          onSend={() => {
            // Handle send logic here
            setShowEmailModal(false);
          }}
          guestData={devoteeDetails}
          requestId={id}
          allocatedGuests={guests}
          allocatedRooms={allocatedRooms}
        />
      )}

      {allocatedRooms.length > 0 && (
        <div className="allocated-guests-card">
          <h2>Allocated Guests</h2>
          <table>
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {allocatedRooms.map((room, index) => (
                <tr key={`${room.roomNumber}-${index}`}>
                  <td>{room.roomNumber}</td>
                  <td>{room.name}</td>
                  <td>{room.gender}</td>
                  <td>{room.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              disabled={calculateRemainingCounts().remainingMale > 0 || calculateRemainingCounts().remainingFemale > 0}
              title={calculateRemainingCounts().remainingMale > 0 || calculateRemainingCounts().remainingFemale > 0
                ? "Please allocate all devotees before confirming"
                : ""}
            >
              Confirm Allocation
            </button>
          </div>
        </div>
      )}

      {(calculateRemainingCounts().remainingMale > 0 || calculateRemainingCounts().remainingFemale > 0) && (
        <div className="non-allocated-guests-card">
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
              {calculateRemainingCounts().remainingMale > 0 && (
                <>
                  <tr>
                    <td>
                      <div className="guest-name-cell">
                        <input
                          type="checkbox"
                          checked={isMaleSelected}
                          onChange={(e) => handleGenderSelection('M', e.target.checked)}
                        />
                        <span className="guest-name">Devotees</span>
                      </div>
                    </td>
                    <td>M</td>
                    <td>{calculateRemainingCounts().remainingMale}</td>
                  </tr>
                  {isMaleSelected && (
                    <tr>
                      <td colSpan="3">
                        <div className="increment-control">
                          <button
                            className="decrement"
                            onClick={() => handleDecrement('M')}
                            disabled={maleCount === 0}
                          >-</button>
                          <span>{maleCount}</span>
                          <button
                            className="increment"
                            onClick={() => handleIncrement('M')}
                            disabled={maleCount >= calculateRemainingCounts().remainingMale}
                          >+</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
              {calculateRemainingCounts().remainingFemale > 0 && (
                <>
                  <tr>
                    <td>
                      <div className="guest-name-cell">
                        <input
                          type="checkbox"
                          checked={isFemaleSelected}
                          onChange={(e) => handleGenderSelection('F', e.target.checked)}
                        />
                        <span className="guest-name">Devotees</span>
                      </div>
                    </td>
                    <td>F</td>
                    <td>{calculateRemainingCounts().remainingFemale}</td>
                  </tr>
                  {isFemaleSelected && (
                    <tr>
                      <td colSpan="3">
                        <div className="increment-control">
                          <button
                            className="decrement"
                            onClick={() => handleDecrement('F')}
                            disabled={femaleCount === 0}
                          >-</button>
                          <span>{femaleCount}</span>
                          <button
                            className="increment"
                            onClick={() => handleIncrement('F')}
                            disabled={femaleCount >= calculateRemainingCounts().remainingFemale}
                          >+</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookDormitoryRoomDevoteeDetails;
