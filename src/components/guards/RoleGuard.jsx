import React from 'react';
import { useAuthStore } from '../../../store/authStore';

/**
 * A component that conditionally renders children based on user role
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render if user has specified role
 * @param {string|string[]} props.roles - Required role(s) to display content
 * @param {React.ReactNode} props.fallback - Content to display if user lacks required role (optional)
 */
const RoleGuard = ({ children, roles, fallback = null }) => {
  const user = useAuthStore(state => state.user);
  const hasRoleFunc = useAuthStore(state => state.hasRole);
  
  // Handle case when roles is an array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  // Check if user has any of the allowed roles using the auth store's hasRole function
  const hasRequiredRole = user && allowedRoles.some(role => hasRoleFunc(role));
  
  if (!hasRequiredRole) {
    return fallback;
  }
  
  return <>{children}</>;
};

export default RoleGuard;
