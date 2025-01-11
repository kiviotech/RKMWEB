import React from "react";
import "./PrintableCoupon.scss";

const PrintableCoupon = ({ name, devotees, date }) => {
  return (
    <div className="prasada-coupon">
      <div className="prasada-coupon__header">
        <img
          src="/logo.png"
          alt="Mission Logo"
          className="prasada-coupon__logo"
        />
        <h2 className="prasada-coupon__title">
          Ramakrishna Math & Ramakrishna
          <br />
          Mission, Kamarpukur
        </h2>
      </div>

      <h1 className="prasada-coupon__main-title">PRASADA COUPON</h1>

      <div className="prasada-coupon__details">
        <div className="prasada-coupon__row">
          <span className="prasada-coupon__label">Date:</span>
          <span className="prasada-coupon__value">{date}</span>
        </div>
        <div className="prasada-coupon__row">
          <span className="prasada-coupon__label">Name:</span>
          <span className="prasada-coupon__value">{name}</span>
        </div>
        <div className="prasada-coupon__row">
          <span className="prasada-coupon__label">No. Of Devotees:</span>
        </div>
        <div className="prasada-coupon__number">{devotees}</div>
      </div>
    </div>
  );
};

export default PrintableCoupon;
