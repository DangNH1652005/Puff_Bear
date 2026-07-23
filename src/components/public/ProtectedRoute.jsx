import { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession().catch(() => {});
  }, [restoreSession]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
