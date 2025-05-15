import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationsByField,
  getDonationsByUser,
  getDonationReasons,
} from "../api/repositories/donationsRepository";

// Fetch all donations
export const fetchDonations = async () => {
  try {
    const response = await getDonations();
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw error;
  }
};

// Fetch a specific donation by ID
export const fetchDonationById = async (id) => {
  try {
    const response = await getDonationById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donation by ID ${id}:`, error);
    throw error;
  }
};

// Create a new donation
export const createNewDonation = async (data) => {
  try {
    const response = await createDonation(data);
    return response.data;
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
};

// Update a donation by ID
export const updateDonationById = async (id, data) => {
  try {
    const response = await updateDonation(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating donation with ID ${id}:`, error);
    throw error;
  }
};

// Delete a donation by ID
export const deleteDonationById = async (id) => {
  try {
    const response = await deleteDonation(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting donation with ID ${id}:`, error);
    throw error;
  }
};

// Fetch donations by field
export const fetchDonationsByField = async (field, value) => {
  try {
    const response = await getDonationsByField(field, value);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donations by ${field}:`, error);
    throw error;
  }
};

// Fetch donations by user
export const fetchDonationsByUser = async (userId) => {
  try {
    const response = await getDonationsByUser(userId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donations for user ${userId}:`, error);
    throw error;
  }
};

// Fetch donation reasons
export const fetchDonationReasons = async () => {
  try {
    const response = await getDonationReasons();
    return response.data;
  } catch (error) {
    console.error("Error fetching donation reasons:", error);
    throw error;
  }
};

// Fetch donation statistics for dashboard
export const fetchDonationStats = async () => {
  try {
    // Fetch all donations to calculate statistics
    const donations = await fetchDonations();
    
    if (!donations || !donations.data) {
      return {
        totalAmount: 0,
        monthlyAmount: 0,
        donationCount: 0,
        recentDonations: [],
        yearlyTrend: Array(12).fill(0)
      };
    }
    
    // Calculate total donation amount
    const totalAmount = donations.data.reduce((sum, donation) => {
      return sum + (parseFloat(donation.attributes.amount) || 0);
    }, 0);
    
    // Calculate monthly amount (donations in the current month)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyDonations = donations.data.filter(donation => {
      const donationDate = new Date(donation.attributes.date);
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    });
    
    const monthlyAmount = monthlyDonations.reduce((sum, donation) => {
      return sum + (parseFloat(donation.attributes.amount) || 0);
    }, 0);
    
    // Get recent donations (last 5)
    const recentDonations = [...donations.data]
      .sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date))
      .slice(0, 5);
    
    // Calculate yearly trend (monthly donations for the last 12 months)
    const yearlyTrend = Array(12).fill(0);
    donations.data.forEach(donation => {
      const donationDate = new Date(donation.attributes.date);
      const month = donationDate.getMonth();
      const year = donationDate.getFullYear();
      
      if (year === currentYear || (year === currentYear - 1 && month > currentMonth)) {
        const index = (month - currentMonth + 12) % 12;
        yearlyTrend[index] += parseFloat(donation.attributes.amount) || 0;
      }
    });
    
    return {
      totalAmount,
      monthlyAmount,
      donationCount: donations.data.length,
      recentDonations,
      yearlyTrend
    };
  } catch (error) {
    console.error("Error fetching donation statistics:", error);
    // Return default values if there's an error
    return {
      totalAmount: 0,
      monthlyAmount: 0,
      donationCount: 0,
      recentDonations: [],
      yearlyTrend: Array(12).fill(0)
    };
  }
};