import axios from 'axios';
import { MEDIA_BASE_URL } from './apiClient';
import { getToken } from '../utils/storage';

/**
 * Service for interacting with the user activity log API
 */

// Helper function to build API URL
const getApiUrl = (endpoint) => {
  return `${MEDIA_BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Log a user activity
 *
 * @param {Object} activity - The activity to log
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logActivity = async (activity) => {
  try {
    const token = await getToken();
    if (!token) return null;

    const response = await axios.post(
      getApiUrl('/api/user-activity-logs'),
      {
        data: {
          ...activity,
          publishedAt: new Date(),
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to log activity:', error);
    return null;
  }
};

/**
 * Log a view event
 * 
 * @param {string} resourceType - The type of resource being viewed (e.g., 'donation', 'guest-detail')
 * @param {number} resourceId - The ID of the resource being viewed
 * @param {string} notes - Additional notes about the view
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logView = async (resourceType, resourceId, notes = '') => {
  return logActivity({
    action: `${resourceType}.view`,
    details: {
      resourceId,
      timestamp: new Date().toISOString(),
    },
    notes: notes || `Viewed ${resourceType} ${resourceId}`,
  });
};

/**
 * Log a create event
 * 
 * @param {string} resourceType - The type of resource being created (e.g., 'donation', 'guest-detail')
 * @param {number} resourceId - The ID of the created resource
 * @param {Object} resourceData - The data of the created resource
 * @param {string} notes - Additional notes about the creation
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logCreate = async (resourceType, resourceId, resourceData = {}, notes = '') => {
  return logActivity({
    action: `${resourceType}.create`,
    details: {
      resourceId,
      resourceData,
      timestamp: new Date().toISOString(),
    },
    notes: notes || `Created ${resourceType} ${resourceId}`,
  });
};

/**
 * Log an update event
 * 
 * @param {string} resourceType - The type of resource being updated (e.g., 'donation', 'guest-detail')
 * @param {number} resourceId - The ID of the updated resource
 * @param {Object} changes - The changes made to the resource
 * @param {string} notes - Additional notes about the update
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logUpdate = async (resourceType, resourceId, changes = {}, notes = '') => {
  return logActivity({
    action: `${resourceType}.update`,
    details: {
      resourceId,
      changes,
      timestamp: new Date().toISOString(),
    },
    notes: notes || `Updated ${resourceType} ${resourceId}`,
  });
};

/**
 * Log a delete event
 * 
 * @param {string} resourceType - The type of resource being deleted (e.g., 'donation', 'guest-detail')
 * @param {number} resourceId - The ID of the deleted resource
 * @param {Object} deletedData - The data of the deleted resource
 * @param {string} notes - Additional notes about the deletion
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logDelete = async (resourceType, resourceId, deletedData = {}, notes = '') => {
  return logActivity({
    action: `${resourceType}.delete`,
    details: {
      resourceId,
      deletedData,
      timestamp: new Date().toISOString(),
    },
    notes: notes || `Deleted ${resourceType} ${resourceId}`,
  });
};

/**
 * Log an export event
 * 
 * @param {string} resourceType - The type of resource being exported (e.g., 'donation', 'guest-detail')
 * @param {string} format - The format of the export (e.g., 'csv', 'excel')
 * @param {Object} filters - The filters used for the export
 * @param {number} recordCount - The number of records exported
 * @param {string} notes - Additional notes about the export
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logExport = async (resourceType, format = 'csv', filters = {}, recordCount = 0, notes = '') => {
  return logActivity({
    action: `${resourceType}.export`,
    details: {
      format,
      filters,
      recordCount,
      timestamp: new Date().toISOString(),
    },
    notes: notes || `Exported ${recordCount} ${resourceType} records as ${format}`,
  });
};

/**
 * Log a custom action
 * 
 * @param {string} action - The custom action to log
 * @param {Object} details - Additional details about the action
 * @param {string} notes - Notes about the action
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logCustomAction = async (action, details = {}, notes = '') => {
  return logActivity({
    action,
    details: {
      ...details,
      timestamp: new Date().toISOString(),
    },
    notes,
  });
};

/**
 * Get recent user activity logs
 * 
 * @param {number} limit - The number of logs to return
 * @returns {Promise} - A promise that resolves to the fetched activity logs
 */
export const getRecentActivity = async (limit = 10) => {
  try {
    const token = await getToken();
    if (!token) return [];

    const response = await axios.get(
      getApiUrl(`/api/user-activity-logs?sort=timestamp:desc&pagination[limit]=${limit}`),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
    return [];
  }
};

/**
 * Get user activity logs with pagination, sorting and filtering
 * 
 * @param {Object} options - Options for fetching logs
 * @param {number} options.page - The page number to fetch
 * @param {number} options.pageSize - Number of records per page
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort direction ('asc' or 'desc')
 * @param {Object} options.filters - Filters to apply
 * @returns {Promise} - A promise that resolves to the fetched activity logs with pagination data
 */
export const getUserActivityLogs = async ({ page = 1, pageSize = 20, sortBy = 'timestamp', sortOrder = 'desc', filters = {} }) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, error: 'Authentication required', data: [], total: 0 };

    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Pagination
    queryParams.append('pagination[page]', page);
    queryParams.append('pagination[pageSize]', pageSize);
    
    // Sorting
    queryParams.append('sort', `${sortBy}:${sortOrder}`);
    
    // Filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(`filters[${key}][$containsi]`, value);
      }
    });

    const apiUrl = getApiUrl(`/api/user-activity-logs?${queryParams.toString()}`);
    console.log(`Making API request to: ${apiUrl}`);

    const response = await axios.get(
      apiUrl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('API response:', response);

    // Handle both possible response formats
    if (response.data && response.data.success) {
      // New format with success flag
      return {
        success: true,
        data: response.data.data || [],
        total: response.data.total || response.data.meta?.pagination?.total || 0,
        meta: response.data.meta || {}
      };
    } else if (response.data) {
      // Standard Strapi format without success flag
      return {
        success: true,
        data: response.data.data || [],
        total: response.data.meta?.pagination?.total || 0,
        meta: response.data.meta || {}
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
    
    // Log detailed error information
    if (error.response) {
      // Server responded with an error
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error details:', error.message);
    }
    
    return { 
      success: false, 
      error: error.message || "Failed to fetch activity logs", 
      data: [], 
      total: 0 
    };
  }
};

/**
 * Get analytics data for user activity
 * 
 * @returns {Promise} - A promise that resolves to analytics data
 */
export const getUserActivityAnalytics = async () => {
  try {
    const token = await getToken();
    if (!token) return { success: false, error: 'Authentication required', data: null };

    const response = await axios.get(
      getApiUrl('/api/user-activity-logs/analytics'),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch activity analytics:', error);
    
    // Add more detailed debugging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return {
      success: false,
      error: error.message || 'Failed to fetch activity analytics',
      data: null
    };
  }
};

/**
 * Log a user login activity
 * 
 * @param {Object} loginData - Data about the login
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logUserLogin = async (loginData) => {
  return logActivity({
    action: 'user.login',
    details: loginData.details || {
      userId: loginData.userId,
      method: loginData.method || 'password',
      success: loginData.success !== false,
      timestamp: new Date().toISOString()
    },
    notes: loginData.success !== false 
      ? `User ${loginData.username || 'unknown'} logged in successfully` 
      : `Failed login attempt for ${loginData.username || 'unknown'}`
  });
};

/**
 * Log a password change attempt
 * 
 * @param {Object} passwordChangeData - Data about the password change
 * @returns {Promise} - A promise that resolves to the created activity log
 */
export const logPasswordChange = async (passwordChangeData) => {
  return logActivity({
    action: 'user.password_change',
    details: {
      userId: passwordChangeData.userId,
      targetUserId: passwordChangeData.targetUserId,
      success: passwordChangeData.success !== false,
      timestamp: new Date().toISOString()
    },
    notes: passwordChangeData.success !== false 
      ? `Password changed for ${passwordChangeData.targetUsername || 'unknown'} by ${passwordChangeData.username || 'system'}` 
      : `Failed password change attempt for ${passwordChangeData.targetUsername || 'unknown'} by ${passwordChangeData.username || 'system'}`
  });
};

export default {
  logActivity,
  logView,
  logCreate,
  logUpdate,
  logDelete,
  logExport,
  logCustomAction,
  getRecentActivity,
  getUserActivityLogs,
  getUserActivityAnalytics,
  logUserLogin,
  logPasswordChange,
};
