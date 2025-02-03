import React from "react";
import BookRoomManagementHeader from "./BookRoomManagementHeader/BookRoomManagementHeader";
import BookRoomManagementBed from "./BookRoomManagementBed/BookRoomManagementBed";
import BookRoomManagementSetting from "./BookRoomManagementSetting/BookRoomManagement";

const BookRoomManagement = () => {
  return (
    <div>
      <BookRoomManagementHeader />
      <div style={{ display: "flex" }}>
        <div style={{ width: "70%" }}>
          <BookRoomManagementBed />
        </div>
        <div style={{ width: "30%" }}>
          <BookRoomManagementSetting />
        </div>
      </div>
    </div>
  );
};

export default BookRoomManagement;
