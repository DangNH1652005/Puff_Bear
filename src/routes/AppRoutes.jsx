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
import ProductDetailPage from "../pages/ProductDetailPage";
import CheckoutPage from "../pages/order/CheckoutPage";
import OrderSuccessPage from "../pages/order/OrderSuccessPage";
import AdminProducts from "../pages/admin/AdminProducts";
import CartPage from "../pages/cart/CartPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />


      {/* ADMIN ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["zJUF8HyGSzo"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashBoardPage />} />
          <Route path="products" element={<AdminProducts />} />
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
