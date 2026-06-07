import { Row, Col, Button } from "react-bootstrap";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { createCheckoutLogic } from "../../services/checkout/checkout.logic";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useProductDetailStore } from "../../store/useProductDetailStore";

const ProductActions = () => {
  const { product, selection } = useProductDetailStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!product) return null;

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

  const handleBuyNow = async () => {
    if (!selection?.size || !selection?.color) {
      toast.error("Vui lòng chọn kích thước và màu sắc!");
      return;
    }

    if (!user) {
      navigate("/auth/login");
      return;
    }
    const loadingToast = toast.loading("Đang khởi tạo đơn hàng...");

    const res = await createCheckoutLogic({ product, selection, user });

    if(res) {
      navigate(`/checkout/${res.id}`)
    }
    toast.dismiss(loadingToast);
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
