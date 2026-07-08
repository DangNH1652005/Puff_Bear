import { Routes, Route } from "react-router-dom";
import OrderHistoryPage from "../pages/order/OrderHistoryPage";
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
import AdminOrderManagerPage from "../pages/admin/AdminOrderManagerPage";
import StaffProducts from "../pages/staff/StaffProducts";
import CartPage from "../pages/cart/CartPage";
import ProductListPage from "../components/product/ProductListPage";
import AdminUserManager from "../pages/admin/AdminUserManager";
import { role } from "../constants/role.constant";
import AdminSizeColor from "../pages/admin/AdminSizeColor";
import StaffOrderManagerPage from "../pages/staff/StaffOrderManagerPage";
import ProfileCustomerPage from "../pages/ProfileCustomerPage";
import ProfileAdminPage from "../pages/admin/ProfileAdminPage";
import ProfileStaffPage from "../pages/staff/ProfileStaffPage";
import StaffUserManager from "../pages/staff/StaffUserManager";
import AdminCategory from "../pages/admin/AdminCategory";
import StaffCategory from "../pages/staff/StaffCategory";
import AdminReviews from "../pages/admin/AdminReviews";
import StaffReviews from "../pages/staff/StaffReviews";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Route>

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={role.CUSTOMER} />}>
        <Route element={<Layout />}>
          <Route
            path="/order-success/:orderId"
            element={<OrderSuccessPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders-history" element={<OrderHistoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfileCustomerPage />} />
        </Route>
      </Route>

      {/* ADMIN ONLY */}
      <Route element={<ProtectedRoute allowedRoles={[role.ADMIN]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashBoardPage />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrderManagerPage />} />
          <Route path="users" element={<AdminUserManager />} />
          <Route path="size-color" element={<AdminSizeColor />} />
          <Route path="profile" element={<ProfileAdminPage />} />
          <Route path="categories" element={<AdminCategory />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
      </Route>

      {/* STAFF ONLY */}
      <Route element={<ProtectedRoute allowedRoles={[role.STAFF]} />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashBoardPage />} />
          <Route path="products" element={<StaffProducts />} />
          <Route path="orders" element={<StaffOrderManagerPage />} />
          <Route path="profile" element={<ProfileStaffPage />}/>
          <Route path="customers" element={<StaffUserManager />} />
          <Route path="categories" element={<StaffCategory />} />
          <Route path="reviews" element={<StaffReviews />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
