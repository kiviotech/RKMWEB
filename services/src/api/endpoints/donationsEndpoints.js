const donationsEndpoints = {
  getDonations: () => 
    `/donations?populate=*&pagination[start]=0&pagination[limit]=1000&sort[0]=createdAt:desc`,
  getDonationById: (id) => `/donations/${id}?populate=*`,
  createDonation: "/donations",
  updateDonation: (id) => `/donations/${id}`,
  deleteDonation: (id) => `/donations/${id}`,
  getDonationReasons: "/donations?populate=*",
};

export default donationsEndpoints;
