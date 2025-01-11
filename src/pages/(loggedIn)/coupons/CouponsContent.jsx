import React, { useState, useRef, useEffect } from "react";
import "./CouponsContent.scss";
import CustomizeCategories from "./CustomizeCategories";
import { fetchFoods } from "../../../../services/src/services/foodService";

const CouponsContent = () => {
  const [total, setTotal] = useState(1440);
  const [showFilter, setShowFilter] = useState(false);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [foodsData, setFoodsData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

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

  useEffect(() => {
    const getFoodsData = async () => {
      try {
        const foods = await fetchFoods();
        setFoodsData(foods.data);
        setSelectedFilters(foods.data.map((food) => food.id));
        const initialTotal = foods.data.reduce(
          (acc, food) => acc + food.attributes.count,
          0
        );
        setTotal(initialTotal);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    getFoodsData();
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

  const handleFilterChange = (foodId) => {
    setSelectedFilters((prev) => {
      if (prev.includes(foodId)) {
        return prev.filter((id) => id !== foodId);
      } else {
        return [...prev, foodId];
      }
    });
  };

  const getFilteredData = () => {
    if (selectedFilters.length === 0) return [];
    return foodsData.filter((food) => selectedFilters.includes(food.id));
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedFilters(foodsData.map((food) => food.id));
    } else {
      setSelectedFilters([]);
    }
  };

  const handleCustomizeSave = async () => {
    try {
      const foods = await fetchFoods();
      setFoodsData(foods.data);
      setSelectedFilters(foods.data.map((food) => food.id));
    } catch (error) {
      console.error("Error refreshing foods data:", error);
    }
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
          {foodsData.map((food) => (
            <div className="filter-item" key={food.id}>
              <input
                type="checkbox"
                id={`filter-${food.id}`}
                checked={selectedFilters.includes(food.id)}
                onChange={() => handleFilterChange(food.id)}
              />
              <label htmlFor={`filter-${food.id}`}>
                {food.attributes.category}
              </label>
            </div>
          ))}
          <button
            className="customize-button"
            onClick={() => setIsCustomizeOpen(true)}
          >
            Customize
          </button>
        </div>
      )}

      {getFilteredData().map((food) => (
        <div className="coupon-row" key={food.id}>
          <span className="coupon-label">{food.attributes.category}</span>
          <input
            type="number"
            className="coupon-input"
            value={food.attributes.count}
            onChange={calculateTotal}
          />
        </div>
      ))}

      <div className="total-display">
        <span>Total {total}</span>
      </div>

      <CustomizeCategories
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        onSave={handleCustomizeSave}
      />
    </div>
  );
};

export default CouponsContent;
