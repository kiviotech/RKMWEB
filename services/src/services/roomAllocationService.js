import apiClient from "../../apiClient";
import roomAllocationsEndpoints from "../api/endpoints/roomAllocationEndpoints";
import {
  getRoomAllocationById,
  getRoomAllocations,
  createRoomAllocation,
  updateRoomAllocation,
  deleteRoomAllocation,
} from "../api/repositories/roomAllocationRepository";

export const fetchRoomAllocations = async () => {
  try {
    const response = await getRoomAllocations();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRoomAllocationById = async (id) => {
  try {
    const response = await getRoomAllocationById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room allocation with ID ${id}:`, error);
    throw error;
  }
};

export const createNewRoomAllocation = async (data) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await apiClient.post(
      roomAllocationsEndpoints.createRoomAllocations,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating new room allocation:", error);
    throw error;
  }
};

export const updateRoomAllocationById = async (id, data) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await apiClient.put(
      roomAllocationsEndpoints.updateRoomAllocations(id),
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating room allocation with ID ${id}:`, error);
    throw error;
  }
};

export const deleteRoomAllocationById = async (id) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await apiClient.delete(
      roomAllocationsEndpoints.deleteRoomAllocations(id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting room allocation with ID ${id}:`, error);
    throw error;
  }
};
