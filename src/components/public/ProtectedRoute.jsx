import { useAuthStore } from "../../store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuthStore();
  if (loading) {
    return <Loading fullScreen />;
  }

  // chưa login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // check role: so sánh role.name với danh sách allowedRoles
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
