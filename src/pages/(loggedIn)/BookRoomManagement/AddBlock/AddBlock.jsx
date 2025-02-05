import React, { useState } from "react";
import "./AddBlock.scss";
import { createNewRoom } from "../../../../../services/src/services/roomService";
import { createNewBlock } from "../../../../../services/src/services/blockService";
import { toast } from "react-toastify";

const AddBlock = ({ onClose, onBlockCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [blockData, setBlockData] = useState({
    blockName: "",
    numberOfRooms: "",
    rooms: [],
  });

  const handleNext = async () => {
    if (currentStep === 1) {
      // Initialize rooms array with empty values based on numberOfRooms
      const initialRooms = Array(parseInt(blockData.numberOfRooms) || 0)
        .fill()
        .map(() => ({ roomNumber: "", numberOfBeds: "" }));

      setBlockData((prev) => ({
        ...prev,
        rooms: initialRooms,
      }));
      setCurrentStep(2);
    } else {
      try {
        // Create rooms sequentially and collect their IDs
        const createdRoomIds = [];
        for (const room of blockData.rooms) {
          const response = await createNewRoom({
            room_number: room.roomNumber,
            no_of_beds: room.numberOfBeds,
            block_name: blockData.blockName,
          });
          createdRoomIds.push(response.data.id);
        }

        // Create the block with the collected room IDs
        await createNewBlock({
          block_name: blockData.blockName,
          rooms: createdRoomIds,
        });

        toast.success("Block and rooms created successfully!");
        onBlockCreated(); // Call the refresh function
        onClose(); // Close the modal after successful creation
      } catch (error) {
        toast.error("Failed to create block and rooms. Please try again.");
        console.error("Error creating block and rooms:", error);
      }
    }
  };

  const handleInputChange = (index, field, value) => {
    const newRooms = [...blockData.rooms];
    newRooms[index][field] = value;
    setBlockData((prev) => ({
      ...prev,
      rooms: newRooms,
    }));
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="add-block-overlay">
      <div
        className={`add-block-content ${
          currentStep === 1 ? "add-block-step" : "room-details-step"
        }`}
      >
        <div className="add-block-header">
          <h2>{currentStep === 1 ? "Add Block" : "Room Details"}</h2>
          <button className="add-block-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {currentStep === 1 ? (
          <div className="add-block-body">
            <div className="add-block-input-group">
              <label className="room-number-label">Block Name</label>
              <input
                type="text"
                placeholder="Enter the Block Name"
                value={blockData.blockName}
                onChange={(e) =>
                  setBlockData({ ...blockData, blockName: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              />
            </div>

            <div
              className="add-block-input-group"
              style={{ marginTop: "20px" }}
            >
              <label className="room-number-label">Number of Rooms</label>
              <input
                type="number"
                placeholder="Enter the no. of rooms"
                value={blockData.numberOfRooms}
                onChange={(e) =>
                  setBlockData({ ...blockData, numberOfRooms: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              />
            </div>
          </div>
        ) : (
          <div
            className="add-block-body"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "20px 40px 0px",
            }}
          >
            {blockData.rooms.map((room, index) => (
              <div key={index}>
                <div className="room-number-label">Room {index + 1}</div>
                <div className="room-inputs-container">
                  <input
                    type="text"
                    placeholder="Enter the room number"
                    value={room.roomNumber}
                    onChange={(e) =>
                      handleInputChange(index, "roomNumber", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Enter the no. of beds"
                    value={room.numberOfBeds}
                    onChange={(e) =>
                      handleInputChange(index, "numberOfBeds", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="add-block-footer">
          <div className="footer-left">
            <button className="add-block-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
          <div className="footer-right">
            {currentStep === 2 && (
              <button className="add-block-back-btn" onClick={handleBack}>
                Back
              </button>
            )}
            <button className="add-block-next-btn" onClick={handleNext}>
              {currentStep === 1 ? "Next" : "Add Block"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlock;
