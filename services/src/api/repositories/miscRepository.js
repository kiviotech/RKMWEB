import apiClient from "../../../apiClient";
import miscEndpoints from "../endpoints/miscEndpoints";

export const getPincodeDetails = (pincode) => 
  apiClient.get(miscEndpoints.getPincodeDetails(pincode)); 