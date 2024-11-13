const deekshaEndpoints = {
  getDeekshas: "/deekshas?populate=*",
  getDeekshaById: (id) => `/deekshas/${id}`,
  createDeeksha: "/deekshas",
  updateDeeksha: (id) => `/deekshas/${id}`,
  deleteDeeksha: (id) => `/deekshas/${id}`,
};

export default deekshaEndpoints;
