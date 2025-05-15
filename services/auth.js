import apiClient from "./apiClient";
import { AUTH_LOGIN } from "../services/endPoints/auth/authEndPoint"; // Adjust the import path as necessary
import { saveToken } from "../utils/storage";
import { AUTH_REGISTER } from "../services/endPoints/auth/authEndPoint";
import { AUTH_FORGOT_PASSWORD } from "../services/endPoints/auth/authEndPoint";
import { useAuthStore } from "../store/authStore";
import { logUserLogin } from "./userActivityLog";

export async function loginUser({ identifier, password, browserInfo = {} }) {
  try {
    console.log("[AUTH DEBUG] Login attempt for:", identifier);
    
    // Determine whether to use password or OTP for login
    const loginPayload = password ? { identifier, password } : { identifier };
    console.log("[AUTH DEBUG] Login payload:", JSON.stringify(loginPayload));

    // Make the API call to the role-based login endpoint
    console.log("[AUTH DEBUG] Calling endpoint: '/auth/local/role'");
    const response = await apiClient.post('/auth/local/role', loginPayload);

    // Extract JWT, user data, and permissions from the response
    const { jwt, user, permissions } = response.data;
    console.log("[AUTH DEBUG] Login successful!");
    console.log("[AUTH DEBUG] JWT received:", jwt ? "[VALID JWT TOKEN]" : "[MISSING]");
    console.log("[AUTH DEBUG] User data:", JSON.stringify(user, null, 2));
    console.log("[AUTH DEBUG] Permissions count:", permissions ? permissions.length : 0);

    // Ensure user has expected properties
    console.log("[AUTH DEBUG] Normalizing user data...");
    console.log("[AUTH DEBUG] Original role info:", JSON.stringify(user.role));
    console.log("[AUTH DEBUG] Original user_role:", user.user_role);
    
    const normalizedUser = {
      ...user,
      // If for some reason role info is missing, create a default structure to prevent UI errors
      role: user.role || { 
        type: user.user_role || 'guest', 
        name: user.user_role ? user.user_role.charAt(0).toUpperCase() + user.user_role.slice(1) : 'Guest'
      }
    };
    
    console.log("[AUTH DEBUG] Normalized user data:", JSON.stringify(normalizedUser, null, 2));
    console.log("[AUTH DEBUG] Setting user in auth store...");
    useAuthStore.getState().setUser(normalizedUser);
    
    console.log("[AUTH DEBUG] Setting token in auth store...");
    useAuthStore.getState().setToken(jwt);
    
    // Store permissions in auth store
    // The API returns a full list of permission strings
    console.log("[AUTH DEBUG] Setting permissions in auth store...");
    useAuthStore.getState().setPermissions(permissions || []);
    
    // Save the JWT to secure storage
    saveToken(jwt);
    
    // Log the successful login activity
    try {
      logUserLogin({
        userId: normalizedUser.id,
        username: normalizedUser.username,
        userRole: normalizedUser.role?.type || normalizedUser.user_role,
        method: 'password',
        success: true,
        details: {
          ...browserInfo,
          timestamp: new Date().toISOString(),
          loginMethod: 'password'
        }
      });
    } catch (logError) {
      // Don't let logging errors affect the login flow
      console.error('[AUTH] Failed to log login activity:', logError);
    }

    return { jwt, user: normalizedUser, permissions };
  } catch (error) {
    // Handle errors appropriately
    console.error("[AUTH ERROR] Login failed!");
    console.error("[AUTH ERROR] Error object:", error);
    console.error("[AUTH ERROR] Response data:", error.response?.data);
    console.error("[AUTH ERROR] Status code:", error.response?.status);
    
    // Log the failed login attempt
    try {
      logUserLogin({
        username: identifier,
        userId: null, // We don't have a user ID for failed logins
        userRole: null,
        method: 'password',
        success: false,
        details: {
          ...browserInfo,
          timestamp: new Date().toISOString(),
          loginMethod: 'password',
          errorMessage: error.message || 'Authentication failed'
        }
      });
    } catch (logError) {
      console.error('[AUTH] Failed to log failed login attempt:', logError);
    }
    
    throw new Error(error.response?.data?.error?.message || error.message || "Failed to login");
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

import { logPasswordChange } from "./userActivityLog";

export async function changePassword({ email, username }) {
  try {
    // Create the payload for the forgot password request
    const forgotJson = { email };
    const response = await apiClient.post(AUTH_FORGOT_PASSWORD, forgotJson);
    console.log("auth.js - forgot Password", response);
    
    // Get the current user if available
    const user = useAuthStore.getState().user;
    
    // Log the password change request
    try {
      logPasswordChange({
        userId: user?.id,
        username: user?.username || username,
        targetUserId: response.data?.user?.id,
        targetUsername: email, // Using email as username since we don't have the actual username
        success: true
      });
    } catch (logError) {
      console.error('[AUTH] Failed to log password change activity:', logError);
    }
    
    return response;
  } catch (error) {
    // Log the failed password change attempt
    try {
      const user = useAuthStore.getState().user;
      logPasswordChange({
        userId: user?.id,
        username: user?.username || username,
        targetUserId: null,
        targetUsername: email,
        success: false
      });
    } catch (logError) {
      console.error('[AUTH] Failed to log failed password change attempt:', logError);
    }
    
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

/**
 * Request OTP for account-admin user
 * @param {string} userId - User ID for the account admin
 * @returns {Promise<Object>} - Response with success/error
 */
export async function requestOtp(userId) {
  try {
    console.log("[OTP] Requesting OTP for user:", userId);
    
    // Make API call to request OTP
    const response = await apiClient.post('/auth/otp/request', { userId });
    
    console.log("[OTP] OTP request successful");
    return { success: true, message: response.data?.message || 'OTP sent successfully' };
  } catch (error) {
    console.error("[OTP] Error requesting OTP:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Failed to send OTP'
    };
  }
}

/**
 * Verify OTP entered by account-admin user
 * @param {string} userId - User ID for the account admin
 * @param {string} otp - OTP code entered by user
 * @returns {Promise<Object>} - Response with success/error
 */
export async function verifyOtp(userId, otp) {
  try {
    console.log("[OTP] Verifying OTP for user:", userId);
    
    // Make API call to verify OTP
    const response = await apiClient.post('/auth/otp/verify', { userId, otp });
    
    console.log("[OTP] OTP verification successful");
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error("[OTP] Error verifying OTP:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Invalid OTP'
    };
  }
}
