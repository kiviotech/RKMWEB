import {
  getGuestDetails,
  getGuestDetailsById,
  createGuestDetails,
  updateGuestDetails,
  deleteGuestDetails,
  getGuestDetailsByUserAndStatus,
  getGuestDetailsByUser,
  getGuestUniqueNo,
  getAllGuestDetails,
} from "../api/repositories/guestDetailsRepository";

// Fetch all guest details
export const fetchGuestDetails = async () => {
  try {
    const response = await getGuestDetails();
    return response.data;
  } catch (error) {
    console.error("Error fetching guest details:", error);
    throw error;
  }
};

// Fetch guest details by ID
export const fetchGuestDetailsById = async (id) => {
  try {
    const response = await getGuestDetailsById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching guest details by ID ${id}:`, error);
    throw error;
  }
};

// Create new guest details
export const createNewGuestDetails = async (data) => {
  try {
    const response = await createGuestDetails(data);
    return response.data;
  } catch (error) {
    console.error("Error creating guest details:", error);
    throw error;
  }
};

// Update guest details by ID
export const updateGuestDetailsById = async (id, data) => {
  try {
    const response = await updateGuestDetails(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating guest details with ID ${id}:`, error);
    throw error;
  }
};

// Delete guest details by ID
export const deleteGuestDetailsById = async (id) => {
  try {
    const response = await deleteGuestDetails(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting guest details with ID ${id}:`, error);
    throw error;
  }
};

// Fetch guest details by user ID and status
export const fetchGuestDetailsByUserAndStatus = async (userId, status) => {
  try {
    const response = await getGuestDetailsByUserAndStatus(userId, status);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching guest details by user ID ${userId} and status ${status}:`,
      error
    );
    throw error;
  }
};

// Fetch guest details by user ID
export const fetchGuestDetailsByUser = async (userId) => {
  try {
    const response = await getGuestDetailsByUser(userId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching guest details by user ID ${userId}:`, error);
    throw error;
  }
};

// Fetch guest unique numbers
export const fetchGuestUniqueNo = async () => {
  try {
    const response = await getGuestUniqueNo();
    return response.data;
  } catch (error) {
    console.error("Error fetching guest unique numbers:", error);
    throw error;
  }
};

// Fetch all guest details without any population
export const fetchAllGuestDetails = async () => {
  try {
    const response = await getAllGuestDetails();
    return response.data;
  } catch (error) {
    console.error("Error fetching all guest details:", error);
    throw error;
  }
};
