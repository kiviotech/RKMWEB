const roomEndpoints = {
  getRooms: "/rooms?populate=*",
  getRoomById: (id) => `/rooms/${id}`,
  createRoom: "/rooms",
  updateRoom: (id) => `/rooms/${id}`,
  deleteRoom: (id) => `/rooms/${id}`,
};

export default roomEndpoints;
