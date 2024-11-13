import apiClient from "../../apiClient";
import roomAllocationsEndpoints from "../api/endpoints/roomAllocationEndpoints";

// Fetch all room allocations
export const fetchRoomAllocations = async () => {
  try {
    const response = await apiClient.get(
      roomAllocationsEndpoints.getRoomAllocations
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching room allocations:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// Fetch a single room allocation by its ID
export const fetchRoomAllocationById = async (id) => {
  try {
    const response = await apiClient.get(
      roomAllocationsEndpoints.getRoomAllocationsById(id)
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching room allocation with ID ${id}:`,
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// Create a new room allocation
export const createNewRoomAllocation = async (data) => {
  try {
    const token = localStorage.getItem("authToken"); // Ensure the token is set correctly
    if (!token) throw new Error("No authorization token found");

    const response = await apiClient.post(
      roomAllocationsEndpoints.createRoomAllocations,
      { data }, // Payload in { data: {...} } format as Strapi expects
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          "Content-Type": "application/json", // Ensure correct content-type
        },
      }
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.error(
      "Error creating new room allocation:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// Update an existing room allocation by ID
export const updateRoomAllocationById = async (id, data) => {
  try {
    const token = localStorage.getItem("authToken"); // Ensure the token is set correctly
    if (!token) throw new Error("No authorization token found");

    const response = await apiClient.put(
      roomAllocationsEndpoints.updateRoomAllocations(id),
      { data }, // Send the data in { data: {...} } format for Strapi
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          "Content-Type": "application/json", // Ensure correct content-type
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating room allocation with ID ${id}:`,
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// Delete a room allocation by ID
export const deleteRoomAllocationById = async (id) => {
  try {
    const token = localStorage.getItem("authToken"); // Ensure the token is set correctly
    if (!token) throw new Error("No authorization token found");

    const response = await apiClient.delete(
      roomAllocationsEndpoints.deleteRoomAllocations(id),
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          "Content-Type": "application/json", // Ensure correct content-type
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting room allocation with ID ${id}:`,
      error.response ? error.response.data : error
    );
    throw error;
  }
};
