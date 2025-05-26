import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { ROLES } from '../../../constants/permissions';
import './UserManagement.scss';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import RoleList from './components/RoleList';
import RoleForm from './components/RoleForm';
import InvitationManagement from './components/InvitationManagement';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import Button from './components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import './components/InvitationManagement.scss';
import { 
  fetchUsers, 
  fetchRoles, 
  fetchPermissions, 
  createUser, 
  updateUser,
  deleteUser,
  createRole,
  updateRole,
  deleteRole,
  resetUserPassword,
  assignRoleToUser
} from '../../../../services/userManagement';

// Define the UserManagement component as a function
const UserManagement = () => {
  // Component state
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Get user data from store just once
  const user = useAuthStore(state => state.user);
  
  // Check authorization once on mount
  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // Access hasRole directly from the store to avoid subscription
        const hasRoleFunc = useAuthStore.getState().hasRole;
        const authorized = hasRoleFunc(ROLES.SUPER_ADMIN);
        console.log('[USER MGMT DEBUG] Authorization check:', authorized);
        console.log('[USER MGMT DEBUG] User:', user?.username);
        console.log('[USER MGMT DEBUG] Role info:', {
          role_object: user?.role,
          legacy_user_role: user?.user_role
        });
        setIsAuthorized(authorized);
      } catch (err) {
        console.error('[USER MGMT DEBUG] Error during auth check:', err);
        setIsAuthorized(false);
      } finally {
        setAuthCheckComplete(true);
      }
    };

    checkAuthorization();
  }, []);

  // Data loading effect
  useEffect(() => {
    // Skip loading if not authorized
    if (!isAuthorized || !authCheckComplete) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (activeTab === 'users' || activeTab === 'all') {
          console.log('[USER MGMT DEBUG] Fetching users data');
          const usersData = await fetchUsers();
          setUsers(usersData);
        }
        
        // Always load roles when in users tab or when a user is selected for editing
        if (activeTab === 'roles' || activeTab === 'users' || activeTab === 'all' || selectedUser) {
          console.log('[USER MGMT DEBUG] Fetching roles data');
          const rolesData = await fetchRoles();
          setRoles(rolesData.roles || []);
        }
        
        if (activeTab === 'roles' || activeTab === 'all') {
          console.log('[USER MGMT DEBUG] Fetching permissions data');
          const permissionsData = await fetchPermissions();
          setPermissions(permissionsData);
        }
      } catch (err) {
        console.error('[USER MGMT DEBUG] Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab, isAuthorized, authCheckComplete, selectedUser]);

  // Use useCallback to prevent recreating function references on each render
  const handleUserCreate = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Creating new user:', userData.username);
      const newUser = await createUser(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      setSelectedUser(null);
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error creating user:', err);
      return { success: false, error: err.message || 'Failed to create user' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserUpdate = useCallback(async (userId, userData) => {
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Updating user:', userId);
      const updatedUser = await updateUser(userId, userData);
      setUsers(prevUsers => prevUsers.map(user => user.id === userId ? updatedUser : user));
      setSelectedUser(null);
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error updating user:', err);
      return { success: false, error: err.message || 'Failed to update user' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserDelete = useCallback(async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Deleting user:', userId);
      await deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setSelectedUser(null);
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error deleting user:', err);
      return { success: false, error: err.message || 'Failed to delete user' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePasswordReset = useCallback(async (userId, password) => {
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Resetting password for user:', userId);
      await resetUserPassword(userId, password);
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error resetting password:', err);
      return { success: false, error: err.message || 'Failed to reset password' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRoleCreate = useCallback(async (roleData) => {
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Creating new role:', roleData.name);
      const newRole = await createRole(roleData);
      setRoles(prevRoles => [...prevRoles, newRole.role]);
      setSelectedRole(null);
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error creating role:', err);
      return { success: false, error: err.message || 'Failed to create role' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRoleUpdate = useCallback(async (roleId, roleData) => {
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Updating role:', roleId);
      const updatedRole = await updateRole(roleId, roleData);
      setRoles(prevRoles => prevRoles.map(role => role.id === roleId ? updatedRole.role : role));
      setSelectedRole(null);
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error updating role:', err);
      return { success: false, error: err.message || 'Failed to update role' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRoleDelete = useCallback(async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role? This may affect users assigned to this role.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Deleting role:', roleId);
      await deleteRole(roleId);
      setRoles(prevRoles => prevRoles.filter(role => role.id !== roleId));
      setSelectedRole(null);
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error deleting role:', err);
      return { success: false, error: err.message || 'Failed to delete role' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRoleAssignment = useCallback(async (userId, roleId) => {
    try {
      setIsLoading(true);
      console.log('[USER MGMT DEBUG] Assigning role', roleId, 'to user', userId);
      await assignRoleToUser(userId, roleId);
      
      // Update the user in the list
      setUsers(prevUsers => {
        return prevUsers.map(u => {
          if (u.id === userId) {
            const assignedRole = roles.find(r => r.id === roleId);
            return { ...u, role: assignedRole };
          }
          return u;
        });
      });
      
      return { success: true };
    } catch (err) {
      console.error('[USER MGMT DEBUG] Error assigning role:', err);
      return { success: false, error: err.message || 'Failed to assign role' };
    } finally {
      setIsLoading(false);
    }
  }, [roles]);

  // UI components are already imported at the top of the file

  return (
    <div className="user-management">
      {!authCheckComplete ? (
        // Show loading while checking authorization
        <div className="auth-loading">
          <h2>Checking permissions...</h2>
          <div className="spinner"></div>
        </div>
      ) : !isAuthorized ? (
        // Unauthorized access message
        <div className="unauthorized">
          <h1>Unauthorized Access</h1>
          <p>You don't have permission to access this page.</p>
          <p className="details">This feature requires Super Admin privileges.</p>
        </div>
      ) : (
        // Authorized content
        <>
          <div className="page-header">
            <h1>User Management</h1>
            <div className="header-description">
              Manage users, roles, and permissions for the application
            </div>
          </div>
          
          {error && (
            <Card className="error-card">
              <CardContent>
                <div className="error-message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="users" className="tabs-container" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
            
            <div className="tabs-content-wrapper">
              {isLoading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <div className="loading-text">Loading...</div>
                </div>
              )}
              
              <TabsContent value="users">
                <Card>
                  <CardHeader className="card-header-with-action">
                    <div>
                      <CardTitle>Users</CardTitle>
                      <p className="card-description">Manage user accounts and their roles</p>
                    </div>
                    {!selectedUser && (
                      <Button 
                        onClick={() => setSelectedUser({ isNew: true })}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New User
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedUser ? (
                      <UserForm 
                        user={selectedUser}
                        roles={roles}
                        onSubmit={selectedUser.isNew 
                          ? handleUserCreate 
                          : (userData) => handleUserUpdate(selectedUser.id, userData)
                        }
                        onCancel={() => setSelectedUser(null)}
                        onPasswordReset={handlePasswordReset}
                        onRoleAssign={handleRoleAssignment}
                      />
                    ) : (
                      <UserList 
                        users={users} 
                        roles={roles}
                        onEdit={setSelectedUser}
                        onDelete={handleUserDelete}
                        currentUserId={user?.id}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="roles">
                <Card>
                  <CardHeader className="card-header-with-action">
                    <div>
                      <CardTitle>Roles & Permissions</CardTitle>
                      <p className="card-description">Manage roles and their associated permissions</p>
                    </div>
                    {!selectedRole && (
                      <Button 
                        onClick={() => setSelectedRole({ isNew: true })}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Role
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedRole ? (
                      <RoleForm 
                        role={selectedRole}
                        permissions={permissions}
                        onSubmit={selectedRole.isNew 
                          ? handleRoleCreate 
                          : (roleData) => handleRoleUpdate(selectedRole.id, roleData)
                        }
                        onCancel={() => setSelectedRole(null)}
                      />
                    ) : (
                      <RoleList 
                        roles={roles} 
                        onEdit={setSelectedRole}
                        onDelete={handleRoleDelete}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invitations">
                <InvitationManagement />
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default UserManagement;
