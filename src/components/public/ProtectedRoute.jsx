import React from "react";
import { useAuthStore } from "../../store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role, loading } = useAuthStore();
  if (loading) return <Loading fullScreen />;

  // chưa login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // check role: so sánh role.name với danh sách allowedRoles
  if (allowedRoles && !allowedRoles.includes(user?.roleId)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
