import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";

import ProductCard from "./ProductCard";
import { getProducts } from "../../services/product/product.service";

const BestSellerSection = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const products = await getProducts();

        const topProducts = products
          .filter(
            (product) =>
              product.status === "active" && product.stock > 0
          )
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 4);

        setBestSellers(topProducts);
      } catch (error) {
        console.error("Failed to load best seller products:", error);
      }
    };

    fetchBestSeller();
  }, []);

  return (
    <section id="bestseller" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
            <h2
              className="fw-bold m-0"
              style={{
                fontSize: "42px",
                color: "#4b3f3f",
              }}
            >
              Bán Chạy Nhất
            </h2>

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
          </div>

          <p
            className="mb-0"
            style={{
              color: "#8b7d7d",
              fontSize: "18px",
            }}
          >
            Những chú gấu bông được mua nhiều nhất bởi khách hàng
          </p>
        </div>

        {/* Product List */}
        <Row className="g-4">
          {bestSellers.map((product) => (
            <Col key={product.id} lg={3} md={6} sm={6}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {/* Button */}
        <div className="text-center mt-5">
          <Button
            as={Link}
            to="/products"
            className="px-4 py-3 border-0 rounded-pill"
            style={{
              background: "linear-gradient(135deg, #ff8fb1, #ffb6c1)",
            }}
          >
            Xem tất cả sản phẩm
            <ArrowRight size={18} className="ms-2" />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default BestSellerSection;