import {
  getFloors,
  getFloorById,
  createFloor,
  updateFloor,
  deleteFloor,
} from "../api/repositories/floorRepository";

// Fetch all floors
export const fetchFloors = async () => {
  try {
    const response = await getFloors();
    return response.data;
  } catch (error) {
    console.error("Error fetching floors:", error);
    throw error; // Re-throw to propagate the error to the caller
  }
};

// Fetch a specific floor by ID
export const fetchFloorById = async (id) => {
  try {
    const response = await getFloorById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching floor by ID ${id}:`, error);
    throw error;
  }
};

// Create a new floor
export const createNewFloor = async (data) => {
  try {
    const response = await createFloor(data);
    return response.data;
  } catch (error) {
    console.error("Error creating floor:", error);
    throw error;
  }
};

// Update a floor by ID
export const updateFloorById = async (id, data) => {
  try {
    const response = await updateFloor(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating floor with ID ${id}:`, error);
    throw error;
  }
};

// Delete a floor by ID
export const deleteFloorById = async (id) => {
  try {
    const response = await deleteFloor(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting floor with ID ${id}:`, error);
    throw error;
  }
};
