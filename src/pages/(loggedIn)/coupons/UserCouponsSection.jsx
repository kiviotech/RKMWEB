import React, { useEffect, useState } from "react";
import "./UserCouponsSection.scss";
import { fetchCoupons } from "../../../../services/src/services/couponService";
import useCouponStore from "../../../../useCouponStore";

const UserCouponsSection = () => {
  const [couponData, setCouponData] = useState({
    total: 0,
    running: 0,
    special_coupon: 0,
    total_amount_collected: 0,
  });
  const { selectedDate, refreshTrigger } = useCouponStore();

  useEffect(() => {
    const getCouponsData = async () => {
      try {
        const couponsResponse = await fetchCoupons();
        const filteredCoupon = couponsResponse.data.find(
          (coupon) => coupon.attributes.date === selectedDate
        );

        if (filteredCoupon) {
          const { total, running, special_coupon, total_amount_collected } =
            filteredCoupon.attributes;
          setCouponData({
            total: total || 0,
            running: running || 0,
            special_coupon: special_coupon || 0,
            total_amount_collected: total_amount_collected || 0,
          });
        } else {
          setCouponData({
            total: 0,
            running: 0,
            special_coupon: 0,
            total_amount_collected: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    getCouponsData();
  }, [selectedDate, refreshTrigger]);

  const stats = [
    {
      title: "Total Coupons",
      value: (couponData.total + couponData.special_coupon).toString(),
      color: "#1491e5",
      width: "medium",
    },
    {
      // title: "Coupon Status",
      running: couponData.running.toString(),
      remaining: (
        couponData.total +
        couponData.special_coupon -
        couponData.running
      ).toString(),
      color: "#0EC378",
      width: "medium",
    },
    {
      title: "Total Amount Collected",
      value: `Rs. ${couponData.total_amount_collected.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      color: "#65C466",
      width: "medium",
    },
  ];

  return (
    <div className="stats-container">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card ${stat.width}-card`}
          style={{ borderColor: stat.color }}
        >
          <h3 className="stat-title">{stat.title}</h3>
          {stat.running && stat.remaining ? (
            <div className="split-stats">
              <div className="stat-row">
                <span className="stat-label">Issued:</span>&nbsp;
                <span className="stat-number" style={{ color: stat.color }}>
                  {stat.running}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Remaining:</span>&nbsp;
                <span className="stat-number" style={{ color: stat.color }}>
                  {stat.remaining}
                </span>
              </div>
            </div>
          ) : (
            <div className="stat-value-container">
              <div className="amount-display">
                {stat.title === "Total Coupons" ? (
                  <span className="amount">{stat.value}</span>
                ) : (
                  <>
                    <span className="currency">Rs.</span>
                    <span className="amount">
                      {stat.value.replace("Rs. ", "")}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserCouponsSection;
