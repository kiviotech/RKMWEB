import React, { useState } from "react";
import BookRoomManagementHeader from "./BookRoomManagementHeader/BookRoomManagementHeader";
import BookRoomManagementBed from "./BookRoomManagementBed/BookRoomManagementBed";
import BookRoomManagementSetting from "./BookRoomManagementSetting/BookRoomManagementSetting";

const BookRoomManagement = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBlockCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <BookRoomManagementHeader refreshTrigger={refreshTrigger} />
      <div style={{ display: "flex" }}>
        <div style={{ width: "70%" }}>
          <BookRoomManagementBed />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomManagementSetting onBlockCreated={handleBlockCreated} />
        </div>
      </div>
    </div>
  );
};

export default BookRoomManagement;
