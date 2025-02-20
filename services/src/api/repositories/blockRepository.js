import apiClient from "../../../apiClient";
import blockEndpoints from "../endpoints/blockEndpoints";

// Fetch all blocks
export const getBlocks = () => apiClient.get(blockEndpoints.getBlocks);

// Fetch a specific block by ID
export const getBlockById = (id) =>
  apiClient.get(blockEndpoints.getBlockById(id));

// Create a new block
export const createBlock = (data) =>
  apiClient.post(blockEndpoints.createBlock, { data });

// Update a block by ID
export const updateBlock = (id, data) =>
  apiClient.put(blockEndpoints.updateBlock(id), data);

// Delete a block by ID
export const deleteBlock = (id) =>
  apiClient.delete(blockEndpoints.deleteBlock(id));

// Fetch all blocks with populated rooms
export const getBlocksWithRooms = () =>
  apiClient.get(blockEndpoints.getBlocksWithRooms);
