import React, { useState, useEffect } from "react";
import BookRoomManagementHeader from "./BookRoomManagementHeader/BookRoomManagementHeader";
import BookRoomManagementBed from "./BookRoomManagementBed/BookRoomManagementBed";
import BookRoomManagementSetting from "./BookRoomManagementSetting/BookRoomManagementSetting";

const BookRoomManagement = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [viewMode, setViewMode] = useState("dashboard");
  const [selectedGuestDetails, setSelectedGuestDetails] = useState(null);
  const [allocatedGuestCount, setAllocatedGuestCount] = useState(0);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [totalGuestCount, setTotalGuestCount] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBlockCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRoomAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBlockSelect = (blockId) => {
    setSelectedBlockId(blockId);
  };

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  const handleRoomSelect = (roomNumber, details) => {
    console.log('Selected room:', roomNumber, details);
    setSelectedRooms(prev => [...prev, {
      roomNumber,
      guestName: details.guest?.name,
      arrivalDate: details.startDate,
      departureDate: details.endDate
    }]);
  };

  const clearRoomSelections = () => {
    setSelectedRooms([]);
  };

  const handleGuestClick = (guestDetails) => {
    setSelectedGuestDetails(guestDetails);
    if (guestDetails) {
      setAllocatedGuestCount(0);
      clearRoomSelections();
    }
  };

  useEffect(() => {
    if (selectedGuestDetails?.guests) {
      setTotalGuestCount(selectedGuestDetails.guests.length);
      setArrivalDate(selectedGuestDetails.guests[0].arrivalDate);
      setDepartureDate(selectedGuestDetails.guests[0].departureDate);
    }
  }, [selectedGuestDetails]);

  return (
    <div>
      <BookRoomManagementHeader
        refreshTrigger={refreshTrigger}
        onBlockSelect={handleBlockSelect}
        onViewChange={handleViewChange}
      />
      <div style={{ display: "flex" }}>
        <div style={{ width: "70%" }}>
          <BookRoomManagementBed
            blockId={selectedBlockId}
            refreshTrigger={refreshTrigger}
            viewMode={viewMode}
            onGuestClick={handleGuestClick}
            arrivalDate={arrivalDate}
            departureDate={departureDate}
            onRoomSelect={handleRoomSelect}
            selectedGuests={selectedGuestDetails?.guests}
            maxSelections={totalGuestCount}
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomManagementSetting
            onBlockCreated={handleRefresh}
            selectedBlockId={selectedBlockId}
            onRoomAdded={handleRefresh}
            onRoomAllocated={handleRefresh}
            guestDetails={selectedGuestDetails}
            selectedRooms={selectedRooms}
            onClearSelections={clearRoomSelections}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoomManagement;
