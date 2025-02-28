import axios from "axios";
import { getToken } from "../utils/storage";

export const BASE_URL = "https://api.kamarpukurmath.org/api";
export const MEDIA_BASE_URL = "https://api.kamarpukurmath.org";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken("token"); // Ensure the function call is correct
      // console.log("Fetched token:", token); // Debugging log

      if (token) {
        // config.headers.Authorization = `Bearer d1d729c06as3dc86f95caa80efc120f3ad79d69e771d8d78fff34497e4ed4b542f86cd048a4dfbf6d8ee519bb53ce3edb47c14e1c3f3837dd36c26c599b88ba7cc5442815db334d378760373e8f88ad07932b07154d5d86946dc95ca7b7c67fdcfab3ce4c6a3e9e021722857fcc487984edb099f2694f462178bdc1184fd9354d`;
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token set in headers"); // Debugging log
      } else {
        console.warn("No token available"); // Warn if no token is found
      }
    } catch (error) {
      console.error("Error fetching token:", error); // Log any error in fetching the token
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
