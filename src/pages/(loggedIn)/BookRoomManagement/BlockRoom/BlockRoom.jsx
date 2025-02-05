import React, { useEffect, useState } from "react";
import * as blockService from "../../../../../services/src/services/blockService";
import * as roomBlockingService from "../../../../../services/src/services/roomBlockingService";
import { toast } from "react-toastify";

const BlockRoom = ({ selectedBlockId }) => {
  const [rooms, setRooms] = useState([]);

  const [formData, setFormData] = useState({
    roomId: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const blockingData = {
        room: formData.roomId,
        reason_for_blocking: formData.reason,
        room_block_status: "blocked",
        from_date: formData.fromDate,
        to_date: formData.toDate,
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
    } catch (error) {
      console.error("Error blocking room:", error);
      toast.error("Failed to block room. Please try again.");
    }
  };

  return (
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
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="Enter reason"
          required
        />
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

      <button type="submit" className="booking-submit-btn">
        Block Room
      </button>
    </form>
  );
};

export default BlockRoom;
