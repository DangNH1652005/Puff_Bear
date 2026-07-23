import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Minus, Plus } from "lucide-react";

import { getAllSizes } from "../../services/size/size.service";
import { getAllColors } from "../../services/color/color.service";
import { useProductDetailStore } from "../../store/product.store";

const ProductOptions = () => {
  const { product, selection, setSelection } = useProductDetailStore();

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // Lấy danh sách size và color của sản phẩm
  useEffect(() => {
    if (!product) return;

    const fetchOptions = async () => {
      try {
        const [allSizes, allColors] = await Promise.all([
          getAllSizes(),
          getAllColors(),
        ]);

        setSizes(
          allSizes.filter((size) => product.sizeId?.includes(size.id))
        );

        setColors(
          allColors.filter((color) => product.colorId?.includes(color.id))
        );
      } catch (err) {
        console.error("Load product options failed:", err);
      }
    };

    fetchOptions();
  }, [product]);

  // Chọn mặc định
  useEffect(() => {
    if (!sizes.length && !colors.length) return;

    setSelection({
      size: selection.size ?? sizes[0]?.id ?? null,
      color: selection.color ?? colors[0]?.id ?? null,
      quantity: selection.quantity ?? 1,
    });
  }, [sizes, colors]);

  if (!product) return null;

  const { size: selectedSize, color: selectedColor, quantity } = selection;

  return (
    <>
      {/* Size */}
      {sizes.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">
            Kích thước:{" "}
            <span className="text-danger">
              {sizes.find((s) => s.id === selectedSize)?.name}
            </span>
          </h6>

          <div className="d-flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size.id}
                variant={
                  selectedSize === size.id
                    ? "danger"
                    : "outline-secondary"
                }
                onClick={() => setSelection({ size: size.id })}
              >
                {size.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">
            Màu sắc:{" "}
            <span className="text-danger">
              {colors.find((c) => c.id === selectedColor)?.name}
            </span>
          </h6>

          <div className="d-flex flex-wrap gap-2">
            {colors.map((color) => (
              <Button
                key={color.id}
                variant={
                  selectedColor === color.id
                    ? "danger"
                    : "outline-secondary"
                }
                onClick={() => setSelection({ color: color.id })}
              >
                {color.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-2">Số lượng</h6>

        <div className="d-flex align-items-center">
          <Button
            variant="outline-secondary"
            onClick={() =>
              setSelection({
                quantity: Math.max(1, quantity - 1),
              })
            }
          >
            <Minus size={16} />
          </Button>

          <div
            className="px-4 fw-bold text-center"
            style={{ minWidth: 48 }}
          >
            {quantity}
          </div>

          <Button
            variant="outline-secondary"
            onClick={() =>
              setSelection({
                quantity: quantity + 1,
              })
            }
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductOptions;