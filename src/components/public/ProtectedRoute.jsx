import React from "react";
import { useAuthStore } from "../../store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="auth/login" replace />;
  }

  // check role ... comming soon
  return <Outlet />;
};

export default ProtectedRoute;
