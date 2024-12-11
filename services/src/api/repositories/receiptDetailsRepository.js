import apiClient from "../../../apiClient";
import receiptDetailsEndpoints from "../endpoints/receiptDetailsEndpoints";

// Fetch all receipt details
export const getReceiptDetails = () =>
  apiClient.get(receiptDetailsEndpoints.getReceiptDetails);

// Fetch a specific receipt detail by ID
export const getReceiptDetailById = (id) =>
  apiClient.get(receiptDetailsEndpoints.getReceiptDetailById(id));

// Create a new receipt detail
export const createReceiptDetail = (data) =>
  apiClient.post(receiptDetailsEndpoints.createReceiptDetail, { data });

// Update a receipt detail by ID
export const updateReceiptDetail = (id, data) =>
  apiClient.put(receiptDetailsEndpoints.updateReceiptDetail(id), data);

// Delete a receipt detail by ID
export const deleteReceiptDetail = (id) =>
  apiClient.delete(receiptDetailsEndpoints.deleteReceiptDetail(id));

// Fetch receipt details by booking ID
export const getReceiptDetailsByBookingId = (bookingId) =>
  apiClient.get(
    `${receiptDetailsEndpoints.getReceiptDetails}?bookingId=${bookingId}`
  );

// Fetch receipt details by user ID
export const getReceiptDetailsByUserId = (userId) =>
  apiClient.get(
    `${receiptDetailsEndpoints.getReceiptDetails}?userId=${userId}`
  );

// Fetch receipt details by date range
export const getReceiptDetailsByDateRange = (startDate, endDate) =>
  apiClient.get(
    `${receiptDetailsEndpoints.getReceiptDetails}?startDate=${startDate}&endDate=${endDate}`
  );

// Fetch unique numbers
export const getUniqueNumbers = () =>
  apiClient.get(receiptDetailsEndpoints.getUniqueNumbers);
