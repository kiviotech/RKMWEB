const bookingRequestEndpoints = {
  getBookingRequests: "/booking-requests?populate=*", // GET all booking requests
  // getBookingRequestsByStatus: (status) => `/booking-requests?filters[status][$eq]=${status}&populate=*`, // GET booking requests based on status
  getBookingRequestsByStatus: (status) =>
    // `/booking-requests?filters[status][$eq]=${status}&populate=*`, // GET booking requests based on status
    `/booking-requests?populate[0]=status&populate[1]=admin_comment&populate[2]=name&populate[3]=age&populate[4]=gender&populate[5]=email&populate[6]=phone_number&populate[7]=occupation&populate[8]=recommendation_letter&populate[9]=notifications&populate[10]=guest_house&populate[11]=guests&populate[12]=accommodation_requirements&populate[13]=room_allocations.room&filters[status][$eq]=${status}`, // GET booking requests based on status
  getBookingRequestsStatus: "/booking-requests?fields[0]=status",
  getBookingRequestById: (id) =>
    `/booking-requests/${id}?populate[guests][populate][room_allocations][populate]=*`, // GET booking request by ID
  createBookingRequest: "/booking-requests", // POST a new booking request
  updateBookingRequest: (id) => `/booking-requests/${id}`, // PUT to update a booking request by ID
  deleteBookingRequest: (id) => `/booking-requests/${id}`, // DELETE a booking request by ID
};

export default bookingRequestEndpoints;
