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

// Update coupon amount collected
export const updateCouponAmountCollected = async (
  date,
  amount,
  noOfCoupons
) => {
  try {
    // First fetch the coupon for the given date
    const response = await getCoupons();
    const coupons = response.data.data;

    const coupon = coupons.find(
      (c) =>
        new Date(c.attributes.date).toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (coupon) {
      // Update total amount and set running count to noOfCoupons
      const currentAmount = parseFloat(
        coupon.attributes.total_amount_collected || 0
      );
      const currentRunning = parseFloat(coupon.attributes.running || 0);
      const newTotal = (currentAmount + parseFloat(amount)).toString();
      const newRunning = (currentRunning + parseInt(noOfCoupons)).toString();

      const response = await updateCoupon(coupon.id, {
        data: {
          total_amount_collected: newTotal,
          running: newRunning,
        },
      });
      return response.data;
    }
    throw new Error("No coupon found for the given date");
  } catch (error) {
    console.error("Error updating coupon amount:", error);
    throw error;
  }
};
