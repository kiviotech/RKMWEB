import React, { useState, useRef, useEffect } from "react";
import "./CouponsContent.scss";
import CustomizeCategories from "./CustomizeCategories";

const CouponsContent = () => {
  const [total, setTotal] = useState(1440);
  const [showFilter, setShowFilter] = useState(false);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterClick = (e) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setFilterPosition({
      top: buttonRect.bottom + window.scrollY - 320,
      left: buttonRect.left + window.scrollX - 130,
    });
    setShowFilter(!showFilter);
  };

  const calculateTotal = (e) => {
    const inputs = document.querySelectorAll(".coupon-input");
    const sum = Array.from(inputs).reduce(
      (acc, input) => acc + Number(input.value),
      0
    );
    setTotal(sum);
  };

  return (
    <div className="coupons-container">
      <div className="controls-container">
        <div className="controls-icon" onClick={handleFilterClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a5a5a5"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <circle cx="8" cy="6" r="2" fill="#fff"></circle>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <circle cx="14" cy="12" r="2" fill="#fff"></circle>
            <line x1="4" y1="18" x2="20" y2="18"></line>
            <circle cx="8" cy="18" r="2" fill="#fff"></circle>
          </svg>
        </div>
        <div>
          <button
            className="update-button"
            onClick={() => console.log("Update clicked")}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
            Update
          </button>
        </div>
      </div>

      {showFilter && (
        <div
          ref={filterRef}
          className="filter-dropdown"
          style={{
            position: "absolute",
            top: `${filterPosition.top}px`,
            left: `${filterPosition.left}px`,
          }}
        >
          <div className="filter-item">
            <input type="checkbox" id="visitors" />
            <label htmlFor="visitors">General Visitors/ Devotees</label>
          </div>
          <div className="filter-item">
            <input type="checkbox" id="maintenance" />
            <label htmlFor="maintenance">
              Maintenance Staff/Workers/Helpers
            </label>
          </div>
          <div className="filter-item">
            <input type="checkbox" id="monks" />
            <label htmlFor="monks">Monks/Sadhus</label>
          </div>
          <div className="filter-item">
            <input type="checkbox" id="poor" />
            <label htmlFor="poor">Poor People/Widow Mothers</label>
          </div>
          <button
            className="customize-button"
            onClick={() => setIsCustomizeOpen(true)}
          >
            Customize
          </button>
        </div>
      )}

      <div className="coupon-row">
        <span className="coupon-label">General Visitors/ Devotees</span>
        <input
          type="number"
          className="coupon-input"
          defaultValue={1000}
          onChange={calculateTotal}
        />
      </div>

      <div className="coupon-row">
        <span className="coupon-label">Maintenance Staff/Workers/Helpers</span>
        <input
          type="number"
          className="coupon-input"
          defaultValue={150}
          onChange={calculateTotal}
        />
      </div>

      <div className="coupon-row">
        <span className="coupon-label">Monks/Sadhus</span>
        <input
          type="number"
          className="coupon-input"
          defaultValue={50}
          onChange={calculateTotal}
        />
      </div>

      <div className="coupon-row">
        <span className="coupon-label">Poor People/Widow Mothers</span>
        <input
          type="number"
          className="coupon-input"
          defaultValue={10}
          onChange={calculateTotal}
        />
      </div>

      <div className="coupon-row">
        <span className="coupon-label">Guest House</span>
        <input
          type="number"
          className="coupon-input"
          defaultValue={230}
          onChange={calculateTotal}
        />
      </div>

      <div className="total-display">
        <span>Total {total}</span>
      </div>

      <CustomizeCategories
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
      />
    </div>
  );
};

export default CouponsContent;
