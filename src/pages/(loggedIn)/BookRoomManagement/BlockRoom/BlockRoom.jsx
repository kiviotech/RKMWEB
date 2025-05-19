import React, { useEffect, useState } from "react";
import * as blockService from "../../../../../services/src/services/blockService";
import * as roomBlockingService from "../../../../../services/src/services/roomBlockingService";
import { toast } from "react-toastify";
import "./BlockRoom.scss"; // Make sure to create this SCSS file if it doesn't exist

// Default color mappings - in a real app, these would be loaded from settings or localStorage
const DEFAULT_COLOR_MAPPINGS = {
  "Maintenance": "#FFCDD2", // Light red
  "Secretary Maharaji Request": "#BBDEFB", // Light blue
  "Hospital/ Dispensary": "#C8E6C9", // Light green
  "Special Guests": "#FFECB3", // Light amber
  "Cleaning": "#E1BEE7", // Light purple
};

const BlockRoom = ({ selectedBlockId, onRoomBlocked }) => {
  const [rooms, setRooms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Load color preferences from localStorage or use defaults
  const [colorMappings, setColorMappings] = useState(() => {
    const savedMappings = localStorage.getItem('roomBlockingColorMappings');
    return savedMappings ? JSON.parse(savedMappings) : DEFAULT_COLOR_MAPPINGS;
  });
  const [showColorSettings, setShowColorSettings] = useState(false);

  const reasons = Object.keys(colorMappings);

  const [formData, setFormData] = useState({
    roomId: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });

  // Update the view when reason changes to display the correct color
  useEffect(() => {
    // This will only update the preview, the actual color is stored in mappings
    console.log(`Selected reason: ${formData.reason}, Color: ${formData.reason ? colorMappings[formData.reason] : 'none'}`);
  }, [formData.reason, colorMappings]);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (selectedBlockId) {
        try {
          const response = await blockService.fetchBlockById(selectedBlockId);
          const blockRooms = response.data.attributes.rooms.data || [];
          setRooms(blockRooms);
        } catch (error) {
          console.error("Error fetching block details:", error);
        }
      }
    };

    fetchBlockDetails();
  }, [selectedBlockId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update a specific color in the mappings
  const handleColorChange = (reason, color) => {
    const updatedMappings = {
      ...colorMappings,
      [reason]: color
    };
    setColorMappings(updatedMappings);
    
    // Save to localStorage for persistence
    localStorage.setItem('roomBlockingColorMappings', JSON.stringify(updatedMappings));
  };

  // Reset colors to defaults
  const resetColorMappings = () => {
    setColorMappings(DEFAULT_COLOR_MAPPINGS);
    localStorage.setItem('roomBlockingColorMappings', JSON.stringify(DEFAULT_COLOR_MAPPINGS));
    toast.success("Color settings have been reset to defaults");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Get the color for the selected reason
      const blockColor = formData.reason ? colorMappings[formData.reason] : "#FFCDD2";
      
      const blockingData = {
        room: formData.roomId,
        room_block: formData.reason,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        block_color: blockColor, // Use the color associated with the reason
      };

      await roomBlockingService.createNewRoomBlocking(blockingData);
      toast.success("Room blocked successfully!");

      // Reset form
      setFormData({
        roomId: "",
        reason: "",
        fromDate: "",
        toDate: "",
      });

      // Trigger refresh of BookRoomManagementBed
      if (onRoomBlocked) {
        onRoomBlocked();
      }
    } catch (error) {
      toast.error("Failed to block room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="block-room-container">
      {/* Toggle button for color settings */}
      <div className="color-settings-toggle">
        <button 
          type="button" 
          className="toggle-settings-btn"
          onClick={() => setShowColorSettings(!showColorSettings)}
        >
          {showColorSettings ? "Hide Color Settings" : "Configure Block Colors"}
        </button>
      </div>

      {/* Color settings panel */}
      {showColorSettings && (
        <div className="color-settings-panel">
          <h3>Block Color Settings</h3>
          <p>Configure colors for different blocking reasons</p>
          
          <div className="color-mappings-list">
            {Object.entries(colorMappings).map(([reason, color]) => (
              <div key={reason} className="color-mapping-item">
                <span className="reason-label">{reason}</span>
                <div className="color-setting">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(reason, e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-preview" style={{ backgroundColor: color }}>
                    {color}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            type="button" 
            className="reset-colors-btn"
            onClick={resetColorMappings}
          >
            Reset to Default Colors
          </button>
        </div>
      )}

      <form className="booking-form-container" onSubmit={handleSubmit}>
        <div className="booking-input-group">
          <label>Room Number</label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select Room
            </option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.attributes.room_number}
              </option>
            ))}
          </select>
        </div>

        <div className="booking-input-group">
          <label>Reason</label>
          <select
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Select Reason"
            required
          >
            <option value="" disabled>
              Select Reason
            </option>
            {reasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="booking-input-group">
          <label>From Date</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="booking-input-group">
          <label>Departure Date</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleInputChange}
            required
          />
        </div>

        {formData.reason && (
          <div className="booking-preview">
            <h4>Blocking Preview</h4>
            <div 
              className="room-block-preview" 
              style={{ 
                backgroundColor: colorMappings[formData.reason],
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '10px'
              }}
            >
              {formData.reason} 
              <div className="preview-dates">
                {formData.fromDate && formData.toDate ? 
                  `${new Date(formData.fromDate).toLocaleDateString()} - ${new Date(formData.toDate).toLocaleDateString()}` : 
                  'Date Range'}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="booking-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Blocking..." : "Block Room"}
        </button>
      </form>
    </div>
  );
};

export default BlockRoom;
