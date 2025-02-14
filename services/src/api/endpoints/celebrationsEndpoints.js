const celebrationsEndpoints = {
  getCelebrations: "/celebrations?populate=*",
  getCelebrationById: (id) => `/celebrations/${id}`,
  createCelebration: "/celebrations",
  updateCelebration: (id) => `/celebrations/${id}`,
  deleteCelebration: (id) => `/celebrations/${id}`,
  getCelebrationsByDateRange: (arrivalDate, departureDate) =>
    `/celebrations?filters[gregorian_date][$gte]=${arrivalDate}&filters[gregorian_date][$lte]=${departureDate}&populate=*`,
};

export default celebrationsEndpoints;
