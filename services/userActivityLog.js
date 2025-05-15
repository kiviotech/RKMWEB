import apiClient from "./apiClient";
import { useAuthStore } from "../store/authStore";

/**
 * Service for tracking user activities like logins, password changes,
 * and system usage for security and audit purposes
 */

/**
 * Log a user login event
 * 
 * @param {Object} params - Login parameters
 * @param {string} params.userId - User ID of the user logging in
 * @param {string} params.username - Username of the user logging in
 * @param {string} params.userRole - Role of the user logging in
 * @param {string} params.method - Login method (e.g., 'password', 'otp')
 * @param {boolean} params.success - Whether the login was successful
 * @returns {Promise<Object>} - Response with success/error
 */
export async function logUserLogin({ userId, username, userRole, method = 'password', success = true, details = {} }) {
  try {
    // Get client IP address 
    let ipAddress = '0.0.0.0';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
    }
    
    // Get browser and device information
    const userAgent = navigator.userAgent;
    
    // Prepare and send the log
    const payload = {
      action: 'user.login',
      userId,
      username,
      userRole,
      ipAddress,
      userAgent,
      details: {
        method,
        success,
        timestamp: new Date().toISOString(),
        platform: details.platform || navigator.platform,
        screenSize: details.screenSize || `${window.screen.width}x${window.screen.height}`,
        language: details.language || navigator.language,
        browserInfo: details.userAgent || userAgent,
        ...details  // Include any other details passed in
      },
      notes: success ? 'Successful login' : 'Failed login attempt'
    };
    
    console.log('[USER ACTIVITY] Logging user login:', payload);
    
    // Use the dedicated user-activity-logs endpoint
    // Note: This endpoint needs to be created on the backend
    try {
      const response = await apiClient.post('/user-activity-logs', { data: payload });
      return { success: true, logId: response.data?.id };
    } catch (error) {
      console.error('[USER ACTIVITY] Error creating log:', error);
      // Silent failure - don't interrupt the login flow
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('[USER ACTIVITY] Error logging user login:', error);
    // Silent failure - don't interrupt the login flow
    return { success: false, error: error.message };
  }
}

/**
 * Log a password change event
 * 
 * @param {Object} params - Password change parameters
 * @param {string} params.userId - User ID of the user changing password
 * @param {string} params.username - Username of the user changing password
 * @param {string} params.targetUserId - User ID of account whose password is being changed
 * @param {string} params.targetUsername - Username of account whose password is being changed
 * @param {boolean} params.success - Whether the password change was successful
 * @returns {Promise<Object>} - Response with success/error
 */
export async function logPasswordChange({ 
  userId, 
  username, 
  targetUserId, 
  targetUsername, 
  success = true 
}) {
  try {
    // Get client IP address
    let ipAddress = '0.0.0.0';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
    }
    
    // Fall back to current user if not provided
    const user = useAuthStore.getState().user;
    const actualUserId = userId || user?.id;
    const actualUsername = username || user?.username;
    
    // Prepare and send the log
    const payload = {
      action: 'user.password_change',
      userId: actualUserId,
      username: actualUsername,
      userRole: user?.role?.type || user?.user_role,
      targetUserId,
      targetUsername,
      ipAddress,
      userAgent: navigator.userAgent,
      details: {
        selfChange: actualUserId === targetUserId,
        success,
        timestamp: new Date().toISOString(),
      },
      notes: actualUserId === targetUserId 
        ? 'Self password change' 
        : `Admin password change for user: ${targetUsername}`
    };
    
    console.log('[USER ACTIVITY] Logging password change:', payload);
    
    // Use the dedicated user-activity-logs endpoint
    // Note: This endpoint needs to be created on the backend
    try {
      const response = await apiClient.post('/user-activity-logs', { data: payload });
      return { success: true, logId: response.data?.id };
    } catch (error) {
      console.error('[USER ACTIVITY] Error creating log:', error);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('[USER ACTIVITY] Error logging password change:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Log a user action in the system
 * 
 * @param {Object} params - Action parameters
 * @param {string} params.action - Action type (e.g., 'view_donation', 'export_data')
 * @param {string} params.resource - Resource being acted upon (e.g., 'donation', 'user')
 * @param {string} params.resourceId - ID of the resource (if applicable)
 * @param {Object} params.details - Additional details about the action
 * @returns {Promise<Object>} - Response with success/error
 */
export async function logUserAction({ action, resource, resourceId, details = {} }) {
  try {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.id) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Get client IP address
    let ipAddress = '0.0.0.0';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
    }
    
    // Prepare and send the log
    const payload = {
      action,
      userId: user.id,
      username: user.username,
      userRole: user.role?.type || user.user_role,
      resource,
      resourceId,
      ipAddress,
      userAgent: navigator.userAgent,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      }
    };
    
    console.log('[USER ACTIVITY] Logging user action:', payload);
    
    // Use the dedicated user-activity-logs endpoint
    // Note: This endpoint needs to be created on the backend
    try {
      const response = await apiClient.post('/user-activity-logs', { data: payload });
      return { success: true, logId: response.data?.id };
    } catch (error) {
      console.error('[USER ACTIVITY] Error creating log:', error);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('[USER ACTIVITY] Error logging user action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user activity logs for the admin dashboard
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (starts at 1)
 * @param {number} params.pageSize - Number of items per page
 * @param {string} params.sortBy - Field to sort by (default: timestamp)
 * @param {string} params.sortOrder - Sort order (asc or desc)
 * @param {Object} params.filters - Filters to apply (userId, action, etc.)
 * @returns {Promise<Object>} - Response with logs and pagination info
 */
/**
 * Get analytics data from user activity logs
 * 
 * @returns {Promise<Object>} - Analytics data for dashboard
 */
export async function getUserActivityAnalytics() {
  try {
    // Make API request to get analytics data
    // This endpoint would aggregate data on the server side
    // If your backend doesn't support this, we can fetch all logs and calculate here
    const response = await apiClient.get('/user-activity-logs/analytics');
    
    // If the analytics endpoint doesn't exist, fallback to calculating based on all logs
    if (!response.data || response.status === 404) {
      console.log('[USER ACTIVITY] Analytics endpoint not found, calculating client-side');
      return await calculateClientSideAnalytics();
    }
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('[USER ACTIVITY] Error fetching analytics:', error);
    return await calculateClientSideAnalytics();
  }
}

/**
 * Calculate analytics on the client side by fetching logs
 * 
 * @returns {Promise<Object>} - Calculated analytics data
 */
async function calculateClientSideAnalytics() {
  try {
    // Get the last 7 days of logs with a larger page size
    const response = await getUserActivityLogs({
      page: 1,
      pageSize: 1000, // Get more logs for better analytics
      sortBy: 'timestamp',
      sortOrder: 'desc',
      filters: {
        // Only get logs from the last 7 days if possible
      }
    });
    
    if (!response.success) {
      throw new Error('Failed to fetch logs for analytics');
    }
    
    const logs = response.data;
    
    // Calculate analytics data
    const analytics = {
      // Total counts
      totalLogins: logs.filter(log => log.attributes.action === 'user.login' || log.attributes.action === 'auth.login').length,
      totalFailedLogins: logs.filter(log => 
        (log.attributes.action === 'user.login' || log.attributes.action === 'auth.login') && 
        log.attributes.details?.success === false
      ).length,
      totalPasswordChanges: logs.filter(log => log.attributes.action === 'user.password_change').length,
      
      // Group by device type
      deviceTypes: calculateDeviceTypes(logs),
      
      // Daily activity chart data
      dailyActivity: calculateDailyActivity(logs),
      
      // Top users by activity
      topUsers: calculateTopUsers(logs),
      
      // Suspicious activities
      suspiciousActivities: detectSuspiciousActivities(logs)
    };
    
    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    console.error('[USER ACTIVITY] Error calculating analytics:', error);
    return {
      success: false,
      error: error.message,
      data: {
        totalLogins: 0,
        totalFailedLogins: 0,
        totalPasswordChanges: 0,
        deviceTypes: [],
        dailyActivity: [],
        topUsers: [],
        suspiciousActivities: []
      }
    };
  }
}

/**
 * Calculate distribution of device types from logs
 * 
 * @param {Array} logs - User activity logs
 * @returns {Array} - Device type distribution
 */
function calculateDeviceTypes(logs) {
  const deviceCounts = {};
  
  logs.forEach(log => {
    let deviceType = 'Unknown';
    const userAgent = log.attributes.userAgent || '';
    
    if (userAgent.includes('Android')) {
      deviceType = 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      deviceType = 'iOS';
    } else if (userAgent.includes('Windows')) {
      deviceType = 'Windows';
    } else if (userAgent.includes('Mac')) {
      deviceType = 'Mac';
    } else if (userAgent.includes('Linux')) {
      deviceType = 'Linux';
    }
    
    deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
  });
  
  return Object.entries(deviceCounts).map(([name, count]) => ({ name, count }));
}

/**
 * Calculate daily activity counts for charting
 * 
 * @param {Array} logs - User activity logs
 * @returns {Array} - Daily activity data
 */
function calculateDailyActivity(logs) {
  // Create an object to store counts by date
  const dailyCounts = {};
  
  // Get the last 7 days
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dates.push(dateStr);
    dailyCounts[dateStr] = { date: dateStr, logins: 0, failedLogins: 0, otherActions: 0 };
  }
  
  // Count activities by date
  logs.forEach(log => {
    const timestamp = log.attributes.timestamp || 
                     (log.attributes.details?.timestamp) || 
                     new Date().toISOString();
    const date = timestamp.split('T')[0];
    
    // Only include logs from the last 7 days
    if (dailyCounts[date]) {
      const action = log.attributes.action;
      const success = log.attributes.details?.success !== false; // Default to true if not specified
      
      if (action === 'user.login' || action === 'auth.login') {
        if (success) {
          dailyCounts[date].logins++;
        } else {
          dailyCounts[date].failedLogins++;
        }
      } else {
        dailyCounts[date].otherActions++;
      }
    }
  });
  
  // Convert to array for charting
  return dates.map(date => dailyCounts[date]);
}

/**
 * Calculate the most active users
 * 
 * @param {Array} logs - User activity logs
 * @returns {Array} - Top users by activity
 */
function calculateTopUsers(logs) {
  const userCounts = {};
  
  logs.forEach(log => {
    const username = log.attributes.username || 'Unknown';
    userCounts[username] = (userCounts[username] || 0) + 1;
  });
  
  return Object.entries(userCounts)
    .map(([username, count]) => ({ username, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 users
}

/**
 * Detect suspicious activities in logs
 * 
 * @param {Array} logs - User activity logs
 * @returns {Array} - Suspicious activities detected
 */
function detectSuspiciousActivities(logs) {
  const suspiciousActivities = [];
  const userLastLogin = {};
  const userFailedAttempts = {};
  const ipAddresses = {};
  
  logs.forEach(log => {
    const username = log.attributes.username || 'Unknown';
    const timestamp = new Date(log.attributes.timestamp || log.attributes.details?.timestamp || new Date());
    const action = log.attributes.action;
    const success = log.attributes.details?.success !== false; // Default to true if not specified
    const ipAddress = log.attributes.ipAddress || '0.0.0.0';
    
    // Track IP addresses
    if (!ipAddresses[ipAddress]) {
      ipAddresses[ipAddress] = [];
    }
    ipAddresses[ipAddress].push(username);
    
    // Check for multiple failed login attempts
    if ((action === 'user.login' || action === 'auth.login') && !success) {
      userFailedAttempts[username] = (userFailedAttempts[username] || 0) + 1;
      
      if (userFailedAttempts[username] >= 3) {
        suspiciousActivities.push({
          type: 'multiple_failed_logins',
          username,
          count: userFailedAttempts[username],
          lastAttempt: timestamp,
          severity: 'high',
          message: `Multiple failed login attempts (${userFailedAttempts[username]}) for user ${username}`
        });
      }
    }
    
    // Check for logins from new locations
    if ((action === 'user.login' || action === 'auth.login') && success) {
      if (userLastLogin[username] && userLastLogin[username].ipAddress !== ipAddress) {
        const lastLoginTime = new Date(userLastLogin[username].timestamp);
        const hoursSinceLastLogin = (timestamp - lastLoginTime) / (1000 * 60 * 60);
        
        // If the login is from a different IP and within 24 hours of the last login
        if (hoursSinceLastLogin < 24) {
          suspiciousActivities.push({
            type: 'location_change',
            username,
            oldIp: userLastLogin[username].ipAddress,
            newIp: ipAddress,
            timestamp,
            hoursSinceLastLogin,
            severity: 'medium',
            message: `Login from new location for ${username} within ${hoursSinceLastLogin.toFixed(1)} hours`
          });
        }
      }
      
      userLastLogin[username] = { timestamp, ipAddress };
    }
    
    // Check for shared IP addresses (multiple users from same IP)
    if (ipAddresses[ipAddress] && ipAddresses[ipAddress].length > 3 && 
        ipAddresses[ipAddress].filter(u => u !== username).length >= 3) {
      const uniqueUsers = new Set(ipAddresses[ipAddress]);
      if (uniqueUsers.size >= 3) {
        suspiciousActivities.push({
          type: 'shared_ip',
          ipAddress,
          users: [...uniqueUsers],
          timestamp,
          severity: 'low',
          message: `Multiple users (${uniqueUsers.size}) logging in from same IP address ${ipAddress}`
        });
        
        // Prevent duplicate alerts for the same IP
        ipAddresses[ipAddress] = [];
      }
    }
  });
  
  // Remove duplicate alerts (same type for the same user)
  const uniqueAlerts = {};
  suspiciousActivities.forEach(activity => {
    const key = `${activity.type}_${activity.username || activity.ipAddress}`;
    if (!uniqueAlerts[key] || new Date(activity.timestamp) > new Date(uniqueAlerts[key].timestamp)) {
      uniqueAlerts[key] = activity;
    }
  });
  
  return Object.values(uniqueAlerts);
}

/**
 * Get user activity logs with pagination, sorting, and filtering
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (starts at 1)
 * @param {number} params.pageSize - Number of items per page
 * @param {string} params.sortBy - Field to sort by (default: timestamp)
 * @param {string} params.sortOrder - Sort order (asc or desc)
 * @param {Object} params.filters - Filters to apply (userId, action, etc.)
 * @returns {Promise<Object>} - Response with logs and pagination info
 */
export async function getUserActivityLogs({ 
  page = 1, 
  pageSize = 20, 
  sortBy = 'timestamp', 
  sortOrder = 'desc', 
  filters = {} 
}) {
  try {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    // Prepare query params
    const queryParams = new URLSearchParams();
    
    // Pagination
    queryParams.append('pagination[page]', page);
    queryParams.append('pagination[pageSize]', pageSize);
    
    // Sorting
    queryParams.append('sort', `${sortBy}:${sortOrder}`);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(`filters[${key}][$eq]`, value);
      }
    });
    
    // Make API request to the dedicated user-activity-logs endpoint
    console.log('[USER ACTIVITY] Fetching logs with params:', queryParams.toString());
    const response = await apiClient.get(`/user-activity-logs?${queryParams.toString()}`);
    
    // Get all logs from response
    const allLogs = response.data.data || [];
    console.log('[USER ACTIVITY] Fetched logs count:', allLogs.length);
    
    return {
      success: true,
      data: allLogs,
      meta: response.data.meta,
      total: response.data.meta?.pagination?.total || allLogs.length
    };
  } catch (error) {
    console.error('[USER ACTIVITY] Error fetching user activity logs:', error);
    throw error;
  }
}
