const foodEndpoints = {
  getFoods: "/foods?populate=*&pagination[start]=0&pagination[limit]=-1",
  getFoodById: (id) => `/foods/${id}`,
  createFood: "/foods",
  updateFood: (id) => `/foods/${id}`,
  deleteFood: (id) => `/foods/${id}`,
};

export default foodEndpoints;
