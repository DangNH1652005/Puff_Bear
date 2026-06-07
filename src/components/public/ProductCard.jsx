import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div>
      <Card className="product-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
        {/* Image */}
        <div className="position-relative product-image-wrapper">
          <Link to="/product/1">
            <Card.Img
              variant="top"
              src={product.image}
              className="product-image"
            />
          </Link>

          {/* Discount */}
          <Badge
            className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill border-0"
            style={{
              background: "linear-gradient(135deg, #ff5c93, #ff8fb1)",
              color: "white",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(255, 92, 147, 0.35)",
            }}
          >
            -25%
          </Badge>
          {/* Favorite */}
          <Button
            variant="light"
            onClick={() => setIsFavorite(!isFavorite)}
            className="favorite-btn position-absolute top-0 end-0 m-3 rounded-circle border-0 shadow-sm d-flex align-items-center justify-content-center"
          >
            <Heart
              size={18}
              className={isFavorite ? "text-danger fill-danger" : "text-dark"}
            />
          </Button>
        </div>

        {/* Content */}
        <Card.Body className="p-4">
          {/* Title */}
          <Card.Title className="product-title fw-semibold mb-3">
            {product.name}
          </Card.Title>

          {/* Rating */}
          <div className="d-flex align-items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={13}
                className={i < 4 ? "text-warning" : "text-secondary"}
              />
            ))}

            <span className="rating-text ms-1">{product.rating}</span>
          </div>

          {/* Bottom */}
          <div className="d-flex justify-content-between align-items-end">
            {/* Price */}
            <div>
              <div className="price-text fw-semibold">{product.price.toLocaleString()}đ</div>

              <div className="old-price text-decoration-line-through">
                399.000đ
              </div>
            </div>

            {/* Cart */}
            <Button className="cart-btn rounded-circle border-0 d-flex align-items-center justify-content-center">
              <ShoppingCart size={20} />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductCard;