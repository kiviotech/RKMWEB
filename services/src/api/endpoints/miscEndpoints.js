const miscEndpoints = {
  // Proxy endpoint for postal PIN code lookups
  getPincodeDetails: (pincode) => `/api/postal/pincode/${pincode}`,
};

export default miscEndpoints; 