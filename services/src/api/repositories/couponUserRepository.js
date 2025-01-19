import apiClient from "../../../apiClient";
import couponUserEndpoints from "../endpoints/couponUserEndpoints";

// Fetch all coupon users
export const getCouponUsers = () =>
  apiClient.get(couponUserEndpoints.getCouponUsers);

// Fetch a specific coupon user by ID
export const getCouponUserById = (id) =>
  apiClient.get(couponUserEndpoints.getCouponUserById(id));

// Create a new coupon user
export const createCouponUser = (data) =>
  apiClient.post(couponUserEndpoints.createCouponUser, { data });

// Update a coupon user by ID
export const updateCouponUser = (id, data) =>
  apiClient.put(couponUserEndpoints.updateCouponUser(id), data);

// Delete a coupon user by ID
export const deleteCouponUser = (id) =>
  apiClient.delete(couponUserEndpoints.deleteCouponUser(id));

// Get coupon users by date
export const getCouponUsersByDate = (date) =>
  apiClient.get(couponUserEndpoints.getCouponUsersByDate(date));
