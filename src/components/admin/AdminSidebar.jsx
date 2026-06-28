import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Tag,
  LogOut,
  CloudRain,
} from "lucide-react";

import { Nav, Button, Container, Spinner } from "react-bootstrap";
import { useUserStore } from "../../store/user.store";
import { useEffect } from "react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Sản phẩm", path: "/admin/products" },
  { icon: ShoppingCart, label: "Đơn hàng", path: "/admin/orders" },
  { icon: Users, label: "Khách hàng", path: "/admin/users" },
  { icon: Tag, label: "Thể loại", path: "/admin/categories" },
  { icon: CloudRain, label: "Màu sắc và kích cỡ", path: "/admin/size-color" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user: authUser, logout } = useAuthStore();
  const { user: adminData, fetchUser, updateUser } = useUserStore();

  useEffect(() => {
    if (authUser?.id) {
      fetchUser(authUser.id);
    }
  }, [authUser?.id, fetchUser]);

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/auth/login");
  };

  if (!adminData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: "#ff6b8b" }} />
      </Container>
    );
  }

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

      <div className="p-3 border-top border-pink">
        {/* Khu vực thông tin cá nhân thay cho nút trợ giúp */}
        <Link
          to="/admin/profile"
          className="p-3 d-flex align-items-center gap-3 text-decoration-none custom-avatar-link rounded-3 mb-2"
          style={{ display: "flex" }}
        >
          {/* Ảnh đại diện nhỏ */}
          <img
            src={adminData.avatar}
            alt={adminData.fullName}
            className="rounded-circle border border-2 border-white shadow-sm"
            style={{ width: "45px", height: "45px", objectFit: "cover" }}
          />

          {/* Tên và quyền hạn bên cạnh */}
          <div className="overflow-hidden">
            <div
              className="fw-bold text-dark text-truncate"
              style={{ fontSize: "0.95rem" }}
            >
              {adminData.fullName}
            </div>
            <small
              className="text-pink-dark fw-medium text-capitalize d-block"
              style={{ fontSize: "0.8rem" }}
            >
              {adminData.role} hệ thống
            </small>
          </div>
        </Link>
        <Button
          variant="outline-danger"
          className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3 rounded-pill"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
