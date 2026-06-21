import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Star } from "lucide-react";
import { getCategoryById } from "../../services/category/category.service";
import { useProductDetailStore } from "../../store/product.store";

const ProductInfo = () => {
  const { product } = useProductDetailStore();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!product) return;
    const fetchMeta = async () => {
      const [cat, col] = await Promise.all([
        getCategoryById(product.categoryId),
      ]);
      setCategory(cat);
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
            {category.type}
          </Badge>
        )}
      </div>

      {/* Name */}
      <h2 className="fw-bold mb-2">{product.name}</h2>

      {/* Price */}
      <div className="mb-4">
        <h3 className="text-danger fw-bold d-inline me-3">
          ₫{product.price.toLocaleString("vi-VN")}
        </h3>
      </div>

      {/* Description */}
      <p className="text-muted mb-4">{product.description}</p>
    </>
  );
};

export default ProductInfo;
