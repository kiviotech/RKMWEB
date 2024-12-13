import apiClient from "../../../apiClient";
import celebrationsEndpoints from "../endpoints/celebrationsEndpoints";

export const getCelebrations = () =>
  apiClient.get(celebrationsEndpoints.getCelebrations);

export const getCelebrationById = (id) =>
  apiClient.get(celebrationsEndpoints.getCelebrationById(id));

export const createCelebration = (data) =>
  apiClient.post(celebrationsEndpoints.createCelebration, data);

export const updateCelebration = (id, data) =>
  apiClient.put(celebrationsEndpoints.updateCelebration(id), data);

export const deleteCelebration = (id) =>
  apiClient.delete(celebrationsEndpoints.deleteCelebration(id));
