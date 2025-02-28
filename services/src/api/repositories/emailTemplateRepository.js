import apiClient from "../../../apiClient";
import emailTemplateEndpoints from "../endpoints/emailTemplateEndpoints";

// Get booking confirmation template
export const getBookingConfirmationTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getBookingConfirmation);

// Send booking confirmation email
export const sendBookingConfirmationEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendBookingConfirmation, { data });

// Get dormitory confirmation template
export const getDormitoryConfirmationTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getDormitoryConfirmation);

// Send dormitory confirmation email
export const sendDormitoryConfirmationEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendDormitoryConfirmation, { data });

// Yatri Nivas
export const getYatriNivasConfirmationTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getYatriNivasConfirmation);

export const sendYatriNivasConfirmationEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendYatriNivasConfirmation, { data });

// Peerless
export const getPeerlessConfirmationTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getPeerlessConfirmation);

export const sendPeerlessConfirmationEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendPeerlessConfirmation, { data });

// No Rooms Regret
export const getNoRoomsRegretTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getNoRoomsRegret);

export const sendNoRoomsRegretEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendNoRoomsRegret, { data });

// Revisit Regret
export const getRevisitRegretTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getRevisitRegret);

export const sendRevisitRegretEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendRevisitRegret, { data });

// Special Celebration Regret
export const getSpecialCelebrationRegretTemplate = () =>
  apiClient.get(emailTemplateEndpoints.getSpecialCelebrationRegret);

export const sendSpecialCelebrationRegretEmail = (data) =>
  apiClient.post(emailTemplateEndpoints.sendSpecialCelebrationRegret, { data });
