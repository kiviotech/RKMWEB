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
    // console.log("BookRoom received dates:", { arrivalDate, departureDate });
  }, [arrivalDate, departureDate]);

  const handleBlockSelect = (blockId) => {
    setSelectedBlockId(blockId);
  };

  const handleAllocate = (
    arrivalDate,
    departureDate,
    guestCount,
    genderCounts = null
  ) => {
    console.log("Allocation request:", {
      arrivalDate,
      departureDate,
      guestCount,
      genderCounts,
    });
    setSelectedDateRange({
      arrivalDate: arrivalDate,
      departureDate: departureDate,
    });
    setAllocationBlockId(selectedBlockId);
    setSelectedGuestCount(parseInt(guestCount, 10));
  };

  const handleRoomAllocation = (roomAllocations) => {
    console.log("Room allocations in BookRoom:", roomAllocations);
    if (Array.isArray(roomAllocations) && roomAllocations.length > 0) {
      const formattedRooms = roomAllocations.map((room) => ({
        roomId: room.roomId,
        id: room.roomId,
        roomNumber: room.roomNumber,
        bedsAllocated: room.bedsSelected || room.bedsAllocated || 0,
        totalBeds: room.totalBeds || 0,
      }));
      console.log("Formatted rooms:", formattedRooms);
      setAllocatedRooms(formattedRooms);
    }
  };

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  const handleAllocatedGuestSelect = (guest) => {
    // Update the number of beds to allocate
    const updatedGuestCount = selectedGuestCount - 1;
    setSelectedGuestCount(updatedGuestCount);

    // Update the allocation with the new guest count
    handleAllocate(arrivalDate, departureDate, updatedGuestCount);
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
            numberOfBedsToAllocate={selectedGuestCount}
            onRoomAllocation={handleRoomAllocation}
            viewMode={viewMode}
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomDevoteeDetails
            requestId={requestId}
            onAllocate={handleAllocate}
            allocatedRooms={allocatedRooms}
            onGuestUncheck={handleAllocatedGuestSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
