import apiClient from "../../../apiClient";
import roomAllocationsEndpoints from "../endpoints/roomAllocationEndpoints";

export const getRoomAllocations = () =>
  apiClient.get(roomAllocationsEndpoints.getRoomAllocations);

export const getRoomAllocationById = (id) =>
  apiClient.get(roomAllocationsEndpoints.getRoomAllocationsById(id));

export const createRoomAllocation = (data) =>
  apiClient.post(roomAllocationsEndpoints.createRoomAllocations, { data });

export const updateRoomAllocation = (id, data) =>
  apiClient.put(roomAllocationsEndpoints.updateRoomAllocations(id), { data });

export const deleteRoomAllocation = (id) =>
  apiClient.delete(roomAllocationsEndpoints.deleteRoomAllocations(id));

export const getRoomAllocationsByUserAndStatus = (userId, status) =>
  apiClient.get(
    `${roomAllocationsEndpoints.getRoomAllocations}?userId=${userId}&status=${status}`
  );

export const getRoomAllocationsByUser = (userId) =>
  apiClient.get(
    `${roomAllocationsEndpoints.getRoomAllocations}?userId=${userId}`
  );
