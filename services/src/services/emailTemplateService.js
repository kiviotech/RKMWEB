import {
  getBookingConfirmationTemplate,
  sendBookingConfirmationEmail,
  getDormitoryConfirmationTemplate,
  sendDormitoryConfirmationEmail,
  getYatriNivasConfirmationTemplate,
  sendYatriNivasConfirmationEmail,
  getPeerlessConfirmationTemplate,
  sendPeerlessConfirmationEmail,
  getNoRoomsRegretTemplate,
  sendNoRoomsRegretEmail,
  getRevisitRegretTemplate,
  sendRevisitRegretEmail,
  getSpecialCelebrationRegretTemplate,
  sendSpecialCelebrationRegretEmail,
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

// Fetch dormitory confirmation template
export const fetchDormitoryConfirmationTemplate = async () => {
  try {
    const response = await getDormitoryConfirmationTemplate();
    return response.data;
  } catch (error) {
    console.error("Error fetching dormitory confirmation template:", error);
    throw error;
  }
};

// Send dormitory confirmation email
export const sendDormitoryConfirmation = async (data) => {
  try {
    const response = await sendDormitoryConfirmationEmail(data);
    return response.data;
  } catch (error) {
    console.error("Error sending dormitory confirmation email:", error);
    throw error;
  }
};

// Yatri Nivas Confirmation
export const fetchYatriNivasConfirmationTemplate = async () => {
  try {
    const response = await getYatriNivasConfirmationTemplate();
    return response.data;
  } catch (error) {
    console.error("Error fetching Yatri Nivas confirmation template:", error);
    throw error;
  }
};

export const sendYatriNivasConfirmation = async (data) => {
  try {
    const response = await sendYatriNivasConfirmationEmail(data);
    return response.data;
  } catch (error) {
    console.error("Error sending Yatri Nivas confirmation email:", error);
    throw error;
  }
};

// Peerless Confirmation
export const fetchPeerlessConfirmationTemplate = async () => {
  try {
    const response = await getPeerlessConfirmationTemplate();
    return response.data;
  } catch (error) {
    console.error("Error fetching Peerless confirmation template:", error);
    throw error;
  }
};

export const sendPeerlessConfirmation = async (data) => {
  try {
    const response = await sendPeerlessConfirmationEmail(data);
    return response.data;
  } catch (error) {
    console.error("Error sending Peerless confirmation email:", error);
    throw error;
  }
};

// No Rooms Regret
export const fetchNoRoomsRegretTemplate = async () => {
  try {
    const response = await getNoRoomsRegretTemplate();
    return response.data;
  } catch (error) {
    console.error("Error fetching no rooms regret template:", error);
    throw error;
  }
};

export const sendNoRoomsRegret = async (data) => {
  try {
    const response = await sendNoRoomsRegretEmail(data);
    return response.data;
  } catch (error) {
    console.error("Error sending no rooms regret email:", error);
    throw error;
  }
};

// Revisit Regret
export const fetchRevisitRegretTemplate = async () => {
  try {
    const response = await getRevisitRegretTemplate();
    return response.data;
  } catch (error) {
    console.error("Error fetching revisit regret template:", error);
    throw error;
  }
};

export const sendRevisitRegret = async (data) => {
  try {
    const response = await sendRevisitRegretEmail(data);
    return response.data;
  } catch (error) {
    console.error("Error sending revisit regret email:", error);
    throw error;
  }
};

// Special Celebration Regret
export const fetchSpecialCelebrationRegretTemplate = async () => {
  try {
    const response = await getSpecialCelebrationRegretTemplate();
    return response.data;
  } catch (error) {
    console.error("Error fetching special celebration regret template:", error);
    throw error;
  }
};

export const sendSpecialCelebrationRegret = async (data) => {
  try {
    const response = await sendSpecialCelebrationRegretEmail(data);
    return response.data;
  } catch (error) {
    console.error("Error sending special celebration regret email:", error);
    throw error;
  }
};
