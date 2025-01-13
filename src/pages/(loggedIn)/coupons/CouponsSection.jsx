import React, { useEffect, useState } from "react";
import "./CouponsSection.scss";
import {
  fetchCoupons,
  updateCouponById,
  createNewCoupon,
} from "../../../../services/src/services/couponService";
import useCouponStore from "../../../../useCouponStore";

const CouponsSection = () => {
  const [specialCouponValue, setSpecialCouponValue] = useState(0);
  const [couponData, setCouponData] = useState({
    total: 0,
    running: 0,
    special_coupon: 0,
    id: null, // Add id to track the current coupon
  });
  const { selectedDate } = useCouponStore();

  useEffect(() => {
    const getCouponsData = async () => {
      try {
        const couponsResponse = await fetchCoupons();
        const filteredCoupon = couponsResponse.data.find(
          (coupon) => coupon.attributes.date === selectedDate
        );

        if (filteredCoupon) {
          const { total, running, special_coupon } = filteredCoupon.attributes;
          setCouponData({
            total: total || 0,
            running: running || 0,
            special_coupon: special_coupon || 0,
            id: filteredCoupon.id,
          });
          setSpecialCouponValue(special_coupon || 0);
        } else {
          setCouponData({
            total: 0,
            running: 0,
            special_coupon: 0,
            id: null,
          });
          setSpecialCouponValue(0);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    getCouponsData();
  }, [selectedDate]);

  const updateSpecialCoupon = async (newValue) => {
    try {
      if (couponData.id) {
        // Update existing coupon
        await updateCouponById(couponData.id, {
          data: {
            special_coupon: newValue,
            date: selectedDate,
            total: couponData.total,
            running: couponData.running,
          },
        });
      } else {
        // Create new coupon if none exists
        const response = await createNewCoupon({
          special_coupon: newValue,
          date: selectedDate,
          total: 0,
          running: 0,
        });
        setCouponData((prev) => ({
          ...prev,
          id: response.data.id,
        }));
      }

      setSpecialCouponValue(newValue);
      setCouponData((prev) => ({
        ...prev,
        special_coupon: newValue,
      }));
    } catch (error) {
      console.error("Error updating special coupon:", error);
      // Revert the value if update fails
      setSpecialCouponValue(couponData.special_coupon);
    }
  };

  const handleIncrement = () => {
    const newValue = specialCouponValue + 1;
    updateSpecialCoupon(newValue);
  };

  const handleDecrement = () => {
    if (specialCouponValue > 0) {
      const newValue = specialCouponValue - 1;
      updateSpecialCoupon(newValue);
    }
  };

  const stats = [
    {
      title: "Daily Coupon",
      running: couponData.running.toString(),
      total: couponData.total.toString(),
      color: "#0EC378",
    },
    {
      title: "Special Coupon",
      value: specialCouponValue,
      color: "#007AFF",
      hasControls: true,
    },
    {
      title: "Total Coupons",
      value: (couponData.total + specialCouponValue).toString(),
      color: "#65C466",
    },
  ];

  return (
    <div className="stats-container">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card"
          style={{ borderColor: stat.color }}
        >
          <h3 className="stat-title">{stat.title}</h3>
          {stat.running && stat.total ? (
            <div className="split-stats">
              <div className="split-labels">
                <span className="running-label">Running</span>
                <span className="separator">/</span>
                <span className="total-label">Total</span>
              </div>
              <div className="split-value">
                <span className="running-value">{stat.running}</span>
                <span className="separator">/</span>
                <span className="total-value">{stat.total}</span>
              </div>
            </div>
          ) : (
            <div className="stat-value-container">
              <p className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </p>
              {stat.hasControls && (
                <div className="value-controls">
                  <button onClick={handleIncrement}>▲</button>
                  <button onClick={handleDecrement}>▼</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CouponsSection;
