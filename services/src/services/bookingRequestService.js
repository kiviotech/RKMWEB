import {
  getBookingRequests,
  getBookingRequestsByStatus,
  getBookingRequestById,
  createBookingRequest,
  updateBookingRequest,
  deleteBookingRequest,
} from "../api/repositories/bookingRequestRepository";

export const fetchBookingRequests = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await getBookingRequests();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBookingRequestsByStatus = async (status) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await getBookingRequestsByStatus(status);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBookingRequestById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await getBookingRequestById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewBookingRequest = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await createBookingRequest(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookingRequestById = async (id, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await updateBookingRequest(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBookingRequestById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await deleteBookingRequest(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
