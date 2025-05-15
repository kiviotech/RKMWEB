import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

/**
 * A route wrapper that checks for authentication and optionally permission/role requirements
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.permission - Required permission (optional)
 * @param {string|string[]} props.roles - Required role(s) (optional)
 * @param {string} props.redirectPath - Path to redirect to if unauthorized (defaults to /login)
 */
const ProtectedRoute = ({ 
  children, 
  permission, 
  roles, 
  redirectPath = '/login' 
}) => {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const hasPermission = useAuthStore(state => 
    permission ? state.hasPermission(permission) : true
  );
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Check role requirements if specified
  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const hasRequiredRole = allowedRoles.some(role => useAuthStore.getState().hasRole(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }
  
  // Check permission requirements if specified
  if (permission && !hasPermission) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
