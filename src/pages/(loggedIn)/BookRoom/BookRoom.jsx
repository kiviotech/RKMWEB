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
  const [selectedBedForGuest, setSelectedBedForGuest] = useState(null);

  useEffect(() => {
    if (requestId) {
      setSelectedGuestCount(location.state?.guestCount || 0);
    }
  }, [requestId, location.state]);

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

    // Ensure dates are in YYYY-MM-DD format
    setSelectedDateRange({
      arrivalDate: new Date(arrivalDate).toISOString().split("T")[0],
      departureDate: new Date(departureDate).toISOString().split("T")[0],
    });
    setAllocationBlockId(selectedBlockId);

    // Update the guest count
    const newGuestCount = genderCounts
      ? genderCounts.male + genderCounts.female
      : parseInt(guestCount, 10);
    console.log("Setting new guest count:", newGuestCount);
    setSelectedGuestCount(newGuestCount);
  };

  const handleRoomAllocation = (roomAllocations) => {
    // console.log("Room allocations in BookRoom:", roomAllocations);
    if (Array.isArray(roomAllocations) && roomAllocations.length > 0) {
      const formattedRooms = roomAllocations.map((room) => ({
        roomId: room.roomId,
        id: room.roomId,
        roomNumber: room.roomNumber,
        bedsAllocated: room.bedsSelected || room.bedsAllocated || 0,
        totalBeds: room.totalBeds || 0,
      }));
      // console.log("Formatted rooms:", formattedRooms);
      setAllocatedRooms(formattedRooms);
    }
  };

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  const handleAllocatedGuestSelect = (guest, clearAll = false) => {
    if (clearAll) {
      // Reset all bed selections
      setSelectedGuestCount(0);
      setSelectedBedForGuest(null);
      // Reset date range to trigger bed icon refresh
      const currentDateRange = {
        arrivalDate: arrivalDate,
        departureDate: departureDate,
      };
      handleAllocate(arrivalDate, departureDate, 0);
    } else {
      // Existing single guest uncheck logic
      const updatedGuestCount = selectedGuestCount - 1;
      setSelectedGuestCount(updatedGuestCount);
      handleAllocate(arrivalDate, departureDate, updatedGuestCount);
    }
  };

  const handleBedSelection = (bedInfo) => {
    setSelectedBedForGuest(bedInfo);
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
            selectedDateRange={{
              arrivalDate: arrivalDate || "",
              departureDate: departureDate || "",
            }}
            numberOfBedsToAllocate={selectedGuestCount}
            onRoomAllocation={handleRoomAllocation}
            viewMode={viewMode}
            onBedSelect={handleBedSelection}
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomDevoteeDetails
            requestId={requestId}
            onAllocate={handleAllocate}
            allocatedRooms={allocatedRooms}
            onGuestUncheck={handleAllocatedGuestSelect}
            selectedBedForGuest={selectedBedForGuest}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
