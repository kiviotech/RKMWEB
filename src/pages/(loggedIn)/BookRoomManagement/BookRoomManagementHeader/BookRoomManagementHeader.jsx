import React, { useEffect, useState } from "react";
import "./BookRoomManagementHeader.scss";
import * as blockService from "../../../../../services/src/services/blockService";

const BookRoomManagementHeader = () => {
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState("");

  useEffect(() => {
    const getBlocks = async () => {
      try {
        const response = await blockService.fetchBlocks();
        const blocksData = response.data.map(
          (block) => block.attributes.block_name
        );
        setBlocks(blocksData);
        // Set first block as active by default
        if (blocksData.length > 0) {
          setActiveBlock(blocksData[0]);
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    getBlocks();
  }, []);

  return (
    <div className="book-room-header">
      <div className="filter-options">
        {blocks.map((blockName) => (
          <button
            key={blockName}
            className={`filter-btn ${
              activeBlock === blockName ? "active" : ""
            }`}
            onClick={() => setActiveBlock(blockName)}
          >
            {blockName}
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
        <div className="date-picker">
          <input type="date" className="date-input" placeholder="dd-mm-yyyy" />
        </div>
      </div>
    </div>
  );
};

export default BookRoomManagementHeader;
