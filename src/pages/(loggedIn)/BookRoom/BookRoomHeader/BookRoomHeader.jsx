import React, { useEffect, useState } from "react";
import "./BookRoomHeader.scss";
import * as blockService from "../../../../../services/src/services/blockService";

const BookRoomHeader = ({ refreshTrigger, onBlockSelect }) => {
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState("");

  useEffect(() => {
    const getBlocks = async () => {
      try {
        const response = await blockService.fetchBlocks();
        const blocksData = response.data;
        setBlocks(blocksData);
        // Only set first block as active if no block is currently selected
        if (blocksData.length > 0 && !activeBlock) {
          setActiveBlock(blocksData[0].id);
          onBlockSelect(blocksData[0].id);
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    getBlocks();
  }, [refreshTrigger, onBlockSelect, activeBlock]);

  return (
    <div className="book-room-header">
      <div className="filter-options">
        {blocks.map((block) => (
          <button
            key={block.id}
            className={`filter-btn ${activeBlock === block.id ? "active" : ""}`}
            onClick={() => {
              setActiveBlock(block.id);
              onBlockSelect(block.id);
            }}
          >
            {block.attributes.block_name}
          </button>
        ))}
      </div>
      <div className="sort-section">
        <div className="sort-by">
          <span>Sort by</span>
          <select className="sort-select">
            <option value="">All Types</option>
            <option value="AC">AC</option>
            <option value="Non AC">Non AC</option>
          </select>
        </div>
        <div className="arrival-date-picker">
          <input
            type="date"
            className="date-input"
            placeholder="dd-mm-yyyy"
            readOnly
          />
        </div>
        <div className="departure-date-picker">
          <input
            type="date"
            className="date-input"
            placeholder="dd-mm-yyyy"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoomHeader;
