const guestDetailsEndpoints = {
  getGuestDetails: "/guest-details?populate[donations][populate]=*",
  getGuestDetailsById: (id) => `/guest-details/${id}`,
  createGuestDetails: "/guest-details",
  updateGuestDetails: (id) => `/guest-details${id}`,
  deleteGuestDetails: (id) => `/guest-details${id}`,
};

export default guestDetailsEndpoints;
