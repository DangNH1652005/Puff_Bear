import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useAuthStore } from "../../store/auth.store";
import { useFavoriteStore } from "../../store/favorite.store";

const ProductCard = ({ product }) => {
  const user = useAuthStore((state) => state.user);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite(product.id));

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    toggleFavorite(user?.id, product.id);
  };

  return (
    <div>
      <Card className="product-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
        {/* Image */}
        <div className="position-relative product-image-wrapper">
          <Link to={`/product/${product.id}`}>
            <Card.Img
              variant="top"
              src={product.mainImageUrl}
              className="product-image"
            />
          </Link>

          {/* Favorite */}
          <button
            className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2 shadow-sm favorite-btn d-flex align-items-center justify-content-center"
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

        {/* Content */}
        <Card.Body className="p-4">
          {/* Title */}
          <Card.Title className="product-title fw-semibold mb-3">
            {product.name}
          </Card.Title>

          {/* Bottom */}
          <div className="d-flex justify-content-between align-items-end">
            {/* Price */}

            <div className="price-text fw-semibold">
              {product.price.toLocaleString()}đ
            </div>

            {/* Cart */}
            <Link
              to={`/product/${product.id}`}
              className="cart-btn rounded-circle border-0 d-flex align-items-center justify-content-center btn btn-primary"
              title="Chọn biến thể và thêm vào giỏ hàng"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingCart size={20} />
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductCard;
