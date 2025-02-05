const roomBlockingEndpoints = {
  getRoomBlockings: "/room-blockings?populate=*",
  getRoomBlockingById: (id) => `/room-blockings/${id}?populate=*`,
  createRoomBlocking: "/room-blockings",
  updateRoomBlocking: (id) => `/room-blockings/${id}`,
  deleteRoomBlocking: (id) => `/room-blockings/${id}`,
};

export default roomBlockingEndpoints;
