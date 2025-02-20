const roomAllocationEndpoints = {
  getRoomAllocations: "/room-allocations?populate=*",
  getRoomAllocationForCheckin: (date, todayDate) =>
    `/room-allocations?populate=*&filters[guests][${date}][$eq]=${todayDate}`,
  getRoomAllocationById: (id) => `/room-allocations/${id}?populate=*`,
  createRoomAllocation: "/room-allocations",
  updateRoomAllocation: (id) => `/room-allocations/${id}`,
  deleteRoomAllocation: (id) => `/room-allocations/${id}`,
};

export default roomAllocationEndpoints;
