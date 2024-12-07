const donationsEndpoints = {
  getDonations: "/donations?populate=*",
  getDonationById: (id) => `/donations/${id}?populate=*`,
  createDonation: "/donations",
  updateDonation: (id) => `/donations/${id}`,
  deleteDonation: (id) => `/donations/${id}`,
  getDonationReasons: "/donations?populate=*",
};

export default donationsEndpoints;
