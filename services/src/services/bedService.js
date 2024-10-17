import {
  getBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed,
} from "../api/repositories/bedRepository";

// Fetch all beds
export const fetchBeds = async () => {
  try {
    const response = await getBeds();
    return response.data;
  } catch (error) {
    console.error("Error fetching beds:", error);
    throw error; // Re-throw to propagate the error to the caller
  }
};

// Fetch a specific bed by ID
export const fetchBedById = async (id) => {
  try {
    const response = await getBedById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bed by ID ${id}:`, error);
    throw error;
  }
};

// Create a new bed
export const createNewBed = async (data) => {
  try {
    const response = await createBed(data);
    return response.data;
  } catch (error) {
    console.error("Error creating bed:", error);
    throw error;
  }
};

// Update a bed by ID
export const updateBedById = async (id, data) => {
  try {
    const response = await updateBed(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating bed with ID ${id}:`, error);
    throw error;
  }
};

// Delete a bed by ID
export const deleteBedById = async (id) => {
  try {
    const response = await deleteBed(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting bed with ID ${id}:`, error);
    throw error;
  }
};
