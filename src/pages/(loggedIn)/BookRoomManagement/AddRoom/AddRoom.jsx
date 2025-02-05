import React, { useState } from "react";
import "./AddRoom.scss";

const AddRoom = ({ onClose }) => {
  const [rooms, setRooms] = useState([{ roomNumber: "", beds: "" }]);

  const handleAddRoom = (e) => {
    e.preventDefault();
    setRooms([...rooms, { roomNumber: "", beds: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const newRooms = [...rooms];
    newRooms[index][field] = value;
    setRooms(newRooms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", { rooms });
    // Add your submission logic here
  };

  return (
    <div className="add-block-overlay">
      <div className="add-block-content room-details-step">
        <div className="add-block-header">
          <h2>Add Rooms</h2>
          <button className="add-block-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="add-block-body">
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "20px 0px 0px",
            }}
          >
            {rooms.map((room, index) => (
              <div key={index} data-room-index={index}>
                <div className="room-number-label">Room {index + 1}</div>
                <div className="room-inputs-container">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter the room number"
                      value={room.roomNumber}
                      onChange={(e) =>
                        handleInputChange(index, "roomNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      placeholder="Enter the no. of beds"
                      value={room.beds}
                      onChange={(e) =>
                        handleInputChange(index, "beds", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="add-more-room-btn" onClick={handleAddRoom}>
            + Add Room
          </button>
        </div>

        <div className="add-block-footer">
          <button
            className="add-block-next-btn full-width"
            onClick={handleSubmit}
          >
            Add Room{rooms.length > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
