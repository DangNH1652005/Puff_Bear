import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Layout from "../layouts/Layout";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/public/ProtectedRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashBoardPage from "../pages/admin/AdminDashBoardPage";
import StaffLayout from "../layouts/StaffLayout";
import StaffDashBoardPage from "../pages/staff/StaffDashBoardPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* ADMIN ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashBoardPage />} />
        </Route>
      </Route>

      {/* STAFF ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashBoardPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
