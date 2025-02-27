import apiClient from "../../../apiClient";
import donationsEndpoints from "../endpoints/donationsEndpoints";

// Fetch all donations
export const getDonations = () =>
  apiClient.get(donationsEndpoints.getDonations());

// Fetch a specific donation by ID
export const getDonationById = (id) =>
  apiClient.get(donationsEndpoints.getDonationById(id));

// Create a new donation
export const createDonation = (data) =>
  apiClient.post(donationsEndpoints.createDonation, data);

// Update a donation by ID
export const updateDonation = (id, data) =>
  apiClient.put(donationsEndpoints.updateDonation(id), data);

// Delete a donation by ID
export const deleteDonation = (id) =>
  apiClient.delete(donationsEndpoints.deleteDonation(id));

// Fetch donations by field
export const getDonationsByField = (field, value) =>
  apiClient.get(`${donationsEndpoints.getDonations}&${field}=${value}`);

// Fetch donations by user ID
export const getDonationsByUser = (userId) =>
  apiClient.get(`${donationsEndpoints.getDonations}&userId=${userId}`);

// Fetch donation reasons
export const getDonationReasons = () =>
  apiClient.get(donationsEndpoints.getDonationReasons);