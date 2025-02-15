const roomAllocationEndpoints = {
  getRoomAllocations: "/room-allocations?populate=*",
  getRoomAllocationForCheckin: (todayDate) =>
    `/room-allocations?populate=*&filters[guests][arrival_date][$eq]=${todayDate}`,
  getRoomAllocationById: (id) => `/room-allocations/${id}?populate=*`,
  createRoomAllocation: "/room-allocations",
  updateRoomAllocation: (id) => `/room-allocations/${id}`,
  deleteRoomAllocation: (id) => `/room-allocations/${id}`,
};

export default roomAllocationEndpoints;
