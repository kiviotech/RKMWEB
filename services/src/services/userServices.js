import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername,
  getUserByEmail,
} from "../api/repositories/userRepository";

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await getUsers();
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch user by ID
export const fetchUserById = async (id) => {
  try {
    const response = await getUserById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user by ID ${id}:`, error);
    throw error;
  }
};

// Create new user
export const createNewUser = async (data) => {
  try {
    const response = await createUser(data);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update user by ID
export const updateUserById = async (id, data) => {
  try {
    const response = await updateUser(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Delete user by ID
export const deleteUserById = async (id) => {
  try {
    const response = await deleteUser(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

// Fetch user by username
export const fetchUserByUsername = async (username) => {
  try {
    const response = await getUserByUsername(username);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user by username ${username}:`, error);
    throw error;
  }
};

// Fetch user by email
export const fetchUserByEmail = async (email) => {
  try {
    const response = await getUserByEmail(email);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    throw error;
  }
};