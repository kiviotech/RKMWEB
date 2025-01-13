import React, { useState, useRef, useEffect } from "react";
import "./CouponsContent.scss";
import CustomizeCategories from "./CustomizeCategories";
import {
  fetchFoods,
  updateFoodById,
} from "../../../../services/src/services/foodService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCouponStore from "../../../../useCouponStore";
import {
  createNewCoupon,
  fetchCoupons,
  updateCouponById,
} from "../../../../services/src/services/couponService";

const CATEGORY_ORDER_KEY = "categoryOrder";

const CouponsContent = () => {
  const [total, setTotal] = useState(1440);
  const [showFilter, setShowFilter] = useState(false);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [foodsData, setFoodsData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [counts, setCounts] = useState({});
  const { selectedDate, triggerRefresh } = useCouponStore();

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
        const filteredFoods = foods.data.filter(
          (food) => food.attributes.date === selectedDate
        );

        setFoodsData(filteredFoods);
        setSelectedFilters(filteredFoods.map((food) => food.id));

        // Initialize counts state with current values
        const initialCounts = filteredFoods.reduce((acc, food) => {
          acc[food.id] = food.attributes.count;
          return acc;
        }, {});
        setCounts(initialCounts);

        const initialTotal = filteredFoods.reduce(
          (acc, food) => acc + food.attributes.count,
          0
        );
        setTotal(initialTotal);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    getFoodsData();
  }, [selectedDate]);

  useEffect(() => {
    const getCouponsData = async () => {
      try {
        const couponsResponse = await fetchCoupons();
        const filteredCoupon = couponsResponse.data.find(
          (coupon) => coupon.attributes.date === selectedDate
        );
        console.log("All Coupons:", couponsResponse.data);
        console.log("Filtered Coupon for selected date:", filteredCoupon);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    getCouponsData();
  }, [selectedDate]);

  const handleFilterClick = (e) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setFilterPosition({
      top: buttonRect.bottom + window.scrollY - 320,
      left: buttonRect.left + window.scrollX - 130,
    });
    setShowFilter(!showFilter);
  };

  const handleCountChange = (foodId, value) => {
    // Only allow positive numbers
    const newValue = Math.max(0, parseInt(value) || 0);
    setCounts((prev) => {
      const newCounts = {
        ...prev,
        [foodId]: newValue,
      };

      // Calculate new total using the updated counts
      const newTotal = Object.entries(newCounts)
        .filter(([id]) => selectedFilters.includes(parseInt(id)))
        .reduce((acc, [, count]) => acc + count, 0);

      setTotal(newTotal);
      return newCounts;
    });
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

    const storedOrder = JSON.parse(
      localStorage.getItem(CATEGORY_ORDER_KEY) || "[]"
    );
    const filteredData = foodsData.filter((food) =>
      selectedFilters.includes(food.id)
    );

    // Create a map for quick lookup
    const dataMap = filteredData.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    // Order the data based on stored order
    let orderedData = [];

    // First add items that exist in stored order
    storedOrder.forEach((id) => {
      if (dataMap[id] && selectedFilters.includes(id)) {
        orderedData.push(dataMap[id]);
        delete dataMap[id];
      }
    });

    // Then add any remaining items
    orderedData = [...orderedData, ...Object.values(dataMap)];

    return orderedData;
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedFilters(foodsData.map((food) => food.id));
    } else {
      setSelectedFilters([]);
    }
  };

  const handleCustomizeSave = async (categoriesCount) => {
    try {
      const foods = await fetchFoods();
      // Filter foods based on selected date
      const filteredFoods = foods.data.filter(
        (food) => food.attributes.date === selectedDate
      );
      setFoodsData(filteredFoods);
      setSelectedFilters(filteredFoods.map((food) => food.id));

      // Show success message with the number of categories created
      if (categoriesCount > 0) {
        toast.success(
          `Successfully created ${categoriesCount} new ${
            categoriesCount === 1 ? "category" : "categories"
          }!`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (error) {
      console.error("Error refreshing foods data:", error);
      toast.error("Failed to update categories. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      // First update all food counts
      const updatePromises = Object.entries(counts).map(([foodId, count]) => {
        return updateFoodById(foodId, {
          data: {
            count: count,
          },
        });
      });

      await Promise.all(updatePromises);

      // Fetch all coupons and filter by date
      const couponsResponse = await fetchCoupons();
      const existingCoupon = couponsResponse.data.find(
        (coupon) => coupon.attributes.date === selectedDate
      );

      if (existingCoupon) {
        // Update existing coupon
        await updateCouponById(existingCoupon.id, {
          data: {
            total: total,
            date: selectedDate,
          },
        });
      } else {
        // Create new coupon if none exists
        await createNewCoupon({
          total: total,
          date: selectedDate,
        });
      }

      // After successful update
      triggerRefresh();

      toast.success("Categories and coupon updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating:", error);
      toast.error("Failed to update. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
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
            onClick={handleUpdate}
            disabled={foodsData.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: foodsData.length === 0 ? "0.5" : "1",
              cursor: foodsData.length === 0 ? "not-allowed" : "pointer",
            }}
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
            maxHeight: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ overflowY: "auto", flex: 1 }}>
            {getFilteredData().map((food) => (
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
          </div>
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
            value={counts[food.id] || 0}
            onChange={(e) => handleCountChange(food.id, e.target.value)}
            onKeyDown={(e) => {
              // Prevent minus, plus, and 'e' keys
              if (e.key === "-" || e.key === "+" || e.key === "e") {
                e.preventDefault();
              }
            }}
            min="0"
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
