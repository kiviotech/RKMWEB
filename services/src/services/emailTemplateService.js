import {
  getBookingConfirmationTemplate,
  sendBookingConfirmationEmail,
} from "../api/repositories/emailTemplateRepository";

// Fetch booking confirmation template
export const fetchBookingConfirmationTemplate = async () => {
  try {
    const response = await getBookingConfirmationTemplate();
    return response.data;
  } catch (error) {
    console.error("Error fetching booking confirmation template:", error);
    throw error;
  }
};

// Send booking confirmation email
export const sendBookingConfirmation = async (data) => {
  try {
    const response = await sendBookingConfirmationEmail(data);
    return response.data;
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};
