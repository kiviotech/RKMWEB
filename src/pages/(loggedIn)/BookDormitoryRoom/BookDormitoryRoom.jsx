import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookRoomHeader from "./BookDormitoryRoomHeader/BookDormitoryRoomHeader";
import BookRoomBed from "./BookDormitoryRoomBed/BookDormitoryRoomBed";
import BookRoomDevoteeDetails from "./BookDormitoryRoomDevoteeDetails/BookDormitoryRoomDevoteeDetails";

const BookDormitoryRoom = () => {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [viewMode, setViewMode] = useState("dashboard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();
  const [selectedGuests, setSelectedGuests] = useState([]);

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

  // Add function to handle room allocation
  const handleRoomAllocation = (roomNumber, date) => {
    // This will be passed down to both components
    console.log("Allocating room:", roomNumber, "for guests:", selectedGuests, "on date:", date);
    // You'll implement the actual allocation API call here
  };

  // Add handler for clear action
  const handleClear = () => {
    setRefreshTrigger(prev => prev + 1);
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
            setSelectedGuests={setSelectedGuests}
            refreshTrigger={refreshTrigger}
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomDevoteeDetails
            id={location.state?.requestId}
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
};

export default BookDormitoryRoom;
