import { getPincodeDetails } from "../api/repositories/miscRepository";

/**
 * Get postal details by PIN code
 * Uses our backend proxy to avoid SSL certificate issues
 */
export const fetchPincodeDetails = async (pincode) => {
  try {
    const response = await getPincodeDetails(pincode);
    return response.data;
  } catch (error) {
    console.error(`Error fetching PIN code details for ${pincode}:`, error);
    throw error;
  }
}; 