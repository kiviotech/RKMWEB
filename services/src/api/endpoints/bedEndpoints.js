const bedEndpoints = {
  getBeds: "/beds?populate=*",
  getBedById: (id) => `/beds/${id}`,
  createBed: "/beds",
  updateBed: (id) => `/beds/${id}`,
  deleteBed: (id) => `/beds/${id}`,
};

export default bedEndpoints;
