import {
  getDeekshas,
  getDeekshaById,
  createDeeksha,
  updateDeeksha,
  deleteDeeksha,
} from "../api/repositories/deekshaRepository";

// Fetch all deekshas
export const fetchDeekshas = async () => {
  try {
    const response = await getDeekshas();
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new deeksha
export const createNewDeeksha = async data => {
  try {
    const response = await createDeeksha(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a specific deeksha by ID
export const fetchDeekshaById = async id => {
  try {
    const response = await getDeekshaById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a deeksha by ID
export const updateDeekshaById = async (id, data) => {
  try {
    const response = await updateDeeksha(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a deeksha by ID
export const deleteDeekshaById = async id => {
  try {
    const response = await deleteDeeksha(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
