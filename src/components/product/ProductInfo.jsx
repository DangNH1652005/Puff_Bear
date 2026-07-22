import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Star, Package, ShoppingBag } from "lucide-react";
import { getCategoryById } from "../../services/category/category.service";
import { useProductDetailStore } from "../../store/product.store";

const ProductInfo = () => {
  const { product } = useProductDetailStore();
  const [category, setCategory] = useState(null);
  // console.log(product);

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

  const isOutOfStock = product.stock <= 0;

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

      {/* Stock and Sold info */}
      <div className="d-flex align-items-center gap-4 mb-4 text-muted" style={{ fontSize: "14px" }}>
        <div className="d-flex align-items-center gap-2">
          <span className="bg-light p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
            <Package size={18} className="text-secondary" />
          </span>
          <div>
            <div className="text-uppercase font-monospace" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Trong kho</div>
            <strong className={isOutOfStock ? "text-danger" : "text-dark"}>
              {isOutOfStock ? "Hết hàng" : `${product.stock} sản phẩm`}
            </strong>
          </div>
        </div>

        <div className="vr" style={{ height: "30px", opacity: 0.2 }}></div>

        <div className="d-flex align-items-center gap-2">
          <span className="bg-light p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
            <ShoppingBag size={18} className="text-secondary" />
          </span>
          <div>
            <div className="text-uppercase font-monospace" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>Đã bán</div>
            <strong className="text-dark">{product.sold || 0} sản phẩm</strong>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted mb-4">{product.description}</p>
    </>
  );
};

export default ProductInfo;
