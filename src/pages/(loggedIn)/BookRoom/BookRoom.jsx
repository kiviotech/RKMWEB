import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookRoomHeader from "./BookRoomHeader/BookRoomHeader";
import BookRoomBed from "./BookRoomBed/BookRoomBed";
import BookRoomDevoteeDetails from "./BookRoomDevoteeDetails/BookRoomDevoteeDetails";

const BookRoom = () => {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [viewMode, setViewMode] = useState("dashboard");
  const location = useLocation();
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Log the navigation state
    console.log("BookRoom navigation state:", location.state);
  }, [location]);

  const handleBlockSelect = (blockId) => {
    setSelectedBlockId(blockId);
  };

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  // Modify handleRoomAllocation to include roomId
  const handleRoomAllocation = (roomNumber, dates) => {
    if (dates.guest) {
      // Dispatch custom event for single guest room allocation
      const event = new CustomEvent('roomAllocated', {
        detail: { 
          roomNumber, 
          dates: {
            startDate: dates.startDate,
            endDate: dates.endDate
          },
          guestId: dates.guest.id,
          roomId: dates.roomId  // Add the roomId here
        }
      });
      window.dispatchEvent(event);
      
      // Remove the allocated guest from selectedGuests
      setSelectedGuests(prev => prev.filter(g => g.id !== dates.guest.id));
      
      console.log("Allocating room:", roomNumber, "with ID:", dates.roomId, "for guest:", dates.guest);
    }
  };

  return (
    <div>
      <BookRoomHeader
        onBlockSelect={handleBlockSelect}
        arrivalDate={location.state?.arrivalDate}
        departureDate={location.state?.departureDate}
        onViewChange={handleViewChange}
      />
      <div style={{ display: "flex" }}>
        <div style={{ width: "70%" }}>
          <BookRoomBed
            blockId={selectedBlockId}
            arrivalDate={location.state?.arrivalDate}
            departureDate={location.state?.departureDate}
            viewMode={viewMode}
            onRoomSelect={handleRoomAllocation}
            selectedGuests={selectedGuests}
            refreshTrigger={refreshTrigger}
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomDevoteeDetails
            id={location.state?.requestId}
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
            onClear={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
