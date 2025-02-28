import {
  sendAllRemindersData,
  sendReminderEmailData,
  sendReminderSMSData,
} from "../api/repositories/reminderRepository";

// Fetch all reminders
export const sendAllReminders = async (data) => {
  try {
    const response = await sendAllRemindersData(data);
    return response.data;
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error;
  }
};

// Send reminder email
export const sendReminderEmail = async (data) => {
  try {
    const response = await sendReminderEmailData(data);
    return response.data;
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
};

// Send reminder SMS
export const sendReminderSMS = async (data) => {
  try {
    const response = await sendReminderSMSData(data);
    return response.data;
  } catch (error) {
    console.error("Error sending reminder SMS:", error);
    throw error;
  }
};
