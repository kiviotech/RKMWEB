import React from 'react';
import { useAuthStore } from '../../../store/authStore';

/**
 * A component that conditionally renders children based on user permissions
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render if user has permission
 * @param {string} props.permission - Required permission to display content
 * @param {React.ReactNode} props.fallback - Content to display if user lacks permission (optional)
 */
const PermissionGuard = ({ children, permission, fallback = null }) => {
  // If no permission is required, skip the permission check
  if (permission === null || permission === undefined) {
    return <>{children}</>;
  }
  
  // Otherwise, check if the user has the required permission
  const hasPermission = useAuthStore(state => state.hasPermission(permission));
  
  if (!hasPermission) {
    return fallback;
  }
  
  return <>{children}</>;
};

export default PermissionGuard;
