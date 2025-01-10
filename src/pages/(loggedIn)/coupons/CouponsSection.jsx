import React from "react";
import "./CouponsSection.scss";

const CouponsSection = () => {
  const stats = [
    {
      title: "Daily Coupon",
      running: "845",
      total: "1440",
      color: "#0EC378",
    },
    { title: "Special Coupon", value: "126", color: "#007AFF" },
    { title: "Total Coupons", value: "1566", color: "#65C466" },
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
            <p className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CouponsSection;
