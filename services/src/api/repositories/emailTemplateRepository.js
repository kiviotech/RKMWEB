import apiClient from "../../../apiClient";
import emailTemplateEndpoints from "../endpoints/emailTemplateEndpoints";

// Get booking confirmation template
export const getBookingConfirmationTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getBookingConfirmation);

// Send booking confirmation email
export const sendBookingConfirmationEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendBookingConfirmation, { data });
