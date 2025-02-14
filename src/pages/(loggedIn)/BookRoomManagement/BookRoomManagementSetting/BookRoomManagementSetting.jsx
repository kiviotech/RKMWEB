import React, { useState } from "react";
import BlockRoom from "../BlockRoom/BlockRoom";
import BookRoom from "../BookRoom/BookRoom";
import AddBlock from "../AddBlock/AddBlock";
import AddRoom from "../AddRoom/AddRoom";
import "./BookRoomManagementSetting.scss";

const BookRoomManagementSetting = ({
  onBlockCreated,
  selectedBlockId,
  onRoomAdded,
  onRoomAllocated,
}) => {
  const [activeTab, setActiveTab] = useState("block"); // "block" or "book"
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const handleAddBlockClick = () => {
    setShowAddBlock(true);
    setShowAddRoom(false);
  };

  const handleAddRoomClick = () => {
    setShowAddRoom(true);
    setShowAddBlock(false);
  };

  const handleCloseAddBlock = () => {
    setShowAddBlock(false);
  };

  return (
    <div className="booking-management-wrapper">
      {showAddBlock && (
        <AddBlock
          onClose={handleCloseAddBlock}
          onBlockCreated={onBlockCreated}
        />
      )}
      {showAddRoom && (
        <AddRoom
          onClose={() => setShowAddRoom(false)}
          selectedBlockId={selectedBlockId}
          onRoomAdded={onRoomAdded}
        />
      )}

      <div className="action-buttons">
        <button className="add-block-btn" onClick={handleAddBlockClick}>
          Add Block
        </button>
        <button className="add-room-btn" onClick={() => setShowAddRoom(true)}>
          Add Room
        </button>
      </div>

      <div className="booking-management-form">
        <div className="booking-tab-controls">
          <button
            className={`booking-tab-btn ${
              activeTab === "block" ? "active" : ""
            }`}
            onClick={() => setActiveTab("block")}
          >
            Block Room
          </button>
          <button
            className={`booking-tab-btn ${
              activeTab === "book" ? "active" : ""
            }`}
            onClick={() => setActiveTab("book")}
          >
            Book Room
          </button>
        </div>

        {activeTab === "block" ? (
          <BlockRoom
            selectedBlockId={selectedBlockId}
            onRoomBlocked={onBlockCreated}
          />
        ) : (
          <BookRoom
            selectedBlockId={selectedBlockId}
            onRoomAllocated={onRoomAllocated}
          />
        )}
      </div>
    </div>
  );
};

export default BookRoomManagementSetting;
