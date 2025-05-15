import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ROLES } from "../constants/permissions";

export const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();
  const pathname = location.pathname;

  console.log(`[PUBLIC ROUTE DEBUG] Checking if user is authenticated`);
  console.log(`[PUBLIC ROUTE DEBUG] User:`, user);
  
  // Allow access to /allDonationDetails regardless of auth status
  if (pathname === "/allDonationDetails") {
    console.log(`[PUBLIC ROUTE DEBUG] Allowing access to allDonationDetails`);
    return children;
  }

  // If user is authenticated, redirect based on role
  if (user) {
    console.log(`[PUBLIC ROUTE DEBUG] User is authenticated, checking role`);
    console.log(`[PUBLIC ROUTE DEBUG] Role type from API:`, user.role?.type);
    console.log(`[PUBLIC ROUTE DEBUG] Legacy user_role:`, user.user_role);
    
    if (hasRole(ROLES.SUPER_ADMIN) || hasRole(ROLES.ADMIN)) {
      console.log(`[PUBLIC ROUTE DEBUG] Redirecting admin user to /newDonation`);
      return <Navigate to="/newDonation" state={{ from: location }} replace />;
    } else if (hasRole('deeksha')) {
      console.log(`[PUBLIC ROUTE DEBUG] Redirecting deeksha user to /deeksha`);
      return <Navigate to="/deeksha" state={{ from: location }} replace />;
    }
  }

  return children;
};
