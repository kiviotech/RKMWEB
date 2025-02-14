import React, { useEffect, useState } from "react";
import * as blockService from "../../../../../services/src/services/blockService";
import * as bookingRequestService from "../../../../../services/src/services/bookingRequestService";
import * as guestDetailsService from "../../../../../services/src/services/guestDetailsService";
import * as roomAllocationService from "../../../../../services/src/services/roomAllocationService";
import { toast } from "react-toastify";

const BookRoom = ({ selectedBlockId, onRoomAllocated }) => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "",
    phoneNumber: "",
    roomId: "",
    bookingType: "",
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

  // Add function to get max allowed arrival date (90 days from today)
  const getMaxArrivalDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);
    return maxDate.toISOString().split("T")[0];
  };

  // Add function to get max allowed departure date
  const getMaxDepartureDate = (fromDate) => {
    if (!fromDate) return null;
    const date = new Date(fromDate);
    date.setDate(date.getDate() + 3); // Max 3 nights stay
    return date.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for fromDate changes
    if (name === "fromDate") {
      // Update departure date when arrival date changes
      const newFromDate = new Date(value);
      if (!isNaN(newFromDate.getTime())) {
        // Reset toDate when fromDate changes
        setFormData({
          ...formData,
          fromDate: value,
          toDate: "", // Reset toDate
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create booking request
      const bookingData = {
        name: formData.guestName,
        phone_number: formData.phoneNumber,
        arrival_date: formData.fromDate,
        departure_date: formData.toDate,
        room: formData.roomId,
        status: "confirmed",
      };

      const bookingResponse =
        await bookingRequestService.createNewBookingRequest(bookingData);

      // Create guest details with the booking request ID
      const guestData = {
        name: formData.guestName,
        phone_number: formData.phoneNumber,
        arrival_date: formData.fromDate,
        departure_date: formData.toDate,
        status: "pending",
        relationship: "applicant",
        booking_request: bookingResponse.data.id,
      };

      const guestResponse = await guestDetailsService.createNewGuestDetails(
        guestData
      );

      // Create room allocation
      const roomAllocationData = {
        room_status: "allocated",
        guests: guestResponse.data.id,
        booking_request: bookingResponse.data.id,
        room: formData.roomId,
      };

      await roomAllocationService.createNewRoomAllocation(roomAllocationData);

      // Clear form after successful submission
      setFormData({
        guestName: "",
        phoneNumber: "",
        roomId: "",
        bookingType: "",
        fromDate: "",
        toDate: "",
      });

      // Call the refresh handler
      if (onRoomAllocated) {
        onRoomAllocated();
      }

      toast.success(
        "Booking, guest details, and room allocation created successfully!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error(
        "Error creating booking, guest details, and room allocation:",
        error
      );
      toast.error("Failed to create booking. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form-container">
      <div className="booking-input-group">
        <label>Guest Name</label>
        <input
          type="text"
          name="guestName"
          value={formData.guestName}
          onChange={handleInputChange}
          placeholder="Enter the Full Name"
        />
      </div>

      <div className="booking-input-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </div>

      <div className="booking-input-group">
        <label>Room Number</label>
        <select
          name="roomId"
          value={formData.roomId}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Select the room number
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.attributes.room_number}
            </option>
          ))}
        </select>
      </div>

      <div className="booking-input-group">
        <label>Booking type</label>
        <select defaultValue="">
          <option value="" disabled>
            Select the booking type
          </option>
        </select>
      </div>

      <div className="booking-input-group">
        <label>From Date</label>
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleInputChange}
          min={new Date().toISOString().split("T")[0]}
          max={getMaxArrivalDate()}
          placeholder="dd-mm-yyyy"
        />
      </div>

      <div className="booking-input-group">
        <label>Departure Date</label>
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleInputChange}
          min={formData.fromDate || ""}
          max={formData.fromDate ? getMaxDepartureDate(formData.fromDate) : ""}
          placeholder="dd-mm-yyyy"
        />
      </div>

      <button type="submit" className="booking-submit-btn">
        Book Room
      </button>
    </form>
  );
};

export default BookRoom;
