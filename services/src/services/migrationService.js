import axios from "axios";
// import { API_BASE_URL } from "../../api/config";
export const API_BASE_URL = "http://localhost:1338/api";

// Helper function to get authentication token
const getAuthToken = () => {
  const token = localStorage.getItem("userToken");
  console.log("Token:", token);
  return token;
};

// Helper function to get auth headers
const getAuthHeaders = (contentType = "application/json") => {
  const token = getAuthToken();
  return {
    "Content-Type": contentType,
    Authorization: `Bearer ${token}`,
  };
};

// Upload Excel file for migration
export const uploadMigrationFile = async (file, onProgress) => {
  try {
    console.log("Starting file upload. File:", file.name, "Size:", file.size, "Type:", file.type);
    
    const formData = new FormData();
    formData.append("file", file);
    
    console.log("Form data created with file field");
    
    const response = await axios.post(`${API_BASE_URL}/migration/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      },
    });
    
    console.log("Upload response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading migration file:", error);
    // Log more details about the error
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

// Check migration progress
export const checkMigrationProgress = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/migration/progress/${jobId}`, {
      headers: getAuthHeaders(),
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error checking migration progress for job ${jobId}:`, error);
    throw error;
  }
};

// Get migration results
export const getMigrationResults = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/migration/results/${jobId}`, {
      headers: getAuthHeaders(),
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching migration results for job ${jobId}:`, error);
    throw error;
  }
};

// Download sample template
export const downloadSampleTemplate = () => {
  try {
    const token = getAuthToken();
    
    window.open(`${API_BASE_URL}/migration/template?token=${token}`, "_blank");
  } catch (error) {
    console.error("Error downloading sample template:", error);
    throw error;
  }
}; 