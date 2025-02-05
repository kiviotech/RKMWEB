import apiClient from "../../../apiClient";
import roomBlockingEndpoints from "../endpoints/roomBlockingEndpoints";

export const getRoomBlockings = () => {
  return apiClient.get(roomBlockingEndpoints.getRoomBlockings);
};

export const getRoomBlockingById = (id) => {
  return apiClient.get(roomBlockingEndpoints.getRoomBlockingById(id));
};

export const createRoomBlocking = (data) => {
  return apiClient.post(roomBlockingEndpoints.createRoomBlocking, { data });
};

export const updateRoomBlocking = (id, data) => {
  return apiClient.put(roomBlockingEndpoints.updateRoomBlocking(id), { data });
};

export const deleteRoomBlocking = (id) => {
  return apiClient.delete(roomBlockingEndpoints.deleteRoomBlocking(id));
};
