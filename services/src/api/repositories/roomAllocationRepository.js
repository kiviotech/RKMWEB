import apiClient from "../../../apiClient";
import roomAllocationEndpoints from "../endpoints/roomAllocationEndpoints";

// Fetch all room allocations
export const getRoomAllocations = () =>
  apiClient.get(roomAllocationEndpoints.getRoomAllocations);

// Fetch a specific room allocation by ID
export const getRoomAllocationById = (id) =>
  apiClient.get(roomAllocationEndpoints.getRoomAllocationById(id));

// Create a new room allocation
export const createRoomAllocation = (data) =>
  apiClient.post(roomAllocationEndpoints.createRoomAllocation, { data });

// Update a room allocation by ID
export const updateRoomAllocation = (id, data) =>
  apiClient.put(roomAllocationEndpoints.updateRoomAllocation(id), { data });

// Delete a room allocation by ID
export const deleteRoomAllocation = (id) =>
  apiClient.delete(roomAllocationEndpoints.deleteRoomAllocation(id));
