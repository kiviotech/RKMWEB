import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const SuperAdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user || user.user_role !== "superadmin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const SubAdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (
    !user ||
    (user.user_role !== "superadmin" && user.user_role !== "subadmin")
  ) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const DeekshaRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user || user.user_role !== "deeksha") {
    return <Navigate to="/newDonation" state={{ from: location }} replace />;
  }

  return children;
};

export const SharedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (
    !user ||
    (user.user_role !== "superadmin" && user.user_role !== "deeksha")
  ) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
