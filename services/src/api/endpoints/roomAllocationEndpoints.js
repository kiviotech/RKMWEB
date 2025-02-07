const roomAllocationEndpoints = {
  getRoomAllocations: "/room-allocations?populate=*",
  getRoomAllocationById: (id) => `/room-allocations/${id}?populate=*`,
  createRoomAllocation: "/room-allocations",
  updateRoomAllocation: (id) => `/room-allocations/${id}`,
  deleteRoomAllocation: (id) => `/room-allocations/${id}`,
};

export default roomAllocationEndpoints;
