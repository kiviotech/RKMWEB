/**
 * Permission constants for role-based access control
 */

// Role types
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  ACCOUNT_ADMIN: 'account-admin',
  DONATION: 'donation',
  DONATION_ADMIN: 'donation_admin',  // Add this to match API response
  GUEST_HOUSE: 'guest-house',
};

// Permission constants
export const PERMISSIONS = {
  // Admin permissions
  ADMIN_ACCESS: 'admin.access',
  
  // User management permissions
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_MANAGE: 'user.manage',
  
  // Donation management permissions
  DONATION_CREATE: 'donation.create',
  DONATION_READ: 'donation.read',
  DONATION_UPDATE: 'donation.update',
  DONATION_DELETE: 'donation.delete',
  DONATION_RECEIPT_EDIT: 'donation.receipt.edit',
  DONATION_VERIFY: 'donation.verify',
  
  // Guest management permissions
  GUEST_CREATE: 'guest.create',
  GUEST_READ: 'guest.read',
  GUEST_UPDATE: 'guest.update',
  GUEST_DELETE: 'guest.delete',
  
  // Room management permissions
  ROOM_CREATE: 'room.create',
  ROOM_READ: 'room.read',
  ROOM_UPDATE: 'room.update',
  ROOM_DELETE: 'room.delete',
  ROOM_ALLOCATE: 'room.allocate',
  ROOM_BLOCK: 'room.block',
  
  // Reports
  REPORTS_ACCESS: 'reports.access',
  REPORTS_GENERATE: 'reports.generate',
  
  // Settings
  SETTINGS_ACCESS: 'settings.access',
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  // Super Admin has all permissions
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  
  // Admin has most permissions except sensitive user management and settings
  [ROLES.ADMIN]: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.USER_READ,
    PERMISSIONS.DONATION_CREATE,
    PERMISSIONS.DONATION_READ,
    PERMISSIONS.DONATION_UPDATE,
    PERMISSIONS.GUEST_CREATE,
    PERMISSIONS.GUEST_READ,
    PERMISSIONS.GUEST_UPDATE,
    PERMISSIONS.ROOM_READ,
    PERMISSIONS.ROOM_ALLOCATE,
    PERMISSIONS.REPORTS_ACCESS,
    PERMISSIONS.REPORTS_GENERATE,
  ],
  
  // Donation role has permissions related to donations only
  [ROLES.DONATION]: [
    PERMISSIONS.DONATION_CREATE,
    PERMISSIONS.DONATION_READ,
    PERMISSIONS.DONATION_UPDATE,
    PERMISSIONS.GUEST_READ,
  ],
  
  // Donation Admin role has advanced donation permissions including receipt editing
  [ROLES.DONATION_ADMIN]: [
    PERMISSIONS.DONATION_CREATE,
    PERMISSIONS.DONATION_READ,
    PERMISSIONS.DONATION_UPDATE,
    PERMISSIONS.DONATION_DELETE,
    PERMISSIONS.DONATION_RECEIPT_EDIT,
    PERMISSIONS.DONATION_VERIFY,
    PERMISSIONS.GUEST_READ,
    PERMISSIONS.REPORTS_ACCESS,
    PERMISSIONS.REPORTS_GENERATE,
  ],
  
  // Guest House role has permissions related to guests and rooms
  [ROLES.GUEST_HOUSE]: [
    PERMISSIONS.GUEST_CREATE, 
    PERMISSIONS.GUEST_READ,
    PERMISSIONS.GUEST_UPDATE,
    PERMISSIONS.ROOM_READ,
    PERMISSIONS.ROOM_ALLOCATE,
  ],
};
