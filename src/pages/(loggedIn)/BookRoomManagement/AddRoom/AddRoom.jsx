import React, { useState } from "react";
import "./AddRoom.scss";

const AddRoom = ({ onClose }) => {
  const [blockDetails, setBlockDetails] = useState({
    blockName: "",
    numberOfRooms: "",
  });
  const [rooms, setRooms] = useState([{ roomNumber: "", beds: "" }]);
  const [errors, setErrors] = useState({});

  const validateBlockDetails = () => {
    const newErrors = {};

    // Validate block details
    if (!blockDetails.blockName.trim()) {
      newErrors.blockName = "Block name is required";
    }
    if (!blockDetails.numberOfRooms) {
      newErrors.numberOfRooms = "Number of rooms is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlockDetailsChange = (field, value) => {
    setBlockDetails({ ...blockDetails, [field]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [field]: "" });
  };

  const handleAddRoom = (e) => {
    e.preventDefault(); // Prevent default button behavior
    // First validate block details before allowing to add rooms
    if (!validateBlockDetails()) {
      // Show errors and stop
      const blockDetailsSection = document.querySelector(
        ".block-details-section"
      );
      if (blockDetailsSection) {
        blockDetailsSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setRooms([...rooms, { roomNumber: "", beds: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const newRooms = [...rooms];
    newRooms[index][field] = value;
    setRooms(newRooms);
  };

  const validateInputs = () => {
    // First validate block details
    const blockValid = validateBlockDetails();
    if (!blockValid) {
      return false;
    }

    const newErrors = { ...errors };

    // Then validate room details
    rooms.forEach((room, index) => {
      if (!room.roomNumber.trim()) {
        newErrors[`roomNumber_${index}`] = "Room number is required";
      }
      if (!room.beds) {
        newErrors[`beds_${index}`] = "Number of beds is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // First check block details
    if (!blockDetails.blockName.trim() || !blockDetails.numberOfRooms) {
      setErrors({
        ...errors,
        blockName: !blockDetails.blockName.trim()
          ? "Block name is required"
          : "",
        numberOfRooms: !blockDetails.numberOfRooms
          ? "Number of rooms is required"
          : "",
      });

      // Scroll to block details section
      const blockDetailsSection = document.querySelector(
        ".block-details-section"
      );
      if (blockDetailsSection) {
        blockDetailsSection.scrollIntoView({ behavior: "smooth" });
      }
      return; // Stop here if block details are not filled
    }

    // Then check room details
    const isValid = validateInputs();
    if (!isValid) {
      return; // Stop if validation fails
    }

    // Only proceed if all validations pass
    console.log("Form is valid", {
      blockDetails,
      rooms,
    });
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
          {/* Block Details Section */}
          <div className="block-details-section">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Block Name"
                value={blockDetails.blockName}
                onChange={(e) =>
                  handleBlockDetailsChange("blockName", e.target.value)
                }
                required // Add required attribute
              />
              {errors.blockName && (
                <span className="error-message">{errors.blockName}</span>
              )}
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder="Enter Number of Rooms"
                value={blockDetails.numberOfRooms}
                onChange={(e) =>
                  handleBlockDetailsChange("numberOfRooms", e.target.value)
                }
                required // Add required attribute
              />
              {errors.numberOfRooms && (
                <span className="error-message">{errors.numberOfRooms}</span>
              )}
            </div>
          </div>

          {/* Existing room details section */}
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
                    {errors[`roomNumber_${index}`] && (
                      <span className="error-message">
                        {errors[`roomNumber_${index}`]}
                      </span>
                    )}
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
                    {errors[`beds_${index}`] && (
                      <span className="error-message">
                        {errors[`beds_${index}`]}
                      </span>
                    )}
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
            disabled={
              !blockDetails.blockName.trim() || !blockDetails.numberOfRooms
            } // Disable button if block details are empty
          >
            Add Room{rooms.length > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
