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
          <Link to={`/product/${product.id}`}>
            <Card.Img
              variant="top"
              src={product.mainImageUrl}
              className="product-image"
            />
          </Link>
          
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

          {/* Bottom */}
          <div className="d-flex justify-content-between align-items-end">
            {/* Price */}

            <div className="price-text fw-semibold">
              {product.price.toLocaleString()}đ
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
