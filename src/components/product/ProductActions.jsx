import { Row, Col, Button } from "react-bootstrap";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

/**
 * ProductActions
 * - Nhận product + selection (size, color, quantity) từ parent
 * - Tự xử lý logic thêm giỏ / mua ngay (toast, gọi API sau)
 */
const ProductActions = ({ product, selection }) => {
  const handleAddToCart = () => {
    if (!selection?.size || !selection?.color) {
      toast.error("Vui lòng chọn kích thước và màu sắc!");
      return;
    }
    toast.success(
      `Đã thêm "${product?.name}" (${selection.size} - ${selection.color}) × ${selection.quantity} vào giỏ!`,
    );
    // TODO: gọi cart API tại đây
  };

  const handleBuyNow = () => {
    if (!selection?.size || !selection?.color) {
      toast.error("Vui lòng chọn kích thước và màu sắc!");
      return;
    }
    toast.success("Chuyển đến thanh toán...");
    // TODO: navigate to checkout
  };

  return (
    <Row className="g-2 mb-4">
      <Col xs={12} md={6}>
        <Button
          variant="outline-danger"
          className="w-100"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} className="me-2" />
          Thêm vào giỏ
        </Button>
      </Col>
      <Col xs={12} md={6}>
        <Button variant="danger" className="w-100" onClick={handleBuyNow}>
          Mua ngay
        </Button>
      </Col>
    </Row>
  );
};

export default ProductActions;
