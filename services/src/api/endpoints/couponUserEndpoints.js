const couponUserEndpoints = {
  getCouponUsers: "/coupon-users?populate=*",
  getCouponUserById: (id) => `/coupon-users/${id}`,
  createCouponUser: "/coupon-users",
  updateCouponUser: (id) => `/coupon-users/${id}`,
  deleteCouponUser: (id) => `/coupon-users/${id}`,
  getCouponUsersByDate: (date) =>
    `/coupon-users?filters[date][$eq]=${date}&populate=*`,
};

export default couponUserEndpoints;
