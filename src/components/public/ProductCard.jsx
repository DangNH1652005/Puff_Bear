import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Package, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useFavoriteStore } from "../../store/favorite.store";
import { getCategoryById } from "../../services/category/category.service";

const ProductCard = ({ product }) => {
  const user = useAuthStore((state) => state.user);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite(product.id));
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (product?.categoryId) {
      getCategoryById(product.categoryId)
        .then((cat) => setCategoryName(cat?.type || ""))
        .catch(() => setCategoryName(""));
    }
  }, [product?.categoryId]);

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
            className="position-absolute top-0 end-0 m-2 m-md-3 btn btn-light rounded-circle p-2 shadow-sm favorite-btn d-flex align-items-center justify-content-center"
            onClick={handleFavoriteClick}
            title="Yêu thích"
            style={{ width: "32px", height: "32px" }}
          >
            <Heart
              size={16}
              fill={isFavorite ? "#e91e63" : "none"}
              color={isFavorite ? "#e91e63" : "#666"}
            />
          </button>
        </div>

        {/* Content */}
        <Card.Body className="p-2 p-md-3 p-lg-4 d-flex flex-column">
          {/* Category */}
          {categoryName && (
            <span
              className="text-uppercase fw-semibold d-block mb-1"
              style={{ fontSize: "11px", color: "#ff8fb1", letterSpacing: "0.5px" }}
            >
              {categoryName}
            </span>
          )}

          {/* Title */}
          <Card.Title className="product-title fw-semibold mb-1 mb-md-2" style={{ fontSize: "0.95rem" }}>
            {product.name}
          </Card.Title>

          {/* Stock & Sold */}
          <div
            className="d-flex flex-wrap justify-content-between align-items-center mb-2 mb-md-3 text-muted gap-1 gap-md-0"
            style={{ fontSize: "12px" }}
          >
            <div className="d-flex align-items-center gap-1">
              <Package size={14} className="text-secondary" />
              <span>
                Kho:{" "}
                <strong className={product.stock <= 0 ? "text-danger" : "text-dark"}>
                  {product.stock <= 0 ? "Hết hàng" : product.stock}
                </strong>
              </span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <ShoppingBag size={14} className="text-secondary" />
              <span>
                Đã bán: <strong className="text-dark">{product.sold || 0}</strong>
              </span>
            </div>
          </div>

          {/* Bottom */}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
            {/* Price */}
            <div className="price-text fw-semibold" style={{ fontSize: "0.95rem" }}>
              {product.price.toLocaleString()}đ
            </div>

            {/* Cart */}
            <Link
              to={`/product/${product.id}`}
              className="cart-btn rounded-circle border-0 d-flex align-items-center justify-content-center btn btn-primary flex-shrink-0"
              title="Chọn biến thể và thêm vào giỏ hàng"
              onClick={(e) => e.stopPropagation()}
              style={{ width: "32px", height: "32px" }}
            >
              <ShoppingCart size={16} />
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductCard;
