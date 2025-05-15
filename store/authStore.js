import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ROLES, PERMISSIONS } from "../src/constants/permissions";

// Helper function to normalize role formats
const normalizeRole = (roleName) => {
  if (!roleName) return null;
  
  // Convert to lowercase string
  const role = String(roleName).toLowerCase();
  
  // Map of common role variations to their canonical form
  const roleMap = {
    'super-admin': ROLES.SUPER_ADMIN,
    'superadmin': ROLES.SUPER_ADMIN,
    'super_admin': ROLES.SUPER_ADMIN,
    'admin': ROLES.ADMIN,
    'account-admin': ROLES.ACCOUNT_ADMIN,
    'account_admin': ROLES.ACCOUNT_ADMIN,
    'accountadmin': ROLES.ACCOUNT_ADMIN,
    'donation': ROLES.DONATION,
    'donation-admin': ROLES.DONATION_ADMIN,
    'donation_admin': ROLES.DONATION_ADMIN,
    'donationadmin': ROLES.DONATION_ADMIN,
    'guest-house': ROLES.GUEST_HOUSE,
    'guest_house': ROLES.GUEST_HOUSE,
    'guesthouse': ROLES.GUEST_HOUSE,
  };
  
  // Return the normalized role or the original if no mapping exists
  return roleMap[role] || role;
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],
      setUser: (user) => {
        // If no user, just set to null
        if (!user) {
          set({ user: null });
          return;
        }
        
        // Make a deep copy to avoid mutating the original object
        const normalizedUser = JSON.parse(JSON.stringify(user));
        
        // Normalize role information to prevent duplication
        if (normalizedUser.role && normalizedUser.role.type) {
          normalizedUser.role.type = normalizeRole(normalizedUser.role.type);
        }
        
        if (normalizedUser.user_role) {
          normalizedUser.user_role = normalizeRole(normalizedUser.user_role);
          
          // Ensure role object exists with proper type if only user_role exists
          if (!normalizedUser.role) {
            normalizedUser.role = {
              type: normalizedUser.user_role,
              name: normalizedUser.user_role.charAt(0).toUpperCase() + normalizedUser.user_role.slice(1).replace(/-|_/g, ' ')
            };
          }
        }
        
        // Log the normalized user for debugging
        console.log('[AUTH STORE] Setting normalized user:', JSON.stringify(normalizedUser, null, 2));
        
        set({ user: normalizedUser });
      },
      setToken: (token) => set({ token }),
      setPermissions: (permissions) => set({ permissions }),
      hasPermission: (permission) => {
        console.log(`[PERMISSION DEBUG] Checking permission: "${permission}"`);
        const { user, permissions } = get();
        
        if (!user) {
          console.log(`[PERMISSION DEBUG] No user found, denying permission: "${permission}"`);
          return false;
        }
        
        console.log(`[PERMISSION DEBUG] User found: ${user.username}`);
        console.log(`[PERMISSION DEBUG] Role object: ${JSON.stringify(user.role || {})}`);
        console.log(`[PERMISSION DEBUG] Legacy user_role: ${user.user_role || 'none'}`);
        
        // Super Admin has all permissions - prioritize role.type
        if (user?.role?.type === ROLES.SUPER_ADMIN) {
          console.log(`[PERMISSION DEBUG] User has Super Admin role (from role.type), granting all permissions`);
          return true;
        }
        // Fallback for backward compatibility
        if (user?.user_role === ROLES.SUPER_ADMIN) {
          console.log(`[PERMISSION DEBUG] User has Super Admin role (from user_role), granting all permissions`);
          return true;
        }
        
        // Check if the permission exists in our array
        console.log(`[PERMISSION DEBUG] Checking against ${permissions.length} permissions`);
        
        // First check with the exact permission name
        if (permissions.includes(permission)) {
          console.log(`[PERMISSION DEBUG] Found exact permission match for: "${permission}"`);
          return true;
        }
        
        // Then check with the API format (api::module.controller.action)
        // This handles permissions like "donation.create" matching "api::donation.donation.create"
        if (permission.includes('.')) {
          const [resource, action] = permission.split('.');
          const apiPattern = `api::${resource}.${resource}.${action}`;
          console.log(`[PERMISSION DEBUG] Looking for API pattern: "${apiPattern}"`);
          
          const found = permissions.some(p => p === apiPattern || p === permission);
          if (found) {
            console.log(`[PERMISSION DEBUG] Found API pattern match for: "${permission}"`);
            return true;
          }
        }
        
        console.log(`[PERMISSION DEBUG] Permission "${permission}" denied - no matches found`);
        return false;
      },
      hasRole: (role) => {
        // Normalize the requested role
        const normalizedRequestedRole = normalizeRole(role);
        console.log(`[ROLE DEBUG] Checking role: "${role}" (normalized: "${normalizedRequestedRole}")`);
        
        const { user } = get();
        
        if (!user) {
          console.log(`[ROLE DEBUG] No user found, denying role: "${role}"`);
          return false;
        }
        
        console.log(`[ROLE DEBUG] User found: ${user.username}`);
        console.log(`[ROLE DEBUG] Role object: ${JSON.stringify(user.role || {})}`);
        console.log(`[ROLE DEBUG] Legacy user_role: ${user.user_role || 'none'}`);
        
        // Get normalized versions of the user roles
        const normalizedRoleType = user.role ? normalizeRole(user.role.type) : null;
        const normalizedUserRole = normalizeRole(user.user_role);
        
        console.log(`[ROLE DEBUG] Normalized role.type: "${normalizedRoleType}"`);
        console.log(`[ROLE DEBUG] Normalized user_role: "${normalizedUserRole}"`);
        
        // Super Admin has all roles
        if (normalizedRoleType === ROLES.SUPER_ADMIN || normalizedUserRole === ROLES.SUPER_ADMIN) {
          console.log(`[ROLE DEBUG] Super Admin role detected, granting access`);
          return true;
        }
        
        // Primary check: use role.type from the role object (recommended approach)
        if (normalizedRoleType === normalizedRequestedRole) {
          console.log(`[ROLE DEBUG] Role match found via normalized role.type: "${normalizedRoleType}"`);
          return true;
        }
        
        // Fallback check: use user_role for backward compatibility
        if (normalizedUserRole === normalizedRequestedRole) {
          console.log(`[ROLE DEBUG] Role match found via normalized user_role: "${normalizedUserRole}"`);
          return true;
        }
        
        // Special handling for donation roles
        if (normalizedRequestedRole === ROLES.DONATION || normalizedRequestedRole === ROLES.DONATION_ADMIN) {
          // Check if the user has any donation-related role
          const hasDonationRole = (
            normalizedRoleType === ROLES.DONATION || 
            normalizedRoleType === ROLES.DONATION_ADMIN ||
            normalizedUserRole === ROLES.DONATION || 
            normalizedUserRole === ROLES.DONATION_ADMIN ||
            (user.role && user.role.name && user.role.name.toLowerCase().includes('donation'))
          );
          
          if (hasDonationRole) {
            console.log(`[ROLE DEBUG] Donation role match found through comprehensive checks`);
            return true;
          }
        }
        
        console.log(`[ROLE DEBUG] Role "${role}" denied - no matches found`);
        return false;
      },
      logout: () => set({ user: null, token: null, permissions: [] }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
