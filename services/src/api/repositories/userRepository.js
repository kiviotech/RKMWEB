import apiClient from "../../../apiClient";
import userEndpoints from "../endpoints/userEndpoints";

// Fetch all users
export const getUsers = () => 
  apiClient.get(userEndpoints.getUsers);

// Fetch a specific user by ID
export const getUserById = (id) =>
  apiClient.get(userEndpoints.getUserById(id));

// Create a new user
export const createUser = (data) =>
  apiClient.post(userEndpoints.createUser, { data });

// Update a user by ID
export const updateUser = (id, data) =>
  apiClient.put(userEndpoints.updateUser(id), { data });

// Delete a user by ID
export const deleteUser = (id) =>
  apiClient.delete(userEndpoints.deleteUser(id));

// Get user by username
export const getUserByUsername = (username) =>
  apiClient.get(userEndpoints.getUserByUsername(username));

// Get user by email
export const getUserByEmail = (email) =>
  apiClient.get(userEndpoints.getUserByEmail(email));