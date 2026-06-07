import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Heart,
  Tag,
  MessageSquare,
  LogOut,
} from "lucide-react";

import { Nav, Button, Container } from "react-bootstrap";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Sản phẩm", path: "/admin/products" },
  { icon: ShoppingCart, label: "Đơn hàng", path: "/admin/orders" },
  { icon: Users, label: "Khách hàng", path: "/admin/customers" },
  { icon: Tag, label: "Danh mục", path: "/admin/categories" },
  { icon: Heart, label: "Yêu thích", path: "/admin/favorites" },
  { icon: BarChart3, label: "Thống kê", path: "/admin/analytics" },
  { icon: MessageSquare, label: "Đánh giá", path: "/admin/reviews" },
  { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/auth/login");
  };

  return (
    <div
      className="d-flex flex-column bg-white border-end"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="p-4 border-bottom">
        <Link
          to="/admin"
          className="text-decoration-none d-flex align-items-center gap-2"
        >
          <div style={{ fontSize: "28px" }}>🧸</div>
          <div>
            <div className="fw-bold text-dark fs-5">Buff Bear</div>
            <small className="text-muted">Admin Panel</small>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <Nav className="flex-column p-3 gap-1 flex-grow-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded ${
                isActive
                  ? "bg-light text-primary fw-semibold"
                  : "text-dark hover-bg-light"
              }`}
              style={{ cursor: "pointer" }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Nav.Link>
          );
        })}
      </Nav>

      {/* Footer */}
      <div className="p-3 border-top">
        <Button
          variant="outline-danger"
          className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Đăng xuất
        </Button>

        <div className="p-3 rounded bg-light">
          <div className="fw-semibold mb-1">Cần hỗ trợ?</div>
          <small className="text-muted d-block mb-2">
            Liên hệ đội ngũ hỗ trợ
          </small>
          <Button variant="light" size="sm" className="w-100 border">
            Trợ giúp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
