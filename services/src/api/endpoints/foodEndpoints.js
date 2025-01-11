const foodEndpoints = {
  getFoods: "/foods?populate=*",
  getFoodById: (id) => `/foods/${id}`,
  createFood: "/foods",
  updateFood: (id) => `/foods/${id}`,
  deleteFood: (id) => `/foods/${id}`,
};

export default foodEndpoints;
