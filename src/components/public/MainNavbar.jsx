import { ShoppingCart, Heart, Menu, Search } from "lucide-react";
import { Navbar, Nav, Container, Button, Form, Badge } from "react-bootstrap";
import React, { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { useFavoriteStore } from "../../store/favorite.store";
import { Link, useNavigate } from "react-router-dom";

const MainNavbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { cartItems, fetchCart, clearCart } = useCartStore();
  const { favorites, fetchFavorites, clearFavorites } = useFavoriteStore();

  useEffect(() => {
    if (user && user.id) {
      fetchCart(user.id);
      fetchFavorites(user.id);
    } else {
      clearCart();
      clearFavorites();
    }
  }, [user, fetchCart, clearCart, fetchFavorites, clearFavorites]);

  const handleLogout = () => {
    logout();
    clearCart();
    clearFavorites();
  };

  return (
    <Navbar expand="lg" bg="white" className="shadow-sm sticky-top py-3">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="#" className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "45px",
              height: "45px",
              background: "linear-gradient(135deg, #ff8fb1, #ffb6c1)",
            }}
          >
            <Heart size={22} color="white" fill="white" />
          </div>

          <span
            className="fw-bold fs-4"
            style={{
              background: "linear-gradient(135deg, #ff69b4, #ff8fab)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Puff Bear
          </span>
        </Navbar.Brand>

        {/* Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <Menu size={24} />
        </Navbar.Toggle>

        {/* Menu */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto text-center">
            <Nav.Link href="/">Trang chủ</Nav.Link>
            <Nav.Link href="/products">Sản phẩm</Nav.Link>
            <Nav.Link href="/orders-history">Lịch sử đặt hàng</Nav.Link>
          </Nav>

          {/* Right */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Search */}
            <div className="position-relative d-none d-lg-block">
              <Search
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
              />

              <Form.Control
                type="text"
                placeholder="Tìm kiếm gấu bông..."
                className="ps-5 rounded-pill"
                style={{ width: "250px" }}
              />
            </div>

            {/* Wishlist */}
            <Button
              variant="light"
              className="rounded-circle position-relative d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
              onClick={() => navigate("/wishlist")}
            >
              <Heart size={20} className={favorites.length > 0 ? "text-danger fill-danger" : "text-dark"} />
              {favorites.length > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute rounded-circle"
                  style={{ top: "0", right: "0", transform: "translate(30%, -30%)" }}
                >
                  {favorites.length}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="light"
              className="rounded-circle position-relative d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                {/* Avatar → click sang user detail */}
                <Link to="/profile" className="d-flex align-items-center">
                  <img
                    src={user.avatar || "/profile.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-circle object-fit-cover border"
                    style={{ cursor: "pointer" }}
                  />
                </Link>

                {/* Logout button */}
                <Button
                  variant="light"
                  className="rounded-pill px-4"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link to="/auth/login">
                <Button variant="light" className="rounded-pill px-4">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
