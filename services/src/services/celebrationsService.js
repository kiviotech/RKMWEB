import {
  getCelebrations,
  getCelebrationById,
  createCelebration,
  updateCelebration,
  deleteCelebration,
  getCelebrationsByDateRange,
} from "../api/repositories/celebrationsRepository";

// Fetch all celebrations
export const fetchCelebrations = async () => {
  try {
    const response = await getCelebrations();
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new celebration
export const createNewCelebration = async (data) => {
  try {
    const response = await createCelebration(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a specific celebration by ID
export const fetchCelebrationById = async (id) => {
  try {
    const response = await getCelebrationById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a celebration by ID
export const updateCelebrationById = async (id, data) => {
  try {
    const response = await updateCelebration(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a celebration by ID
export const deleteCelebrationById = async (id) => {
  try {
    const response = await deleteCelebration(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch celebrations within a date range
export const fetchCelebrationsByDateRange = async (
  arrivalDate,
  departureDate
) => {
  try {
    const response = await getCelebrationsByDateRange(
      arrivalDate,
      departureDate
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
