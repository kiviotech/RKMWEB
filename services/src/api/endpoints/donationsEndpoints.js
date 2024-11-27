const donationsEndpoints = {
  getDonations: "/donations?populate=*",
  getDonationById: (id) => `/donations/${id}`,
  createDonation: "/donations",
  updateDonation: (id) => `/donations/${id}`,
  deleteDonation: (id) => `/donations/${id}`,
  getDonationReasons: "/donations?populate=*",
};

export default donationsEndpoints;
