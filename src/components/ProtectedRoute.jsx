import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ROLES } from "../constants/permissions";

export const SuperAdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();

  console.log(`[ROUTE DEBUG] SuperAdminRoute - Checking access`);
  console.log(`[ROUTE DEBUG] User: ${user ? user.username : 'null'}`);
  console.log(`[ROUTE DEBUG] Role data:`, user?.role);
  console.log(`[ROUTE DEBUG] Legacy user_role: ${user?.user_role}`);
  console.log(`[ROUTE DEBUG] Required role: ${ROLES.SUPER_ADMIN}`);
  
  const hasAccess = user && hasRole(ROLES.SUPER_ADMIN);
  console.log(`[ROUTE DEBUG] Access granted: ${hasAccess}`);
  
  if (!hasAccess) {
    console.log(`[ROUTE DEBUG] Redirecting to login page`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const SubAdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();

  console.log(`[ROUTE DEBUG] SubAdminRoute - Checking access`);
  console.log(`[ROUTE DEBUG] User: ${user ? user.username : 'null'}`);
  console.log(`[ROUTE DEBUG] Role data:`, user?.role);
  console.log(`[ROUTE DEBUG] Legacy user_role: ${user?.user_role}`);
  console.log(`[ROUTE DEBUG] Required roles: ${ROLES.SUPER_ADMIN} or ${ROLES.ADMIN}`);
  
  const hasSuperAdminRole = user && hasRole(ROLES.SUPER_ADMIN);
  const hasAdminRole = user && hasRole(ROLES.ADMIN);
  console.log(`[ROUTE DEBUG] Has Super Admin role: ${hasSuperAdminRole}`);
  console.log(`[ROUTE DEBUG] Has Admin role: ${hasAdminRole}`);
  
  const hasAccess = user && (hasSuperAdminRole || hasAdminRole);
  console.log(`[ROUTE DEBUG] Access granted: ${hasAccess}`);
  
  if (!hasAccess) {
    console.log(`[ROUTE DEBUG] Redirecting to login page`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const DeekshaRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();

  console.log(`[ROUTE DEBUG] DeekshaRoute - Checking access`);
  console.log(`[ROUTE DEBUG] User: ${user ? user.username : 'null'}`);
  console.log(`[ROUTE DEBUG] Role data:`, user?.role);
  console.log(`[ROUTE DEBUG] Legacy user_role: ${user?.user_role}`);
  console.log(`[ROUTE DEBUG] Required role: deeksha`);
  
  const hasSuperAdminRole = user && hasRole(ROLES.SUPER_ADMIN);
  const hasDeekshaRole = user && hasRole('deeksha');
  console.log(`[ROUTE DEBUG] Has Super Admin role: ${hasSuperAdminRole}`);
  console.log(`[ROUTE DEBUG] Has Deeksha role: ${hasDeekshaRole}`);
  
  const hasAccess = user && (hasSuperAdminRole || hasDeekshaRole);
  console.log(`[ROUTE DEBUG] Access granted: ${hasAccess}`);
  
  if (!hasAccess) {
    console.log(`[ROUTE DEBUG] Redirecting to login page`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const DonationRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();

  console.log(`[ROUTE DEBUG] DonationRoute - Checking access`);
  console.log(`[ROUTE DEBUG] User: ${user ? user.username : 'null'}`);
  console.log(`[ROUTE DEBUG] Role data:`, user?.role);
  console.log(`[ROUTE DEBUG] Legacy user_role: ${user?.user_role}`);
  console.log(`[ROUTE DEBUG] Required role: ${ROLES.DONATION}`);
  
  const hasSuperAdminRole = user && hasRole(ROLES.SUPER_ADMIN);
  const hasDonationRole = user && hasRole(ROLES.DONATION);
  console.log(`[ROUTE DEBUG] Has Super Admin role: ${hasSuperAdminRole}`);
  console.log(`[ROUTE DEBUG] Has Donation role: ${hasDonationRole}`);
  
  const hasAccess = user && (hasSuperAdminRole || hasDonationRole);
  console.log(`[ROUTE DEBUG] Access granted: ${hasAccess}`);
  
  if (!hasAccess) {
    console.log(`[ROUTE DEBUG] Redirecting to login page`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const GuestHouseRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();

  console.log(`[ROUTE DEBUG] GuestHouseRoute - Checking access`);
  console.log(`[ROUTE DEBUG] User: ${user ? user.username : 'null'}`);
  console.log(`[ROUTE DEBUG] Role data:`, user?.role);
  console.log(`[ROUTE DEBUG] Legacy user_role: ${user?.user_role}`);
  console.log(`[ROUTE DEBUG] Required role: ${ROLES.GUEST_HOUSE}`);
  
  const hasSuperAdminRole = user && hasRole(ROLES.SUPER_ADMIN);
  const hasGuestHouseRole = user && hasRole(ROLES.GUEST_HOUSE);
  console.log(`[ROUTE DEBUG] Has Super Admin role: ${hasSuperAdminRole}`);
  console.log(`[ROUTE DEBUG] Has Guest House role: ${hasGuestHouseRole}`);
  
  const hasAccess = user && (hasSuperAdminRole || hasGuestHouseRole);
  console.log(`[ROUTE DEBUG] Access granted: ${hasAccess}`);
  
  if (!hasAccess) {
    console.log(`[ROUTE DEBUG] Redirecting to login page`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const SharedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();

  console.log(`[ROUTE DEBUG] SharedRoute - Checking access`);
  console.log(`[ROUTE DEBUG] User: ${user ? user.username : 'null'}`);
  console.log(`[ROUTE DEBUG] Role data:`, user?.role);
  console.log(`[ROUTE DEBUG] Legacy user_role: ${user?.user_role}`);
  console.log(`[ROUTE DEBUG] Required roles: ${ROLES.SUPER_ADMIN}, ${ROLES.DONATION}, ${ROLES.GUEST_HOUSE} or deeksha`);
  
  const hasSuperAdminRole = user && hasRole(ROLES.SUPER_ADMIN);
  const hasDeekshaRole = user && hasRole('deeksha');
  const hasDonationRole = user && hasRole(ROLES.DONATION);
  const hasGuestHouseRole = user && hasRole(ROLES.GUEST_HOUSE);
  console.log(`[ROUTE DEBUG] Has Super Admin role: ${hasSuperAdminRole}`);
  console.log(`[ROUTE DEBUG] Has Deeksha role: ${hasDeekshaRole}`);
  console.log(`[ROUTE DEBUG] Has Donation role: ${hasDonationRole}`);
  console.log(`[ROUTE DEBUG] Has Guest House role: ${hasGuestHouseRole}`);
  
  const hasAccess = user && (hasSuperAdminRole || hasDeekshaRole || hasDonationRole || hasGuestHouseRole);
  console.log(`[ROUTE DEBUG] Access granted: ${hasAccess}`);
  
  if (!hasAccess) {
    console.log(`[ROUTE DEBUG] Redirecting to login page`);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
