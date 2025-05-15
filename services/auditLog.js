import apiClient from "./apiClient";
import { useAuthStore } from "../store/authStore";

/**
 * Service for creating and managing audit logs for sensitive operations
 * Tracks user activities including logins, password changes, and other actions
 */

/**
 * Create an audit log entry for a user action
 * 
 * @param {Object} params - Audit log parameters
 * @param {string} params.action - Action performed (e.g., 'donation.update', 'receipt.edit')
 * @param {string} params.resourceId - ID of the resource being modified (e.g., donation ID)
 * @param {string} params.resourceType - Type of resource (e.g., 'donation', 'receipt')
 * @param {Object} params.oldValue - Original value before changes (optional)
 * @param {Object} params.newValue - New value after changes
 * @param {string} params.notes - Additional notes or reason for change (optional)
 * @returns {Promise<Object>} - Response with success/error
 */
export async function createAuditLog({ action, resourceId, resourceType, oldValue, newValue, notes }) {
  try {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    // Get client IP address through a dedicated endpoint
    let ipAddress = '0.0.0.0';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
    }
    
    const payload = {
      userId: user.id,
      username: user.username,
      userRole: user.role?.type || user.user_role,
      action,
      resourceId,
      resourceType,
      oldValue: oldValue ? JSON.stringify(oldValue) : null,
      newValue: JSON.stringify(newValue),
      notes,
      timestamp: new Date().toISOString()
    };
    
    console.log('[AUDIT] Creating audit log:', payload);
    
    // Format data for Strapi API - it expects a data wrapper
    const response = await apiClient.post('/audit-logs', { data: payload });
    
    console.log('[AUDIT] Audit log created successfully:', response.data);
    return { 
      success: true, 
      auditLogId: response.data.id,
      message: 'Audit log created successfully' 
    };
  } catch (error) {
    console.error('[AUDIT] Error creating audit log:', error);
    // Still return success to not block user operations
    // but log the failure for system monitoring
    return { 
      success: false, 
      error: error.message || 'Failed to create audit log'
    };
  }
}

/**
 * Get audit logs for a specific resource
 * Useful for showing history of changes to super admins
 * 
 * @param {string} resourceType - Type of resource (e.g., 'donation', 'receipt')
 * @param {string} resourceId - ID of the resource
 * @param {Object} options - Query options (pagination, sorting)
 * @returns {Promise<Object>} - Response with audit logs
 */
export async function getAuditLogs(options = {}) {
  try {
    // Prepare query parameters - only include pagination and sorting
    const queryParams = new URLSearchParams();
    
    // Set a high limit to retrieve all logs
    // Note: In a production environment with a large dataset, you might want to implement
    // pagination or lazy loading instead of fetching all records
    queryParams.append('pagination[limit]', '500');
    
    // Sort by most recent first
    queryParams.append('sort', 'timestamp:desc');
    
    console.log('[AUDIT] Fetching all audit logs');
    
    // Simple request to get all audit logs
    const response = await apiClient.get(`/donation-audit-logs?${queryParams.toString()}`);
    
    console.log('[AUDIT] Fetched audit logs successfully:', response.data.data?.length || 0, 'records');
    
    return {
      success: true,
      data: response.data.data || [],
      meta: response.data.meta,
      total: response.data.meta?.pagination?.total || 0
    };
  } catch (error) {
    console.error('[AUDIT] Error fetching audit logs:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch audit logs'
    };
  }
}

/**
 * Create a donation-specific audit log entry
 * 
 * @param {Object} params - Audit log parameters
 * @param {string} params.donationId - ID of the donation being modified
 * @param {Object} params.changes - The changes made to the donation (field-by-field)
 * @param {Object} params.metadata - Additional metadata about the donation (e.g., donor name)
 * @returns {Promise<Object>} - Response with success/error
 */
export async function createDonationAuditLog({ donationId, changes, metadata = {} }) {
  try {
    const user = useAuthStore.getState().user;
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    // Prepare the payload for the donation-audit-logs endpoint
    const payload = {
      userId: user.id,
      username: user.username,
      userRole: user.role?.type || user.user_role,
      donationId,
      changes: JSON.stringify(changes),
      metadata: JSON.stringify(metadata),
      timestamp: new Date().toISOString()
    };
    
    console.log('[AUDIT] Creating donation audit log:', payload);
    
    // Try-catch inside the function to ensure errors don't propagate
    try {
      // Post to the donation-specific audit log endpoint
      const response = await apiClient.post('/donation-audit-logs', { data: payload });
      console.log('[AUDIT] Donation audit log created successfully:', response.data);
      return { 
        success: true, 
        auditLogId: response.data?.id,
        message: 'Donation audit log created successfully' 
      };
    } catch (apiError) {
      console.error('[AUDIT] API Error creating donation audit log:', apiError);
      // Log to console but don't fail the entire operation
      return { 
        success: false, 
        error: apiError.message || 'API error when creating donation audit log'
      };
    }
    // No return statement needed here as we've moved it inside the try/catch blocks
  } catch (error) {
    console.error('[AUDIT] Error creating donation audit log:', error);
    // Still return success to not block user operations
    return { 
      success: false, 
      error: error.message || 'Failed to create donation audit log'
    };
  }
}

/**
 * Get audit logs for a specific donation
 * 
 * @param {string} donationId - ID of the donation
 * @param {Object} options - Query options (pagination, sorting)
 * @returns {Promise<Object>} - Response with audit logs
 */
export async function getDonationAuditLogs(donationId, options = {}) {
  try {
    const queryParams = {
      donationId,
      ...options
    };
    
    const response = await apiClient.get('/donation-audit-logs', { params: queryParams });
    
    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
      total: response.data.meta?.pagination?.total || 0
    };
  } catch (error) {
    console.error('[AUDIT] Error fetching donation audit logs:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch donation audit logs'
    };
  }
}

export default {
  createAuditLog,
  getAuditLogs,
  createDonationAuditLog,
  getDonationAuditLogs
};
