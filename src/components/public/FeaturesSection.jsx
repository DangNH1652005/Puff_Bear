import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Truck, ShieldCheck, Headphones } from "lucide-react";
import FeatureItem from "./FeatureItem";

const FeaturesSection = () => {
  return (
    <section className="py-5">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <FeatureItem
              icon={Truck}
              title="Miễn phí vận chuyển"
              desc="Đơn hàng từ 500k"
            />
          </Col>

          <Col md={4}>
            <FeatureItem
              icon={ShieldCheck}
              title="Đổi trả dễ dàng"
              desc="Trong vòng 7 ngày"
            />
          </Col>

          <Col md={4}>
            <FeatureItem
              icon={Headphones}
              title="Hỗ trợ 24/7"
              desc="Luôn sẵn sàng tư vấn"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;
