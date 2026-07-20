import { Button } from "react-bootstrap";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import { useProductDetailStore } from "../../store/product.store";
import { addCartItemLogic } from "../../services/cart/cart.logic";
import { useCartStore } from "../../store/cart.store";

const ProductActions = () => {
  const { product, selection } = useProductDetailStore();
  const { user } = useAuthStore();
  const { fetchCart } = useCartStore();

  if (!product) {
    return null;
  }

  const handleAddToCart = async () => {
    if (!selection?.size || !selection?.color) {
      toast.error("Vui lòng chọn kích thước và màu sắc!");
      return;
    }

    const result = await addCartItemLogic({ product, selection, user });

    if (result && result.success) {
      toast.success(result.message || `Đã thêm "${product?.name}" vào giỏ!`);
      await fetchCart(user.id);
    } else {
      toast.error(result?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  return (
    <Button
      variant="danger"
      className="w-100 mb-4"
      onClick={handleAddToCart}
    >
      <ShoppingCart size={18} className="me-2" />
      Thêm vào giỏ
    </Button>
  );
};

export default ProductActions;
