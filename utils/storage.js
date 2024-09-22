// Save the token securely
export async function saveToken(token) {
  try {
    localStorage.setItem("userToken", token);
    console.log("Token saved successfully!");
  } catch (error) {
    console.error("Error saving token", error);
  }
}

// utils/storage.js
export const getToken = async () => {
  try {
    const token = localStorage.getItem("userToken");
    return token;
  } catch (error) {
    console.error("Error getting token from storage:", error);
    return null;
  }
};

// Delete the token securely and clear any session/local data
export async function deleteToken() {
  try {
    // Clear the token from AsyncStorage
    localStorage.removeItem("userToken");
    console.log("Token deleted successfully!");

    // Clear other session-related data if necessary
    clearLocalSession();
  } catch (error) {
    console.error("Error deleting token", error);
  }
}

// Function to clear any other local session data
function clearLocalSession() {
  // Reset any session-specific variables or states here
  localStorage.clear();
}
