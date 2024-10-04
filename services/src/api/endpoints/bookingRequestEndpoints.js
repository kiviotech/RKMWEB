const bookingRequestEndpoints = {
  getBookingRequests: "/booking-requests?populate=*", // GET all booking requests
  getBookingRequestById: (id) => `/booking-requests/${id}`, // GET booking request by ID
  createBookingRequest: "/booking-requests", // POST a new booking request
  updateBookingRequest: (id) => `/booking-requests/${id}`, // PUT to update a booking request by ID
  deleteBookingRequest: (id) => `/booking-requests/${id}`, // DELETE a booking request by ID
};

export default bookingRequestEndpoints;
