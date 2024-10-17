import apiClient from "../../../apiClient";
import floorEndpoints from "../endpoints/floorEndpoints";

// Fetch all floors
export const getFloors = () => apiClient.get(floorEndpoints.getFloors);

// Fetch a specific floor by ID
export const getFloorById = (id) =>
  apiClient.get(floorEndpoints.getFloorById(id));

// Create a new floor
export const createFloor = (data) =>
  apiClient.post(floorEndpoints.createFloor, { data });

// Update a floor by ID
export const updateFloor = (id, data) =>
  apiClient.put(floorEndpoints.updateFloor(id), data);

// Delete a floor by ID
export const deleteFloor = (id) =>
  apiClient.delete(floorEndpoints.deleteFloor(id));

// Fetch floors by building ID (if applicable)
export const getFloorsByBuildingId = (buildingId) =>
  apiClient.get(`${floorEndpoints.getFloors}?buildingId=${buildingId}`);

// Fetch floors by user ID (if applicable)
export const getFloorsByUser = (userId) =>
  apiClient.get(`${floorEndpoints.getFloors}?userId=${userId}`);
