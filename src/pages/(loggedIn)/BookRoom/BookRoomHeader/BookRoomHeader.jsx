import React, { useEffect, useState } from "react";
import "./BookRoomHeader.scss";
import * as blockService from "../../../../../services/src/services/blockService";
import icons from "../../../../constants/icons";

const BookRoomHeader = ({
  refreshTrigger,
  onBlockSelect,
  arrivalDate,
  departureDate,
  onViewChange,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState("");
  const [activeToggler, setActiveToggler] = useState("dashboard");

  const getStyle = (view) => ({
    cursor: "pointer",
    borderRadius: "5px",
    background: activeToggler === view ? "var(--primary-color)" : "transparent",
  });

  const handleTogglerClick = (view) => {
    setActiveToggler(view);
    onViewChange(view);
  };

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

  // useEffect(() => {
  //   console.log("BookRoomHeader received dates:", {
  //     arrivalDate,
  //     departureDate,
  //   });
  // }, [arrivalDate, departureDate]);

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
        <div
          className="toggleGridView"
          style={{
            background: "#DEE4ED",
            borderRadius: "5px",
            display: "flex",
          }}
        >
          <img
            src={
              activeToggler === "dashboard"
                ? icons.toggglerDashboardWite
                : icons.toggglerDashboard
            }
            alt="Dashboard"
            onClick={() => handleTogglerClick("dashboard")}
            style={getStyle("dashboard")}
          />
          <img
            src={
              activeToggler === "gridView"
                ? icons.togglerGridViewWhite
                : icons.togglerGridView
            }
            alt="Grid View"
            onClick={() => handleTogglerClick("gridView")}
            style={getStyle("gridView")}
          />
        </div>
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
            value={arrivalDate || ""}
            readOnly
          />
        </div>
        <div className="departure-date-picker">
          <input
            type="date"
            className="date-input"
            placeholder="dd-mm-yyyy"
            value={departureDate || ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default BookRoomHeader;
