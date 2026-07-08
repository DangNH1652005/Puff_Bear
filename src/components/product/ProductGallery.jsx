import { useState } from "react";
import { Card, Row, Col, Image, Badge } from "react-bootstrap";
import { Heart } from "lucide-react";
import { useProductDetailStore } from "../../store/product.store";
import { useAuthStore } from "../../store/auth.store";
import { useFavoriteStore } from "../../store/favorite.store";

const ProductGallery = () => {
  const { product, loading, error } = useProductDetailStore();
  const [selectedImage, setSelectedImage] = useState(0);

  const user = useAuthStore((state) => state.user);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => product ? state.isFavorite(product.id) : false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (product) toggleFavorite(user?.id, product.id);
  };

  if (loading) {
    return (
      <Card
        className="border-0 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
        style={{ height: "480px", backgroundColor: "#f8f9fa" }}
      >
        <div className="spinner-border text-danger" role="status"></div>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <Card
        className="border-0 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
        style={{ height: "480px", backgroundColor: "#f8f9fa" }}
      >
        <span className="text-muted">Không tải được hình ảnh</span>
      </Card>
    );
  }

  const { imageUrl = [], mainImageUrl, name } = product;

  const displayImages = [mainImageUrl, ...imageUrl].filter(Boolean);

  return (
    <>
      <Card className="border-0 shadow-sm overflow-hidden">
        <div
          className="position-relative"
          style={{ height: "480px", backgroundColor: "#f8f9fa" }}
        >
          {displayImages.length > 0 ? (
            <Image
              src={displayImages[selectedImage] ?? displayImages[0]}
              fluid
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
              alt={name}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
              Không có ảnh
            </div>
          )}

          {/* Favorite button */}
          <button
            className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2 shadow-sm"
            onClick={handleFavoriteClick}
            title="Yêu thích"
          >
            <Heart
              size={20}
              fill={isFavorite ? "#e91e63" : "none"}
              color={isFavorite ? "#e91e63" : "#666"}
            />
          </button>
        </div>
      </Card>

      {/* Thumbnail strip */}
      {displayImages.length > 1 && (
        <Row className="g-2 mt-2">
          {displayImages.map((img, index) => (
            <Col xs={3} key={index}>
              <div
                onClick={() => setSelectedImage(index)}
                style={{
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    selectedImage === index
                      ? "2px solid #e91e63"
                      : "1px solid #ddd",
                  transition: "border-color 0.2s",
                }}
              >
                <Image
                  src={img}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  alt={`Ảnh ${index + 1}`}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ProductGallery;
