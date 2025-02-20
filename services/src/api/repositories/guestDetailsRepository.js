import apiClient from "../../../apiClient";
import guestDetailsEndpoints from "../endpoints/guestDetailsEndpoints";

export const getGuestDetails = () =>
  apiClient.get(guestDetailsEndpoints.getGuestDetails);

export const getGuestDetailsById = (id) =>
  apiClient.get(guestDetailsEndpoints.getGuestDetailsById(id));

export const getAllGuestDetails = () =>
  apiClient.get(guestDetailsEndpoints.getAllGuestDetails);

export const createGuestDetails = (data) =>
  apiClient.post(guestDetailsEndpoints.createGuestDetails, { data });

export const updateGuestDetails = (id, data) =>
  apiClient.put(guestDetailsEndpoints.updateGuestDetails(id), { data });

export const deleteGuestDetails = (id) =>
  apiClient.delete(guestDetailsEndpoints.deleteGuestDetails(id));

export const getGuestDetailsByUserAndStatus = (userId, status) =>
  apiClient.get(
    `${guestDetailsEndpoints.getGuestDetails}?userId=${userId}&status=${status}`
  );

export const getGuestDetailsByUser = (userId) =>
  apiClient.get(`${guestDetailsEndpoints.getGuestDetails}?userId=${userId}`);

export const getGuestUniqueNo = () =>
  apiClient.get(guestDetailsEndpoints.getGuestUniqueNo);
