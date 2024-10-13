const roomAllocationsEndpoints = {
  getRoomAllocations: "/room-allocations?populate=*",
  getRoomAllocationsById: (id) => `/room-allocations/${id}`,
  createRoomAllocations: "/room-allocations",
  updateRoomAllocations: (id) => `/room-allocations/${id}`,
  deleteRoomAllocations: (id) => `/room-allocations/${id}`,
};

export default roomAllocationsEndpoints;
