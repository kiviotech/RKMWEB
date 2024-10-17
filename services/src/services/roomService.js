import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../api/repositories/roomRepository";

// Fetch all rooms
export const fetchRooms = async () => {
  try {
    const response = await getRooms();
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error; // Re-throw to propagate the error to the caller
  }
};

// Fetch a specific room by ID
export const fetchRoomById = async (id) => {
  try {
    const response = await getRoomById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room by ID ${id}:`, error);
    throw error;
  }
};

// Create a new room
export const createNewRoom = async (data) => {
  try {
    const response = await createRoom(data);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

// Update a room by ID
export const updateRoomById = async (id, data) => {
  try {
    const response = await updateRoom(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating room with ID ${id}:`, error);
    throw error;
  }
};

// Delete a room by ID
export const deleteRoomById = async (id) => {
  try {
    const response = await deleteRoom(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting room with ID ${id}:`, error);
    throw error;
  }
};
