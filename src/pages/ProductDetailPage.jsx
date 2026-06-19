import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductOptions from "../components/product/ProductOptions";
import ProductActions from "../components/product/ProductActions";
import ProductFeatures from "../components/product/ProductFeatures";
import { useProductDetailStore } from "../store/product.store";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProduct, clearStore } = useProductDetailStore();

  useEffect(() => {
    fetchProduct(id);
    return () => clearStore();
  }, [id, fetchProduct, clearStore]);

  return (
    <div className="min-vh-100 py-4">
      <Container>
        {/* Back button */}
        <Button
          variant="link"
          className="text-decoration-none text-muted p-0 mb-3"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="me-1" />
          Quay lại
        </Button>

        <Row className="g-4">
          {/* Gallery */}
          <Col lg={6}>
            <ProductGallery />
          </Col>

          {/* Info + Options + Actions */}
          <Col lg={6}>
            <ProductInfo />
            <ProductOptions />
            <ProductActions />
            <ProductFeatures />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
