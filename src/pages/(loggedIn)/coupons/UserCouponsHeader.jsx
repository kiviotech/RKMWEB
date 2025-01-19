import React from "react";
import "./UserCouponsHeader.scss";

const UserCouponsHeader = () => {
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="user-coupons-header">
      <div className="header-content">
        <div className="date-section">
          <span>Date: </span>
          <span className="date">{formatDate()}</span>
        </div>
        <button className="reports-btn">Reports</button>
      </div>
    </div>
  );
};

export default UserCouponsHeader;
