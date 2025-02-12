import React, { useState, useEffect } from "react";
import "./CouponsDetails.scss";
import PrintableCoupon from "./PrintableCoupon";
import { createNewCouponUser } from "../../../../services/src/services/couponUserService";
import { toast } from "react-toastify";
import { updateCouponAmountCollected } from "../../../../services/src/services/couponService";
import useCouponStore from "../../../../useCouponStore";
import { handlePrintSeparate, handlePrintAll } from "./PrintHandlers";

const CouponsDetails = () => {
  const COUPON_PRICE = 40;

  const [selectedCoupons, setSelectedCoupons] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    pincode: "",
    address: "",
    amount: (1 * COUPON_PRICE).toString(),
    paid: "0",
  });
  const [pincodeError, setPincodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    pincode: "",
    address: "",
  });

  const couponNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const { setRefreshTrigger } = useCouponStore();

  const calculateBalance = () => {
    const amount = parseFloat(formData.amount) || 0;
    const paid = parseFloat(formData.paid) || 0;
    const balance = amount - paid;
    return balance.toFixed(2);
  };

  const updateSelectedCoupons = (num) => {
    const validNum = Math.max(1, num);
    setSelectedCoupons(validNum);
    setFormData((prev) => ({
      ...prev,
      amount: (validNum * COUPON_PRICE).toString(),
    }));
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setFormData({ ...formData, pincode });
    setPincodeError("");
    setErrors((prev) => ({ ...prev, pincode: "" }));

    // Validate pincode format
    if (pincode && !/^\d{6}$/.test(pincode)) {
      setPincodeError("Invalid pincode. Please check and try again.");
      setFormData((prev) => ({
        ...prev,
        address: "",
      }));
      return;
    }

    if (pincode.length === 6) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const [data] = await response.json();

        if (data.Status === "Success") {
          const postOffice = data.PostOffice[0];
          const address = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
          setFormData((prev) => ({
            ...prev,
            address,
          }));
          setErrors((prev) => ({ ...prev, address: "" }));
        } else {
          setFormData((prev) => ({
            ...prev,
            address: "",
          }));
          setPincodeError("Invalid pincode. Please check and try again.");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setFormData((prev) => ({
          ...prev,
          address: "",
        }));
        setPincodeError("Error fetching address. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      pincode: "",
      address: "",
      amount: (1 * COUPON_PRICE).toString(),
      paid: "0",
    });
    setSelectedCoupons(1);
    setPincodeError("");
    setErrors({
      name: "",
      pincode: "",
      address: "",
    });
  };

  const handlePrintSeparateClick = async () => {
    try {
      await handlePrintSeparate(
        formData,
        selectedCoupons,
        setRefreshTrigger,
        clearForm
      );
      clearForm(); // Clear form after successful operation
    } catch (error) {
      console.error("Error in print separate:", error);
    }
  };

  const handlePrintAllClick = async () => {
    try {
      await handlePrintAll(
        formData,
        selectedCoupons,
        setRefreshTrigger,
        clearForm
      );
      clearForm(); // Clear form after successful operation
    } catch (error) {
      console.error("Error in print all:", error);
    }
  };

  return (
    <div className="coupon-details">
      <form className="coupon-details__form">
        <div className="coupon-details__form-row">
          <div className="coupon-details__form-group">
            <label className="coupon-details__label">
              Name <span className="coupon-details__required">*</span>
            </label>
            <input
              className={`coupon-details__input ${errors.name ? "error" : ""}`}
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && (
              <span className="coupon-details__error">{errors.name}</span>
            )}
          </div>
          <div className="coupon-details__form-group">
            <label className="coupon-details__label">Pincode</label>
            <div className="pincode-input-wrapper">
              <input
                className={`coupon-details__input ${
                  errors.pincode ? "error" : ""
                }`}
                type="text"
                placeholder="Enter Pincode"
                value={formData.pincode}
                onChange={handlePincodeChange}
                maxLength={6}
                style={{ color: "#000" }}
              />
            </div>
            {loading && <span className="loading-spinner">🔄</span>}
            {(pincodeError || errors.pincode) && (
              <span className="coupon-details__error">
                {pincodeError || errors.pincode}
              </span>
            )}
          </div>
        </div>

        <div className="coupon-details__form-group">
          <label className="coupon-details__label">Address</label>
          <input
            className={`coupon-details__input ${errors.address ? "error" : ""}`}
            type="text"
            placeholder="Area, City, State"
            value={formData.address}
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
              setErrors((prev) => ({ ...prev, address: "" }));
            }}
            style={{ color: "#000" }}
          />
          {errors.address && (
            <span className="coupon-details__error">{errors.address}</span>
          )}
        </div>

        <div className="coupon-details__selection">
          <label
            className="coupon-details__label"
            style={{ marginRight: "1rem" }}
          >
            No. Of Coupons:
          </label>
          <div className="coupon-details__number-grid">
            {couponNumbers.map((num) => (
              <button
                key={num}
                type="button"
                className={`coupon-details__number-btn ${
                  selectedCoupons === num
                    ? "coupon-details__number-btn--active"
                    : ""
                }`}
                onClick={() => updateSelectedCoupons(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="coupon-details__form-row">
          <div className="coupon-details__form-group__data">
            <label className="coupon-details__label">No. Of Coupons:</label>
            <input
              className="coupon-details__input"
              type="number"
              value={selectedCoupons}
              min="1"
              onChange={(e) => updateSelectedCoupons(Number(e.target.value))}
            />
          </div>
          <div className="coupon-details__form-group__data">
            <label className="coupon-details__label">Amount</label>
            <input
              className="coupon-details__input"
              type="text"
              value={formData.amount}
              readOnly
            />
          </div>
          <div className="coupon-details__form-group__data">
            <label className="coupon-details__label">
              Donate <span className="coupon-details__required">*</span>
            </label>
            <input
              className="coupon-details__input"
              type="text"
              value={formData.paid === "0" ? "" : formData.paid}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setFormData({ ...formData, paid: value || "0" });
                }
              }}
            />
          </div>
        </div>

        <div className="coupon-details__balance">
          <label
            className="coupon-details__label"
            style={{
              color: calculateBalance() < 0 ? "#1FAF38" : "#FF0000",
            }}
          >
            Balance to {calculateBalance() < 0 ? "Return" : "Collect"}
          </label>
          <input
            className="coupon-details__input"
            type="text"
            readOnly
            value={Math.abs(calculateBalance())}
            style={{
              color: calculateBalance() < 0 ? "#1FAF38" : "#FF0000",
            }}
          />
        </div>

        <div className="coupon-details__actions">
          <button
            type="button"
            className="coupon-details__btn coupon-details__btn--primary"
            onClick={handlePrintAllClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              strokeWidth="2"
            >
              <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
              <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
            </svg>{" "}
            Print All
          </button>
          <button
            type="button"
            className="coupon-details__btn coupon-details__btn--secondary"
            onClick={handlePrintSeparateClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 50 50"
              fill="#fff"
              stroke="#fff"
              strokeWidth="2"
            >
              <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"></path>
            </svg>
            Print Separate Coupons
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponsDetails;
