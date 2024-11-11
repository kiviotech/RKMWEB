import {
  getDonations,
  getDonationById,
  createDonation as createNewDonation,
  updateDonation as updateDonationById,
  deleteDonation as deleteDonationById,
  getDonationsByField,
  getDonationsByUser,
} from "../api/repositories/donationsRepository";

// Fetch all donations
export const fetchAllDonations = async () => {
  try {
    const response = await getDonations();
    return response.data;
  } catch (error) {
    throw new Error("Error fetching donations: " + error.message);
  }
};

// Fetch a specific donation by ID
export const fetchDonationById = async (id) => {
  try {
    const response = await getDonationById(id);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching donation: " + error.message);
  }
};

// Create a new donation
export const createDonation = async (data) => {
  try {
    const response = await createNewDonation(data);
    return response.data;
  } catch (error) {
    throw new Error("Error creating donation: " + error.message);
  }
};

// Update a donation by ID
export const updateDonation = async (id, data) => {
  try {
    const response = await updateDonationById(id, data);
    return response.data;
  } catch (error) {
    throw new Error("Error updating donation: " + error.message);
  }
};

// Delete a donation by ID
export const deleteDonation = async (id) => {
  try {
    const response = await deleteDonationById(id);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting donation: " + error.message);
  }
};

// Fetch donations by a specific field (optional feature)
export const fetchDonationsByField = async (field, value) => {
  try {
    const response = await getDonationsByField(field, value);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching donations by field: " + error.message);
  }
};

// Fetch donations by user ID (optional feature)
export const fetchDonationsByUser = async (userId) => {
  try {
    const response = await getDonationsByUser(userId);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching donations by user: " + error.message);
  }
};
