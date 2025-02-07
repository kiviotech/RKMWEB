import {
  getRoomAllocations,
  getRoomAllocationById,
  createRoomAllocation,
  updateRoomAllocation,
  deleteRoomAllocation,
} from "../api/repositories/roomAllocationRepository";

// Fetch all room allocations
export const fetchRoomAllocations = async () => {
  try {
    const response = await getRoomAllocations();
    return response.data;
  } catch (error) {
    console.error("Error fetching room allocations:", error);
    throw error;
  }
};

// Fetch a specific room allocation by ID
export const fetchRoomAllocationById = async (id) => {
  try {
    const response = await getRoomAllocationById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room allocation by ID ${id}:`, error);
    throw error;
  }
};

// Create a new room allocation
export const createNewRoomAllocation = async (data) => {
  try {
    const response = await createRoomAllocation(data);
    return response.data;
  } catch (error) {
    console.error("Error creating room allocation:", error);
    throw error;
  }
};

// Update a room allocation by ID
export const updateRoomAllocationById = async (id, data) => {
  try {
    const response = await updateRoomAllocation(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating room allocation with ID ${id}:`, error);
    throw error;
  }
};

// Delete a room allocation by ID
export const deleteRoomAllocationById = async (id) => {
  try {
    const response = await deleteRoomAllocation(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting room allocation with ID ${id}:`, error);
    throw error;
  }
};
