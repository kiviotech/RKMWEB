const blockEndpoints = {
  getBlocks: "/blocks?populate=*",
  getBlocksWithRooms: "/blocks?populate[rooms][populate]=*",
  getBlockById: (id) =>
    // `/blocks/${id}?populate[rooms][populate][0]=room_allocations.guests.booking_request.recommendation_letter&populate[rooms][populate][1]=room_blockings&populate[rooms][populate][2]=block`,
  `/blocks/${id}?populate[rooms][populate][5]=block&populate[rooms][populate][4]=room_blockings&populate[rooms][populate][3]=room_allocations.booking_request.guests&populate[rooms][populate][2]=room_allocations.booking_request.recommendation_letter&populate[rooms][populate][1]=room_allocations.booking_request&populate[rooms][populate][0]=room_allocations.guests.booking_request.recommendation_letter`,
  createBlock: "/blocks",
  updateBlock: (id) => `/blocks/${id}`,
  deleteBlock: (id) => `/blocks/${id}`,
};

export default blockEndpoints;
