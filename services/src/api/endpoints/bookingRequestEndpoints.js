const bookingRequestEndpoints = {
  getBookingRequests: () => "/booking-requests", // GET all booking requests
  getBookingRequestsByStatus: (status) => `/booking-requests?filters[status][$eq]=${status}&populate=*`, // GET booking requests based on status
  getBookingRequestById: (id) => `/booking-requests/${id}`, // GET booking request by ID
  createBookingRequest: "/booking-requests", // POST a new booking request
  updateBookingRequest: (id) => `/booking-requests/${id}`, // PUT to update a booking request by ID
  deleteBookingRequest: (id) => `/booking-requests/${id}`, // DELETE a booking request by ID
};

export default bookingRequestEndpoints;