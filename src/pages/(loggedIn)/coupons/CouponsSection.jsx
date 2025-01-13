import React from "react";
import "./CouponsSection.scss";

const CouponsSection = () => {
  const [specialCouponValue, setSpecialCouponValue] = React.useState(126);

  const stats = [
    {
      title: "Daily Coupon",
      running: "845",
      total: "1440",
      color: "#0EC378",
    },
    {
      title: "Special Coupon",
      value: specialCouponValue,
      color: "#007AFF",
      hasControls: true,
    },
    { title: "Total Coupons", value: "1566", color: "#65C466" },
  ];

  const handleIncrement = () => {
    setSpecialCouponValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setSpecialCouponValue((prev) => (prev > 0 ? prev - 1 : 0));
  };

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
