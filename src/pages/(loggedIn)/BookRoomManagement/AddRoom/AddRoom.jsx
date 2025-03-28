import React, { useState, useEffect } from "react";
import { createNewRoom } from "../../../../../services/src/services/roomService";
import {
  updateBlockById,
  fetchBlockById,
} from "../../../../../services/src/services/blockService";
import { toast } from "react-toastify";
import "./AddRoom.scss";

const AddRoom = ({ onClose, selectedBlockId, onRoomAdded }) => {
  const [rooms, setRooms] = useState([{ roomNumber: "", beds: "", roomType: "" }]);

  const handleAddRoom = (e) => {
    e.preventDefault();
    setRooms([...rooms, { roomNumber: "", beds: "", roomType: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const newRooms = [...rooms];
    newRooms[index][field] = value;
    setRooms(newRooms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all room details before proceeding
    const emptyRooms = rooms.findIndex(
      (room) => !room.roomNumber.trim() || !room.beds || !room.roomType
    );

    if (emptyRooms !== -1) {
      toast.error(`Please fill all details for Room ${emptyRooms + 1}`);
      return;
    }

    try {
      // Get current block data to preserve existing room IDs
      const currentBlock = await fetchBlockById(selectedBlockId);
      const existingRoomIds =
        currentBlock.data.attributes.rooms?.data?.map((room) => room.id) || [];

      // Create all new rooms and collect their IDs
      const newRoomIds = [];
      for (const room of rooms) {
        const response = await createNewRoom({
          room_number: room.roomNumber,
          no_of_beds: parseInt(room.beds),
          room_type: room.roomType,
          blockId: selectedBlockId,
        });
        const roomId = response.data.id;
        newRoomIds.push(roomId);
      }

      // Combine existing and new room IDs
      const updatedRoomIds = [...existingRoomIds, ...newRoomIds];

      // Update block with the combined room IDs
      await updateBlockById(selectedBlockId, {
        data: {
          rooms: updatedRoomIds,
        },
      });

      toast.success(
        `Successfully added ${rooms.length} room${rooms.length > 1 ? "s" : ""}`
      );
      onRoomAdded?.();
      onClose();
    } catch (error) {
      toast.error("Failed to create rooms. Please try again.");
      // console.error("Error creating rooms:", error);
    }
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
                      required
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
                      required
                      min="1"
                      onChange={(e) =>
                        handleInputChange(index, "beds", e.target.value)
                      }
                    />
                  </div>
                  <div className="input-group">
                    <select
                      value={room.roomType}
                      onChange={(e) =>
                        handleInputChange(index, "roomType", e.target.value)
                      }
                      required
                      className="room-type-select"
                    >
                      <option value="" disabled>Select Room type</option>
                      <option value="AC">AC</option>
                      <option value="NON-AC">Non-AC</option>
                    </select>
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
