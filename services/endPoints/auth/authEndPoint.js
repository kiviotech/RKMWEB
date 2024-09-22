
import { BASE_URL } from '../../apiClient';  // Import BASE_URL from apiClient.js
// Auth endpoints
export const AUTH_LOGIN = `${BASE_URL}/auth/local`;
export const AUTH_REGISTER = `${BASE_URL}/auth/local/register`;
export const AUTH_FORGOT_PASSWORD = `${BASE_URL}/auth/forgot-password`;
export const AUTH_RESET_PASSWORD = `${BASE_URL}/auth/reset-password`;
export const AUTH_CHANGE_PASSWORD = `${BASE_URL}/auth/change-password`;
export const AUTH_EMAIL_CONFIRMATION = `${BASE_URL}/auth/email-confirmation`;
export const AUTH_SEND_EMAIL_CONFIRMATION = `${BASE_URL}/auth/send-email-confirmation`;