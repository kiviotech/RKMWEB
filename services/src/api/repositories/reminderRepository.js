import apiClient from "../../../apiClient";
import reminderEndpoints from "../endpoints/reminderEndpoints";

// Send all reminders
export const sendAllRemindersData = (data) =>
  apiClient.post(reminderEndpoints.sendReminders, { data });

// Send reminder email
export const sendReminderEmailData = (data) =>
  apiClient.post(reminderEndpoints.sendReminderEmail, { data });

// Send reminder SMS
export const sendReminderSMSData = (data) =>
  apiClient.post(reminderEndpoints.sendReminderSMS, { data });
