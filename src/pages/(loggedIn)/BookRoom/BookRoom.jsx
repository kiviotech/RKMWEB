import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookRoomHeader from "./BookRoomHeader/BookRoomHeader";
import BookRoomBed from "./BookRoomBed/BookRoomBed";
import BookRoomDevoteeDetails from "./BookRoomDevoteeDetails/BookRoomDevoteeDetails";

const BookRoom = () => {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [allocationBlockId, setAllocationBlockId] = useState(null);
  const [selectedGuestCount, setSelectedGuestCount] = useState(0);
  const [allocatedRoomNumber, setAllocatedRoomNumber] = useState(null);
  const [allocatedRoomId, setAllocatedRoomId] = useState(null);
  const [allocatedRooms, setAllocatedRooms] = useState([]);
  const location = useLocation();
  const requestId = location.state?.requestId;
  const arrivalDate = location.state?.arrivalDate;
  const departureDate = location.state?.departureDate;
  const [viewMode, setViewMode] = useState("dashboard");

  useEffect(() => {
    console.log("BookRoom received dates:", { arrivalDate, departureDate });
  }, [arrivalDate, departureDate]);

  const handleBlockSelect = (blockId) => {
    setSelectedBlockId(blockId);
  };

  const handleAllocate = (arrivalDate, departureDate, guestCount) => {
    console.log("Allocation dates:", arrivalDate, departureDate);

    // Use the date strings directly without creating Date objects
    setSelectedDateRange({
      arrivalDate: arrivalDate,
      departureDate: departureDate,
    });
    setAllocationBlockId(selectedBlockId);
    setSelectedGuestCount(guestCount);
  };

  const handleRoomAllocation = (roomAllocations) => {
    console.log("Rooms allocated:", roomAllocations);
    setAllocatedRooms(roomAllocations);
  };

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  return (
    <div>
      <BookRoomHeader
        onBlockSelect={handleBlockSelect}
        arrivalDate={arrivalDate}
        departureDate={departureDate}
        onViewChange={handleViewChange}
      />
      <div style={{ display: "flex" }}>
        <div style={{ width: "70%" }}>
          <BookRoomBed
            blockId={selectedBlockId}
            arrivalDate={arrivalDate}
            departureDate={departureDate}
            selectedDateRange={
              selectedBlockId === allocationBlockId ? selectedDateRange : null
            }
            numberOfBedsToAllocate={
              selectedBlockId === allocationBlockId ? selectedGuestCount : 0
            }
            onRoomAllocation={handleRoomAllocation}
            viewMode={viewMode}
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomDevoteeDetails
            requestId={requestId}
            onAllocate={handleAllocate}
            allocatedRooms={allocatedRooms}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
