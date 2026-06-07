import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-5">
      <Container className="py-5">
        <Row className="g-4">
          {/* Logo + intro */}
          <Col xs={12} md={3}>
            <div className="d-flex align-items-center gap-2 mb-3">
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
              <span className="fs-5 fw-semibold">Puff Bear</span>
            </div>

            <p className="text-muted">
              Ôm trọn hạnh phúc cùng những chú gấu bông đáng yêu nhất
            </p>

            {/* Social */}
            <div className="d-flex gap-2">
              <a href="#" className="social-btn">
                <FaFacebookF size={14} />
              </a>

              <a href="#" className="social-btn">
                <FaInstagram size={14} />
              </a>

              <a href="#" className="social-btn">
                <FaTwitter size={14} />
              </a>
            </div>
          </Col>

          {/* Products */}
          <Col xs={12} md={3}>
            <h5 className="fw-semibold mb-3">Sản phẩm</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  className="text-muted text-decoration-none"
                  to="/products"
                >
                  Tất cả sản phẩm
                </Link>
              </li>
              <li className="mb-2">
                <a className="text-muted text-decoration-none" href="#">
                  Best Seller
                </a>
              </li>
              <li className="mb-2">
                <a className="text-muted text-decoration-none" href="#">
                  Sản phẩm mới
                </a>
              </li>
              <li className="mb-2">
                <a className="text-muted text-decoration-none" href="#">
                  Sale Off
                </a>
              </li>
            </ul>
          </Col>

          {/* Support */}
          <Col xs={12} md={3}>
            <h5 className="fw-semibold mb-3">Hỗ trợ</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a className="text-muted text-decoration-none" href="#">
                  Chính sách đổi trả
                </a>
              </li>
              <li className="mb-2">
                <a className="text-muted text-decoration-none" href="#">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li className="mb-2">
                <a className="text-muted text-decoration-none" href="#">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li className="mb-2">
                <a className="text-muted text-decoration-none" href="#">
                  Liên hệ
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col xs={12} md={3}>
            <h5 className="fw-semibold mb-3">Liên hệ</h5>

            <ul className="list-unstyled text-muted small">
              <li className="d-flex gap-2 mb-2">
                <MapPin size={16} />
                123 Đường ABC, Quận 1, TP.HCM
              </li>

              <li className="d-flex gap-2 mb-2">
                <Phone size={16} />
                0123 456 789
              </li>

              <li className="d-flex gap-2">
                <Mail size={16} />
                hello@puffbear.vn
              </li>
            </ul>
          </Col>
        </Row>

        {/* Bottom */}
        <div className="border-top mt-4 pt-3 text-center text-muted small">
          © 2026 Puff Bear. All rights reserved. Made with 💕
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
