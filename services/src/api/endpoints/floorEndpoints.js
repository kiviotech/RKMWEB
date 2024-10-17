const floorEndpoints = {
  getFloors: "/floors?populate=*",
  getFloorById: (id) => `/floors/${id}`,
  createFloor: "/floors",
  updateFloor: (id) => `/floors/${id}`,
  deleteFloor: (id) => `/floors/${id}`,
};

export default floorEndpoints;
