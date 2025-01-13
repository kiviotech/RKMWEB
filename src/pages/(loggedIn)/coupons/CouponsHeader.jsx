import React from "react";
import "./CouponsHeader.scss";
import useCouponStore from "../../../../useCouponStore";

const CouponsHeader = () => {
  const { selectedDate, setSelectedDate } = useCouponStore();

  return (
    <div className="coupons-header">
      {/* Date Container */}
      <div className="coupons-header__container">
        <input
          type="date"
          className="coupons-header__date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
      </div>

      {/* Reminder Container */}
      <div className="coupons-header__container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="coupons-header__reminder-label">Reminder:</span>
        <span className="coupons-header__reminder-text">
          26th Aug is Janmashtami
        </span>
      </div>
    </div>
  );
};

export default CouponsHeader;
