import {
  getDeekshas,
  getDeekshaById,
  createDeeksha as createNewDeeksha,
  updateDeeksha as updateDeekshaById,
  deleteDeeksha as deleteDeekshaById,
  getDeekshasByField,
  getDeekshasByUser,
} from "../api/repositories/deekshaRepository";

// Fetch all deekshas
export const fetchAllDeekshas = async () => {
  try {
    const response = await getDeekshas();
    return response.data;
  } catch (error) {
    throw new Error("Error fetching deekshas: " + error.message);
  }
};

// Create a new deeksha
export const createDeeksha = async (data) => {
  try {
    const response = await createNewDeeksha(data);
    return response.data;
  } catch (error) {
    throw new Error("Error creating deeksha: " + error.message);
  }
};

// Fetch a specific deeksha by ID
export const fetchDeekshaById = async (id) => {
  try {
    const response = await getDeekshaById(id);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching deeksha: " + error.message);
  }
};

// Update a deeksha by ID
export const updateDeeksha = async (id, data) => {
  try {
    const response = await updateDeekshaById(id, data);
    return response.data;
  } catch (error) {
    throw new Error("Error updating deeksha: " + error.message);
  }
};

// Delete a deeksha by ID
export const deleteDeeksha = async (id) => {
  try {
    const response = await deleteDeekshaById(id);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting deeksha: " + error.message);
  }
};

// Fetch deekshas by a specific field (optional feature)
export const fetchDeekshasByField = async (field, value) => {
  try {
    const response = await getDeekshasByField(field, value);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching deekshas by field: " + error.message);
  }
};

// Fetch deekshas by user ID (optional feature)
export const fetchDeekshasByUser = async (userId) => {
  try {
    const response = await getDeekshasByUser(userId);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching deekshas by user: " + error.message);
  }
};
