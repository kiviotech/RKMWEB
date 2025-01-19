import {
  getCouponUsers,
  getCouponUserById,
  createCouponUser,
  updateCouponUser,
  deleteCouponUser,
} from "../api/repositories/couponUserRepository";

// Fetch all coupon users
export const fetchCouponUsers = async () => {
  try {
    const response = await getCouponUsers();
    return response.data;
  } catch (error) {
    console.error("Error fetching coupon users:", error);
    throw error;
  }
};

// Fetch a specific coupon user by ID
export const fetchCouponUserById = async (id) => {
  try {
    const response = await getCouponUserById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching coupon user by ID ${id}:`, error);
    throw error;
  }
};

// Create a new coupon user
export const createNewCouponUser = async (data) => {
  try {
    const response = await createCouponUser(data);
    return response.data;
  } catch (error) {
    console.error("Error creating coupon user:", error);
    throw error;
  }
};

// Update a coupon user by ID
export const updateCouponUserById = async (id, data) => {
  try {
    const response = await updateCouponUser(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating coupon user with ID ${id}:`, error);
    throw error;
  }
};

// Delete a coupon user by ID
export const deleteCouponUserById = async (id) => {
  try {
    const response = await deleteCouponUser(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting coupon user with ID ${id}:`, error);
    throw error;
  }
};
