import React, { useState, useEffect } from "react";
import "./BookDormitoryRoomBed.scss";

const BookDormitoryRoomBed = ({
  blockId,
  arrivalDate,
  departureDate,
  viewMode,
  onRoomSelect,
  selectedGuests,
  setSelectedGuests,
  refreshTrigger,
  roomType
}) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomAvailabilities, setRoomAvailabilities] = useState({}); // { [roomId]: bedsAvailable }

  useEffect(() => {
    if (blockId) {
      fetchAvailableRooms();
    }
  }, [blockId, arrivalDate, departureDate, viewMode, refreshTrigger, roomType]);

  const fetchAvailableRooms = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to fetch rooms for the block
      const mockRooms = [
        { id: 1, roomNumber: "101", type: "AC", capacity: 2 },
        { id: 2, roomNumber: "102", type: "Non-AC", capacity: 4 },
        { id: 3, roomNumber: "103", type: "AC", capacity: 2 },
        { id: 4, roomNumber: "104", type: "Non-AC", capacity: 3 },
      ];
      // Filter based on room type if specified
      const filteredRooms = roomType 
        ? mockRooms.filter(room => room.type === roomType)
        : mockRooms;
      setAvailableRooms(filteredRooms);
      // Fetch availability for each room
      const availabilities = {};
      await Promise.all(filteredRooms.map(async (room) => {
        try {
          const res = await apiClient.get(`/rooms/${room.id}/availability`, {
            params: { start: arrivalDate, end: departureDate }
          });
          // Store the full API response for each room
          availabilities[room.id] = res.data;
        } catch (e) {
          availabilities[room.id] = { bedsAvailable: 0, totalBeds: 0, bedsAllocated: 0 };
        }
      }));
      setRoomAvailabilities(availabilities);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleRoomClick = (room) => {
    if (!roomAvailabilities[room.id] || roomAvailabilities[room.id] <= 0) return;
    setSelectedRoom(room);
    // Call the parent component's handler
    onRoomSelect(room.roomNumber, arrivalDate);
  };


  if (loading) {
    return <div className="loading">Loading available rooms...</div>;
  }

  if (!blockId) {
    return <div className="select-block-prompt">Please select a block to view available rooms</div>;
  }

  return (
    <div className="book-dormitory-room-bed">
      <h3>Available Rooms in Block {blockId}</h3>
      
      {viewMode === "dashboard" ? (
        <div className="room-grid">
          {availableRooms.map(room => {
            const availability = roomAvailabilities[room.id] || {};
            const bedsAvailable = availability.bedsAvailable;
            const totalBeds = availability.totalBeds;
            return (
              <div 
                key={room.id} 
                className={`room-card ${(bedsAvailable <= 0) ? 'unavailable' : ''} ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                onClick={() => handleRoomClick(room)}
              >
                <div className="room-number">{room.roomNumber}</div>
                <div className="room-type">{room.type}</div>
                <div className="room-capacity">Capacity: {room.capacity}</div>
                <div className="room-status">
                  {typeof bedsAvailable === 'number' ?
                    (bedsAvailable > 0 ? `${bedsAvailable} of ${totalBeds} beds available` : 'Fully booked')
                    : 'Checking...'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="room-list">
          <table>
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableRooms.map(room => {
                const availability = roomAvailabilities[room.id] || {};
                const bedsAvailable = availability.bedsAvailable;
                const totalBeds = availability.totalBeds;
                return (
                  <tr key={room.id} className={bedsAvailable <= 0 ? 'unavailable' : ''}>
                    <td>{room.roomNumber}</td>
                    <td>{room.type}</td>
                    <td>{room.capacity}</td>
                    <td>{typeof bedsAvailable === 'number' ? (bedsAvailable > 0 ? `${bedsAvailable} of ${totalBeds} beds available` : 'Fully booked') : 'Checking...'}</td>
                    <td>
                      {bedsAvailable > 0 && (
                        <button 
                          onClick={() => handleRoomClick(room)}
                          className={selectedRoom?.id === room.id ? 'selected' : ''}
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {availableRooms.length === 0 && !loading && (
        <div className="no-rooms">No rooms available matching your criteria</div>
      )}
    </div>
  );
};

export default BookDormitoryRoomBed;
