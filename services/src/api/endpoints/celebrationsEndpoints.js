const celebrationsEndpoints = {
  getCelebrations: "/celebrations?populate=*",
  getCelebrationById: (id) => `/celebrations/${id}`,
  createCelebration: "/celebrations",
  updateCelebration: (id) => `/celebrations/${id}`,
  deleteCelebration: (id) => `/celebrations/${id}`,
};

export default celebrationsEndpoints;
