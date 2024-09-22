import apiClient from "./apiClient";
import { AUTH_LOGIN } from "../services/endPoints/auth/authEndPoint"; // Adjust the import path as necessary
import { saveToken } from "../utils/storage";
import { AUTH_REGISTER } from "../services/endPoints/auth/authEndPoint";
import { AUTH_FORGOT_PASSWORD } from "../services/endPoints/auth/authEndPoint";

export async function loginUser({ identifier, password }) {
  try {
    // Determine whether to use password or OTP for login
    const loginPayload = password ? { identifier, password } : { identifier };

    // Make the API call to the login endpoint
    const response = await apiClient.post(AUTH_LOGIN, loginPayload);

    // Extract JWT and user data from the response
    const { jwt, user } = response.data;

    console.log("auth.js", jwt);
    // Save the JWT to secure storage
    saveToken(jwt);

    return { jwt, user };
  } catch (error) {
    // Handle errors appropriately
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function signUpUser({ username, email, password }) {
  try {
    // Create the payload for the signup request
    const signUpPayload = { username, email, password };
    // Make the API call to the signup endpoint
    const response = await apiClient.post(AUTH_REGISTER, signUpPayload);
    return response;
  } catch (error) {
    // Handle errors appropriately
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function changePassword({ email }) {
  try {
    // Create the payload for the opt request
    const forgotJson = { email };
    const response = await apiClient.post(AUTH_FORGOT_PASSWORD, forgotJson);
    console.log("auth.js - forgot Password", response);
    return response;
  } catch (error) {
    // Handle errors appropriately
    throw new Error(error.response?.data?.message || error.message);
  }
}

export async function resetPassword({ password, passwordConfirmation }) {
  try {
    // Create the payload for the opt request
    const forgotJson = { email };
    const response = await apiClient.post(AUTH_FORGOT_PASSWORD, forgotJson);
    console.log("auth.js - forgot Password", response);
    return response;
  } catch (error) {
    // Handle errors appropriately
    throw new Error(error.response?.data?.message || error.message);
  }
}
