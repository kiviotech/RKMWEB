import apiClient from "../../../apiClient";
import bookingRequestEndpoints from "../endpoints/bookingRequestEndpoints";

export const getBookingRequests = () =>
  apiClient.get(bookingRequestEndpoints.getBookingRequests());

export const getBookingRequestsByStatus = (status) =>
  apiClient.get(bookingRequestEndpoints.getBookingRequestsByStatus(status));

export const getBookingRequestById = (id) =>
  apiClient.get(bookingRequestEndpoints.getBookingRequestById(id));

export const createBookingRequest = (data) =>
  apiClient.post(bookingRequestEndpoints.createBookingRequest, data);

export const updateBookingRequest = (id, data) =>
  apiClient.put(bookingRequestEndpoints.updateBookingRequest(id), data);

export const deleteBookingRequest = (id) =>
  apiClient.delete(bookingRequestEndpoints.deleteBookingRequest(id));

// Example endpoint for fetching booking requests by userId and status (modify as needed)
export const getBookingRequestsByUserAndStatus = (userId, status) =>
  apiClient.get(
    bookingRequestEndpoints.getBookingRequestsByUserAndStatus(userId, status)
  );

export const getBookingRequestsByUser = (userId) =>
  apiClient.get(bookingRequestEndpoints.getBookingRequestsByUser(userId));
