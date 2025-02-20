const guestDetailsEndpoints = {
  getGuestDetails: "/guest-details?populate[donations][populate]=*",
  getGuestDetailsById: (id) =>
    `/guest-details/${id}?populate[booking_request][populate]=guests&populate[room_allocations][populate]=room`,
  getAllGuestDetails: "/guest-details?filters[status][$eq]=Arrived",
  createGuestDetails: "/guest-details",
  updateGuestDetails: (id) => `/guest-details${id}`,
  deleteGuestDetails: (id) => `/guest-details${id}`,
  getGuestUniqueNo: "/guest-details?fields=unique_no",
};

export default guestDetailsEndpoints;
