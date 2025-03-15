import React, { useState } from "react";
import BookRoomManagementHeader from "./BookRoomManagementHeader/BookRoomManagementHeader";
import BookRoomManagementBed from "./BookRoomManagementBed/BookRoomManagementBed";
import BookRoomManagementSetting from "./BookRoomManagementSetting/BookRoomManagementSetting";

const BookRoomManagement = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [viewMode, setViewMode] = useState("dashboard");
  const [selectedGuestDetails, setSelectedGuestDetails] = useState(null);
  const [allocatedGuestCount, setAllocatedGuestCount] = useState(0);

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

  const handleGuestClick = (guestDetails) => {
    setSelectedGuestDetails(guestDetails);
    if (guestDetails) {
      setAllocatedGuestCount(0);
    }
  };

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
          />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomManagementSetting
            onBlockCreated={handleRefresh}
            selectedBlockId={selectedBlockId}
            onRoomAdded={handleRefresh}
            onRoomAllocated={handleRefresh}
            guestDetails={selectedGuestDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoomManagement;
