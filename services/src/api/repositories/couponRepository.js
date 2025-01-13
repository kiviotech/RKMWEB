import apiClient from "../../../apiClient";
import couponEndpoints from "../endpoints/couponEndpoints";

// Fetch all coupons
export const getCoupons = () => apiClient.get(couponEndpoints.getCoupons);

// Fetch a specific coupon by ID
export const getCouponById = (id) =>
  apiClient.get(couponEndpoints.getCouponById(id));

// Create a new coupon
export const createCoupon = (data) =>
  apiClient.post(couponEndpoints.createCoupon, { data });

// Update a coupon by ID
export const updateCoupon = (id, data) =>
  apiClient.put(couponEndpoints.updateCoupon(id), data);

// Delete a coupon by ID
export const deleteCoupon = (id) =>
  apiClient.delete(couponEndpoints.deleteCoupon(id));
