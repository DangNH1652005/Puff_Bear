import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Minus, Plus } from "lucide-react";
import { getAllSizes } from "../../services/size/size.service";
import { getAllColors } from "../../services/color/color.service";
import { getProductSizes } from "../../services/size/size.logic";

/**
 * ProductOptions
 * - Tự fetch sizes & colors từ API
 * - Quản lý selectedSize, selectedColor, quantity nội bộ
 * - Emit selection lên parent qua onSelectionChange({ size, color, quantity })
 */
const ProductOptions = ({ product, onSelectionChange }) => {
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch sizes & colors khi product thay đổi
  useEffect(() => {
    if (!product) return;
    const fetchOptions = async () => {
      const [allSizes, allColors] = await Promise.all([
        getAllSizes(),
        getAllColors(),
      ]);

      const filteredSizes = getProductSizes(product, allSizes);
      const filteredColors = allColors.filter((c) =>
        product.colorIds?.includes(c.id),
      );

      setSizes(filteredSizes);
      setColors(filteredColors);

      const defaultSize = filteredSizes[0]?.id ?? null;
      const defaultColor = filteredColors[0]?.id ?? null;
      setSelectedSize(defaultSize);
      setSelectedColor(defaultColor);

      // Emit defaults lên parent
      onSelectionChange?.({ size: defaultSize, color: defaultColor, quantity: 1 });
    };
    fetchOptions();
  }, [product]);

  // Emit mỗi khi selection thay đổi
  const handleSizeChange = (sizeId) => {
    setSelectedSize(sizeId);
    onSelectionChange?.({ size: sizeId, color: selectedColor, quantity });
  };

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId);
    onSelectionChange?.({ size: selectedSize, color: colorId, quantity });
  };

  const handleQuantityChange = (updater) => {
    setQuantity((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      onSelectionChange?.({ size: selectedSize, color: selectedColor, quantity: next });
      return next;
    });
  };

  return (
    <>
      {/* Size selector */}
      {sizes.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">
            Kích thước: <span className="text-danger">{selectedSize}</span>
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size.id}
                variant={
                  selectedSize === size.id ? "danger" : "outline-secondary"
                }
                className="px-3"
                onClick={() => handleSizeChange(size.id)}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">
            Màu sắc:{" "}
            <span className="text-danger">
              {colors.find((c) => c.id === selectedColor)?.name ?? "—"}
            </span>
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {colors.map((color) => (
              <Button
                key={color.id}
                variant={
                  selectedColor === color.id ? "danger" : "outline-secondary"
                }
                className="px-3"
                onClick={() => handleColorChange(color.id)}
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
              handleQuantityChange((prev) => (prev > 1 ? prev - 1 : 1))
            }
          >
            <Minus size={16} />
          </Button>
          <div
            className="px-4 fw-bold text-center"
            style={{ minWidth: "48px" }}
          >
            {quantity}
          </div>
          <Button
            variant="outline-secondary"
            onClick={() => handleQuantityChange((prev) => prev + 1)}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductOptions;
