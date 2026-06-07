import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Star } from "lucide-react";
import { getCategoryById } from "../../services/category/category.service";
import { getCollectionById } from "../../services/collection/collection.service";
import { useProductDetailStore } from "../../store/useProductDetailStore";

const ProductInfo = () => {
  const { product } = useProductDetailStore();
  const [category, setCategory] = useState(null);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    if (!product) return;
    const fetchMeta = async () => {
      const [cat, col] = await Promise.all([
        getCategoryById(product.categoryId),
        getCollectionById(product.collectionId),
      ]);
      setCategory(cat);
      setCollection(col);
    };
    fetchMeta();
  }, [product]);

  if (!product) return null;

  return (
    <>
      {/* Category & Collection badges */}
      <div className="mb-2 d-flex flex-wrap gap-2">
        {category && (
          <Badge bg="secondary" className="px-2 py-1">
            {category.name}
          </Badge>
        )}
        {collection && (
          <Badge bg="info" className="px-2 py-1">
            {collection.name}
          </Badge>
        )}
      </div>

      {/* Name */}
      <h2 className="fw-bold mb-2">{product.name}</h2>

      {/* Rating */}
      <div className="d-flex align-items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < Math.round(product.rating ?? 0) ? "#ffc107" : "none"}
            color="#ffc107"
          />
        ))}
        <span className="ms-2 text-muted small">
          {product.rating ?? "—"} ({product.reviews ?? 0} đánh giá)
        </span>
      </div>

      {/* Price */}
      <div className="mb-4">
        <h3 className="text-danger fw-bold d-inline me-3">
          ₫{product.price.toLocaleString("vi-VN")}
        </h3>
        {product.originalPrice && (
          <span className="text-decoration-line-through text-muted">
            ₫{product.originalPrice.toLocaleString("vi-VN")}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-muted mb-4">{product.description}</p>
    </>
  );
};

export default ProductInfo;
