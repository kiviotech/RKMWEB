import apiClient from './apiClient';

/**
 * Fetch users eligible for invitation based on criteria
 * @param {Object} criteria - Filtering criteria
 * @param {boolean} criteria.hasDeeksha - Filter users who have taken deeksha
 * @param {number} criteria.minDonationAmount - Minimum donation amount
 * @param {boolean} criteria.hasCapitalInvestment - Filter users with capital investments
 * @param {string} criteria.startDate - Start date for filtering (YYYY-MM-DD)
 * @param {string} criteria.endDate - End date for filtering (YYYY-MM-DD)
 * @returns {Promise<Array>} - List of eligible users
 */
export const fetchEligibleUsers = async (criteria = {}) => {
  try {
    // Make sure every criteria has a default value to show all users if not selected
    const params = {
      hasDeeksha: criteria.hasDeeksha || false,
      minDonationAmount: criteria.minDonationAmount || 0,
      hasCapitalInvestment: criteria.hasCapitalInvestment || false,
      startDate: criteria.startDate || '',
      endDate: criteria.endDate || ''
    };

    const response = await apiClient.get('/invitation/eligible-users', { params });
    return response.data;
  } catch (error) {
    console.error('[INVITATION] Error fetching eligible users:', error);
    throw error;
  }
};

/**
 * Export users data for invitation
 * @param {Array} userIds - IDs of users to export
 * @param {string} format - Export format (xlsx, csv)
 * @param {boolean} groupByAddress - Whether to group users by address
 */
export const exportUsersForInvitation = async (userIds, format = 'xlsx', groupByAddress = false) => {
  try {
    const response = await apiClient.post('/invitation/export-users', { 
      userIds,
      format,
      groupByAddress 
    }, {
      responseType: 'blob' // Important for file download
    });
    
    return response.data;
  } catch (error) {
    console.error('[INVITATION] Error exporting users for invitation:', error);
    throw error;
  }
};

/**
 * Send invitations to users
 * @param {Array} userIds - IDs of users to invite
 * @param {string} channel - Channel to send invitation (email, whatsapp, sms)
 * @param {Object} templateData - Template data for the invitation
 */
export const sendInvitations = async (userIds, channel, templateData) => {
  try {
    const response = await apiClient.post('/invitation/send', {
      userIds,
      channel,
      templateData
    });
    
    return response.data;
  } catch (error) {
    console.error('[INVITATION] Error sending invitations:', error);
    throw error;
  }
};

/**
 * Get users grouped by address
 * @param {Array} userIds - IDs of users to group
 */
export const getUsersGroupedByAddress = async (userIds) => {
  try {
    const response = await apiClient.post('/invitation/group-by-address', {
      userIds
    });
    
    return response.data;
  } catch (error) {
    console.error('[INVITATION] Error grouping users by address:', error);
    throw error;
  }
};
