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
export const fetchEligibleUsers = async (criteria = {}, page = 1, pageSize = 10) => {
  try {
    // Ensure page is a number
    const requestedPage = parseInt(page, 10) || 1;
    console.log(`fetchEligibleUsers called with page ${requestedPage}`);
    
    // Make sure every criteria has a default value to show all users if not selected
    const params = {
      hasDeeksha: criteria.hasDeeksha === null ? undefined : criteria.hasDeeksha,
      minDonationAmount: criteria.minDonationAmount || 0,
      hasCapitalInvestment: criteria.hasCapitalInvestment || false,
      startDate: criteria.startDate || '',
      endDate: criteria.endDate || '',
      page: requestedPage,
      pageSize: parseInt(pageSize, 10) || 10
    };

    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    console.log('Fetching eligible users with params:', params);
    const response = await apiClient.get('/invitation/eligible-users', { params });
    console.log('Raw API response:', response.data);

    // Ensure we have the expected data structure
    let result;
    if (response.data?.data && response.data?.pagination) {
      // The backend is returning the expected structure
      result = {
        data: response.data.data,
        pagination: response.data.pagination
      };
    } else if (Array.isArray(response.data)) {
      // The backend is returning just an array (old format)
      result = {
        data: response.data,
        pagination: {
          page: parseInt(page, 10),
          pageSize: parseInt(pageSize, 10),
          pageCount: Math.ceil(response.data.length / pageSize) || 1,
          total: response.data.length
        }
      };
    } else {
      // Unexpected response format
      console.error('[INVITATION] Unexpected response format:', response.data);
      result = {
        data: [],
        pagination: {
          page: 1,
          pageSize,
          pageCount: 1, 
          total: 0
        }
      };
    }

    console.log('Processed response:', result);
    return result;
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
