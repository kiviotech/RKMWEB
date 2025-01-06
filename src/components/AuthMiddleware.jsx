import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const pathname = location.pathname;

  // Allow access to /allDonationDetails regardless of auth status
  if (pathname === "/allDonationDetails") {
    return children;
  }

  // Existing redirect logic for other public routes
  if (user) {
    if (user.user_role === "superadmin") {
      return <Navigate to="/newDonation" state={{ from: location }} replace />;
    } else if (user.user_role === "subadmin") {
      return <Navigate to="/newDonation" state={{ from: location }} replace />;
    } else if (user.user_role === "deeksha") {
      return <Navigate to="/deeksha" state={{ from: location }} replace />;
    }
  }

  return children;
};
