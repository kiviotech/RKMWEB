import {
  getBlocks,
  getBlocksWithRooms,
  getBlockById,
  createBlock,
  updateBlock,
  deleteBlock,
} from "../api/repositories/blockRepository";

// Fetch all blocks
export const fetchBlocks = async () => {
  try {
    const response = await getBlocks();
    return response.data;
  } catch (error) {
    console.error("Error fetching blocks:", error);
    throw error; // Re-throw to propagate the error to the caller
  }
};

// Fetch all blocks with populated rooms
export const fetchBlocksWithRooms = async () => {
  try {
    const response = await getBlocksWithRooms();
    return response.data;
  } catch (error) {
    console.error("Error fetching blocks with rooms:", error);
    throw error;
  }
};

// Fetch a specific block by ID
export const fetchBlockById = async (id) => {
  try {
    const response = await getBlockById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching block by ID ${id}:`, error);
    throw error;
  }
};

// Create a new block
export const createNewBlock = async (data) => {
  try {
    const response = await createBlock(data);
    return response.data;
  } catch (error) {
    console.error("Error creating block:", error);
    throw error;
  }
};

// Update a block by ID
export const updateBlockById = async (id, data) => {
  try {
    const response = await updateBlock(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating block with ID ${id}:`, error);
    throw error;
  }
};

// Delete a block by ID
export const deleteBlockById = async (id) => {
  try {
    const response = await deleteBlock(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting block with ID ${id}:`, error);
    throw error;
  }
};
