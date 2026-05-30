import { ShoppingCart, Heart, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Navbar, Nav, Container, Button, Form, Badge } from "react-bootstrap";

import React from "react";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "react-router-dom";

const MainNavbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
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
            <Nav.Link href="#">Trang chủ</Nav.Link>
            <Nav.Link href="#">Sản phẩm</Nav.Link>
            <Nav.Link href="#">Giảm giá</Nav.Link>
            <Nav.Link href="#">Liên hệ</Nav.Link>
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
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
            >
              <Heart size={20} />
            </Button>

            {/* Cart */}
            <Button
              variant="light"
              className="rounded-circle position-relative d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
            >
              <ShoppingCart size={20} />

              {/* <Badge
                pill
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle"
              >
                0
              </Badge> */}
            </Button>

            {user ? (
              <Button
                variant="light"
                className="rounded-pill px-4"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
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
