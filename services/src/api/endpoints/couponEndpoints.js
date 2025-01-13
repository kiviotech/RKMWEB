const couponEndpoints = {
  getCoupons: "/coupons?populate=*",
  getCouponById: (id) => `/coupons/${id}`,
  createCoupon: "/coupons",
  updateCoupon: (id) => `/coupons/${id}`,
  deleteCoupon: (id) => `/coupons/${id}`,
};

export default couponEndpoints;
