import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../api/repositories/couponRepository";

// Fetch all coupons
export const fetchCoupons = async () => {
  try {
    const response = await getCoupons();
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

// Fetch a specific coupon by ID
export const fetchCouponById = async (id) => {
  try {
    const response = await getCouponById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching coupon by ID ${id}:`, error);
    throw error;
  }
};

// Create a new coupon
export const createNewCoupon = async (data) => {
  try {
    const response = await createCoupon(data);
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

// Update a coupon by ID
export const updateCouponById = async (id, data) => {
  try {
    const response = await updateCoupon(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating coupon with ID ${id}:`, error);
    throw error;
  }
};

// Delete a coupon by ID
export const deleteCouponById = async (id) => {
  try {
    const response = await deleteCoupon(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting coupon with ID ${id}:`, error);
    throw error;
  }
};
