import apiClient, { BASE_URL } from "../../../../../services/apiClient";

// Check if guest exists by Aadhaar (unique_no)
export async function checkGuestByAadhaar(aadhaar) {
  try {
    const response = await apiClient.get(`/guest-details/findByAadhaar/${aadhaar}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { exists: false };
    }
    throw error;
  }
}

// Fetch guest details by ID (for autofill after OTP)
export async function fetchGuestDetailsById(guestId) {
  try {
    const response = await apiClient.get(`/guest-details/${guestId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
