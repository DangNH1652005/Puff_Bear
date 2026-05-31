import { useState } from "react";
import { Card, Row, Col, Image, Badge } from "react-bootstrap";
import { Heart } from "lucide-react";

const ProductGallery = ({
  images = [],
  name,
  isBestSeller,
  isNew,
  discount,
  favorite,
  onFavoriteToggle,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <Card className="border-0 shadow-sm overflow-hidden">
        <div
          className="position-relative"
          style={{ height: "480px", backgroundColor: "#f8f9fa" }}
        >
          <Image
            src={images[selectedImage] ?? images[0]}
            fluid
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            alt={name}
          />

          {/* Badges overlay */}
          <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2">
            {isBestSeller && (
              <Badge bg="danger" className="px-2 py-1">
                Best Seller
              </Badge>
            )}
            {isNew && (
              <Badge bg="success" className="px-2 py-1">
                Mới
              </Badge>
            )}
            {discount && (
              <Badge bg="warning" text="dark" className="px-2 py-1">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <button
            className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2 shadow-sm"
            onClick={onFavoriteToggle}
            title="Yêu thích"
          >
            <Heart
              size={20}
              fill={favorite ? "#e91e63" : "none"}
              color={favorite ? "#e91e63" : "#666"}
            />
          </button>
        </div>
      </Card>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <Row className="g-2 mt-2">
          {images.map((img, index) => (
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
