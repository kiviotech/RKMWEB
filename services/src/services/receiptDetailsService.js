import {
  getReceiptDetails,
  getReceiptDetailById,
  createReceiptDetail,
  updateReceiptDetail,
  deleteReceiptDetail,
  getReceiptDetailsByBookingId,
  getReceiptDetailsByUserId,
  getReceiptDetailsByDateRange,
  getUniqueNumbers,
  getReceiptNumbers,
} from "../api/repositories/receiptDetailsRepository";

// Fetch all receipt details
export const fetchReceiptDetails = async () => {
  try {
    const response = await getReceiptDetails();
    return response.data;
  } catch (error) {
    console.error("Error fetching receipt details:", error);
    throw error;
  }
};

// Fetch a specific receipt detail by ID
export const fetchReceiptDetailById = async (id) => {
  try {
    const response = await getReceiptDetailById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching receipt detail by ID ${id}:`, error);
    throw error;
  }
};

// Create a new receipt detail
export const createNewReceiptDetail = async (data) => {
  try {
    const response = await createReceiptDetail(data);
    return response.data;
  } catch (error) {
    console.error("Error creating receipt detail:", error);
    throw error;
  }
};

// Update a receipt detail by ID
export const updateReceiptDetailById = async (id, data) => {
  try {
    const response = await updateReceiptDetail(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating receipt detail with ID ${id}:`, error);
    throw error;
  }
};

// Delete a receipt detail by ID
export const deleteReceiptDetailById = async (id) => {
  try {
    const response = await deleteReceiptDetail(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting receipt detail with ID ${id}:`, error);
    throw error;
  }
};

// Fetch receipt details by booking ID
export const fetchReceiptDetailsByBookingId = async (bookingId) => {
  try {
    const response = await getReceiptDetailsByBookingId(bookingId);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching receipt details for booking ${bookingId}:`,
      error
    );
    throw error;
  }
};

// Fetch receipt details by user ID
export const fetchReceiptDetailsByUserId = async (userId) => {
  try {
    const response = await getReceiptDetailsByUserId(userId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching receipt details for user ${userId}:`, error);
    throw error;
  }
};

// Fetch receipt details by date range
export const fetchReceiptDetailsByDateRange = async (startDate, endDate) => {
  try {
    const response = await getReceiptDetailsByDateRange(startDate, endDate);
    return response.data;
  } catch (error) {
    console.error(`Error fetching receipt details for date range:`, error);
    throw error;
  }
};

// Fetch unique numbers
export const fetchUniqueNumbers = async () => {
  try {
    const response = await getUniqueNumbers();
    return response.data;
  } catch (error) {
    console.error("Error fetching unique numbers:", error);
    throw error;
  }
};

// Fetch receipt numbers
export const fetchReceiptNumbers = async () => {
  try {
    const response = await getReceiptNumbers();
    return response.data;
  } catch (error) {
    console.error("Error fetching receipt numbers:", error);
    throw error;
  }
};
