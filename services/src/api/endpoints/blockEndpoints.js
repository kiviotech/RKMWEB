const blockEndpoints = {
  getBlocks: "/blocks?populate=*",
  getBlockById: (id) => `/blocks/${id}`,
  createBlock: "/blocks",
  updateBlock: (id) => `/blocks/${id}`,
  deleteBlock: (id) => `/blocks/${id}`,
};

export default blockEndpoints;
