import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductCard from "../../components/public/ProductCard";
import { useFavoriteStore } from "../../store/favorite.store";
import { useAuthStore } from "../../store/auth.store";
import { useEffect } from "react";
import "../../styles/customer/Wishlist.css";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { favorites, loading, fetchFavorites } = useFavoriteStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      fetchFavorites(user.id);
    }
  }, [user?.id, fetchFavorites]);

  return (
    <div className="min-vh-100 py-4">
      <Container>
        <h2 className="wishlist-title">Sản phẩm yêu thích</h2>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#e91e63" }} />
          </div>
        ) : favorites.length === 0 ? (
          <div className="wishlist-empty-state">
            <div className="wishlist-empty-icon">
              <Heart size={40} color="white" fill="white" />
            </div>
            <h4 className="fw-semibold mb-3">Bạn chưa có sản phẩm yêu thích nào!</h4>
            <p className="text-muted mb-4">
              Hãy dạo một vòng và thả tim cho những bé gấu mà bạn yêu thích nhé.
            </p>
            <Button
              variant="light"
              onClick={() => navigate("/products")}
              style={{
                background: "linear-gradient(135deg, #ff69b4, #ff8fab)",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: "30px",
                fontWeight: "600",
              }}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {favorites.map((favorite) => (
              favorite.product ? (
                <Col key={favorite.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={favorite.product} />
                </Col>
              ) : (
                <Col key={favorite.id} xs={12}>
                  <div className="alert alert-warning">
                    Sản phẩm này không còn tồn tại hoặc đã bị xóa.
                    (ID: {favorite.productId})
                  </div>
                </Col>
              )
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default WishlistPage;
