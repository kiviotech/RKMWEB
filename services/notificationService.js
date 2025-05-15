import apiClient from "./apiClient";
import { useAuthStore } from "../store/authStore";

/**
 * Service for sending notifications to users, particularly super admins
 * when account-admins make changes to donation records or receipts
 */

/**
 * Send a notification to specific user roles
 * 
 * @param {Object} params - Notification parameters
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} params.type - Notification type (e.g., 'info', 'warning', 'alert')
 * @param {Array<string>} params.targetRoles - Roles to notify (e.g., ['super-admin'])
 * @param {string} params.resourceType - Type of resource (e.g., 'donation', 'receipt')
 * @param {string} params.resourceId - ID of the resource
 * @param {string} params.action - Action performed
 * @returns {Promise<Object>} - Response with success/error
 */
export async function sendNotification({ 
  title, 
  message, 
  type = 'info', 
  targetRoles = ['super-admin'], 
  resourceType, 
  resourceId, 
  action 
}) {
  try {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    const payload = {
      title,
      message,
      type,
      targetRoles,
      resourceType,
      resourceId,
      action,
      sourceUserId: user.id,
      sourceUserName: user.username,
      sourceUserRole: user.role?.type || user.user_role,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    console.log('[NOTIFICATION] Sending notification:', payload);
    
    try {
      // Use proper Strapi API format with api:: prefix
      const response = await apiClient.post('/notifications', { data: payload });
      console.log('[NOTIFICATION] Notification sent successfully:', response.data);
      return { 
        success: true, 
        notificationId: response.data?.data?.id,
        message: 'Notification sent successfully' 
      };
    } catch (apiError) {
      console.error('[NOTIFICATION] API Error sending notification:', apiError);
      // Log to console but don't fail the entire operation
      return { 
        success: false, 
        error: apiError.message || 'API error when sending notification'
      };
    }
    // No return statement needed here as we've moved it inside the try/catch blocks
  } catch (error) {
    console.error('[NOTIFICATION] Error sending notification:', error);
    // Still return success to not block user operations
    return { 
      success: false, 
      error: error.message || 'Failed to send notification'
    };
  }
}

/**
 * Get notifications for the current user
 * 
 * @param {Object} options - Query options (pagination, sorting)
 * @param {boolean} options.unreadOnly - Whether to return only unread notifications
 * @returns {Promise<Object>} - Response with notifications
 */
export async function getNotifications(options = {}) {
  try {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    // Prepare simple query parameters
    const queryParams = new URLSearchParams();
    
    // Set a high limit to retrieve all notifications
    queryParams.append('pagination[limit]', '100');
    
    // Sort by most recent first
    queryParams.append('sort', 'createdAt:desc');
    
    console.log('[NOTIFICATION] Fetching all notifications');
    
    // Simple request to get all notifications
    const response = await apiClient.get(`/notifications?${queryParams.toString()}`);
    
    const allNotifications = response.data.data || [];
    
    // Client-side filtering based on user role
    const userRole = user.role?.type || user.user_role;
    
    // Filter notifications that target the user's role
    const filteredNotifications = allNotifications.filter(notification => {
      const targetRoles = notification.attributes?.targetRoles || [];
      return targetRoles.includes(userRole);
    });
    
    // Further filter by read status if requested
    const resultNotifications = options.unreadOnly 
      ? filteredNotifications.filter(notification => !(notification.attributes?.isRead))
      : filteredNotifications;
    
    console.log(`[NOTIFICATION] Fetched ${allNotifications.length} notifications, filtered to ${resultNotifications.length}`);
    
    return {
      success: true,
      notifications: resultNotifications,
      meta: response.data.meta,
      count: resultNotifications.length
    };
  } catch (error) {
    console.error('[NOTIFICATION] Error fetching notifications:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch notifications'
    };
  }
}

/**
 * Mark notification as read
 * 
 * @param {string} notificationId - ID of the notification
 * @returns {Promise<Object>} - Response with success/error
 */
export async function markNotificationAsRead(notificationId) {
  try {
    await apiClient.put(`/notifications/${notificationId}`, { data: { isRead: true } });
    
    return {
      success: true,
      message: 'Notification marked as read'
    };
  } catch (error) {
    console.error('[NOTIFICATION] Error marking notification as read:', error);
    return {
      success: false,
      error: error.message || 'Failed to mark notification as read'
    };
  }
}

export default {
  sendNotification,
  getNotifications,
  markNotificationAsRead
};
