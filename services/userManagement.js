import apiClient from './apiClient';

/**
 * Fetch all users from the system
 */
export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error fetching users:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data to create
 */
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {number} userId - ID of the user to update
 * @param {Object} userData - Updated user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {number} userId - ID of the user to delete
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error deleting user:', error);
    throw error;
  }
};

/**
 * Reset a user's password
 * @param {number} userId - ID of the user
 * @param {string} password - New password
 */
export const resetUserPassword = async (userId, password) => {
  try {
    const response = await apiClient.post(`/users/${userId}/reset-password`, { password });
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error resetting password:', error);
    throw error;
  }
};

/**
 * Fetch all roles from the system
 */
export const fetchRoles = async () => {
  try {
    const response = await apiClient.get('/users-permissions/roles');
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error fetching roles:', error);
    throw error;
  }
};

/**
 * Create a new role
 * @param {Object} roleData - Role data to create
 */
export const createRole = async (roleData) => {
  try {
    const response = await apiClient.post('/users-permissions/roles', roleData);
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error creating role:', error);
    throw error;
  }
};

/**
 * Update an existing role
 * @param {number} roleId - ID of the role to update
 * @param {Object} roleData - Updated role data
 */
export const updateRole = async (roleId, roleData) => {
  try {
    const response = await apiClient.put(`/users-permissions/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error updating role:', error);
    throw error;
  }
};

/**
 * Delete a role
 * @param {number} roleId - ID of the role to delete
 */
export const deleteRole = async (roleId) => {
  try {
    const response = await apiClient.delete(`/users-permissions/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error deleting role:', error);
    throw error;
  }
};

/**
 * Fetch all permissions
 */
export const fetchPermissions = async () => {
  try {
    const response = await apiClient.get('/users-permissions/permissions');
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error fetching permissions:', error);
    throw error;
  }
};

/**
 * Assign a role to a user
 * @param {number} userId - ID of the user
 * @param {number} roleId - ID of the role
 */
export const assignRoleToUser = async (userId, roleId) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, { role: roleId });
    return response.data;
  } catch (error) {
    console.error('[USER MGMT] Error assigning role to user:', error);
    throw error;
  }
};
