import apiClient from "../../../apiClient";
import bedEndpoints from "../endpoints/bedEndpoints";

// Fetch all beds
export const getBeds = () => apiClient.get(bedEndpoints.getBeds);

// Fetch a specific bed by ID
export const getBedById = (id) => apiClient.get(bedEndpoints.getBedById(id));

// Create a new bed
export const createBed = (data) =>
  apiClient.post(bedEndpoints.createBed, { data });

// Update a bed by ID
export const updateBed = (id, data) =>
  apiClient.put(bedEndpoints.updateBed(id), data);

// Delete a bed by ID
export const deleteBed = (id) => apiClient.delete(bedEndpoints.deleteBed(id));

// Fetch beds by room ID (if applicable)
export const getBedsByRoomId = (roomId) =>
  apiClient.get(`${bedEndpoints.getBeds}?roomId=${roomId}`);

// Fetch beds by user ID (if applicable)
export const getBedsByUser = (userId) =>
  apiClient.get(`${bedEndpoints.getBeds}?userId=${userId}`);
