import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ImageWithFallback from "./ImageWithFallback";

const Hero = () => {
  return (
    <div className="hero-section py-5">
      <Container>
        <Row className="align-items-center g-5">
          {/* LEFT CONTENT */}
          <Col lg={6}>
            <h1 className="display-3 fw-bold mb-4">
              Gấu Bông Đáng Yêu
              <span className="d-block mt-2" style={{ color: "#FFB6C1" }}>
                Cho Mọi Lứa Tuổi
              </span>
            </h1>

            <p className="lead text-muted mb-4">
              Khám phá bộ sưu tập gấu bông cao cấp, mềm mại và đáng yêu. Món quà
              hoàn hảo cho người thân yêu của bạn.
            </p>

            <div className="d-flex gap-3 mb-5">
              <Button
                size="lg"
                className="rounded-pill px-4"
                style={{
                  background: "linear-gradient(45deg, #ff9a9e, #fad0c4)",
                  border: "none",
                }}
              >
                Mua Ngay
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-pill px-4"
                style={{ borderColor: "#FFB6C1", color: "#FFB6C1" }}
              >
                Xem Thêm
              </Button>
            </div>

            <Row className="g-4">
              <Col xs={4}>
                <div className="display-6 fw-bold">500+</div>
                <div className="text-muted">Sản phẩm</div>
              </Col>

              <Col xs={4}>
                <div className="display-6 fw-bold">10K+</div>
                <div className="text-muted">Khách hàng</div>
              </Col>

              <Col xs={4}>
                <div className="display-6 fw-bold">4.9★</div>
                <div className="text-muted">Đánh giá</div>
              </Col>
            </Row>
          </Col>

          {/* RIGHT IMAGE */}
          <Col lg={6}>
            <div className="position-relative">
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                style={{
                  background: "radial-gradient(circle, #ffd1dc, transparent)",
                  filter: "blur(40px)",
                  zIndex: 0,
                }}
              />

              <ImageWithFallback
                src="https://images.unsplash.com/photo-1648311203209-da34f7d0d800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Gấu bông đáng yêu"
                className="img-fluid rounded-4 shadow-lg position-relative"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;
