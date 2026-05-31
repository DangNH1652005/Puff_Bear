import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getProductById } from "../services/product/product.service";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductOptions from "../components/product/ProductOptions";
import ProductActions from "../components/product/ProductActions";
import ProductFeatures from "../components/product/ProductFeatures";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection state được emit lên từ ProductOptions
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        if (!data) {
          setError("Không tìm thấy sản phẩm.");
          return;
        }
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Đã có lỗi xảy ra khi tải sản phẩm.");
        toast.error("Đã có lỗi xảy ra khi tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-danger mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-muted">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !product) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center gap-3"
        style={{ minHeight: "60vh" }}
      >
        <h4 className="text-muted">{error || "Không tìm thấy sản phẩm."}</h4>
        <Button variant="outline-danger" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} className="me-1" />
          Quay lại
        </Button>
      </div>
    );
  }

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
            <ProductGallery
              images={product.images ?? [product.image]}
              name={product.name}
              isBestSeller={product.isBestSeller}
              isNew={product.isNew}
              discount={product.discount}
            />
          </Col>

          {/* Info + Options + Actions */}
          <Col lg={6}>
            <ProductInfo product={product} />

            <ProductOptions
              product={product}
              onSelectionChange={setSelection}
            />

            <ProductActions product={product} selection={selection} />

            <ProductFeatures />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
