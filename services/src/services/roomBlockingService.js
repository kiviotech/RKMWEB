import {
  getRoomBlockings,
  getRoomBlockingById,
  createRoomBlocking,
  updateRoomBlocking,
  deleteRoomBlocking,
} from "../api/repositories/roomBlockingRepository";

export const fetchRoomBlockings = async () => {
  try {
    const response = await getRoomBlockings();
    return response.data;
  } catch (error) {
    console.error("Error fetching room blockings:", error);
    throw error;
  }
};

export const fetchRoomBlockingById = async (id) => {
  try {
    const response = await getRoomBlockingById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room blocking by ID ${id}:`, error);
    throw error;
  }
};

export const createNewRoomBlocking = async (data) => {
  try {
    const response = await createRoomBlocking(data);
    return response.data;
  } catch (error) {
    console.error("Error creating room blocking:", error);
    throw error;
  }
};

export const updateRoomBlockingById = async (id, data) => {
  try {
    const response = await updateRoomBlocking(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating room blocking with ID ${id}:`, error);
    throw error;
  }
};

export const deleteRoomBlockingById = async (id) => {
  try {
    const response = await deleteRoomBlocking(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting room blocking with ID ${id}:`, error);
    throw error;
  }
};
