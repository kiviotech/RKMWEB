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
export const createNewDonation = async (donationData) => {
  try {
    const response = await createDonation(donationData);
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
