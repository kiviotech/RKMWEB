import apiClient from "../../../apiClient";
import foodEndpoints from "../endpoints/foodEndpoints";

// Fetch all foods
export const getFoods = () => apiClient.get(foodEndpoints.getFoods);

// Fetch a specific food by ID
export const getFoodById = (id) => apiClient.get(foodEndpoints.getFoodById(id));

// Create a new food
export const createFood = (data) =>
  apiClient.post(foodEndpoints.createFood, { data });

// Update a food by ID
export const updateFood = (id, data) =>
  apiClient.put(foodEndpoints.updateFood(id), data);

// Delete a food by ID
export const deleteFood = (id) =>
  apiClient.delete(foodEndpoints.deleteFood(id));
