import apiClient from "../../../apiClient";
import deekshaEndpoints from "../endpoints/deekshaEndpoints";

// Fetch all deekshas
export const getDeekshas = () => apiClient.get(deekshaEndpoints.getDeekshas);

// Fetch a specific deeksha by ID
export const getDeekshaById = (id) =>
  apiClient.get(deekshaEndpoints.getDeekshaById(id));

// Create a new deeksha
export const createDeeksha = (data) =>
  apiClient.post(deekshaEndpoints.createDeeksha, { data });

// Update a deeksha by ID
export const updateDeeksha = (id, data) =>
  apiClient.put(deekshaEndpoints.updateDeeksha(id), data);

// Delete a deeksha by ID
export const deleteDeeksha = (id) =>
  apiClient.delete(deekshaEndpoints.deleteDeeksha(id));

// Fetch deekshas by a specific field (if applicable)
export const getDeekshasByField = (field, value) =>
  apiClient.get(`${deekshaEndpoints.getDeekshas}?${field}=${value}`);

// Fetch deekshas by user ID (if applicable)
export const getDeekshasByUser = (userId) =>
  apiClient.get(`${deekshaEndpoints.getDeekshas}?userId=${userId}`);
