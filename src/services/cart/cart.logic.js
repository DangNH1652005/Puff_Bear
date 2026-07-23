import { calculateTotalPrice } from "../../utils/calculate";
import { createCartItem } from "./cart.service";
import { getSizeById } from "../size/size.service";
import { getSizeSurcharge } from "../../utils/sizeSurcharge";

export const addCartItemLogic = async ({ product, selection, user }) => {
  try {
    if (!user || !user.id) {
      return {
        success: false,
        message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      };
    }

    // kiem tra xem trong kho con san pham hay khong
    if (product.stock < selection.quantity) {
      return {
        success: false,
        message: "Số lượng sản phẩm trong kho không đủ",
      };
    }

    if (!selection?.size || !selection?.color) {
      return { success: false, message: "Vui lòng chọn kích thước và màu sắc" };
    }

    // Tính phụ thu theo size (nếu có) rồi tính tổng tiền
    let surcharge = 0;
    try {
      const size = await getSizeById(selection.size);
      surcharge = getSizeSurcharge(size?.name);
    } catch (err) {
      console.error("Failed to load size for surcharge:", err);
    }

    const unitPrice = Number(product.price || 0) + surcharge;
    const totalPrice = calculateTotalPrice(unitPrice, selection.quantity);

    const newCartItem = {
      userId: user.id,
      productId: product.id,
      sizeId: selection.size,
      colorId: selection.color,
      quantity: selection.quantity,
      totalPrice: totalPrice,
    };

    const result = await createCartItem(newCartItem);

    if (result instanceof Error) {
      return { success: false, message: "Đã xảy ra lỗi khi thêm vào giỏ hàng" };
    }

    return {
      success: true,
      message: "Đã thêm sản phẩm vào giỏ hàng thành công",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Đã xảy ra lỗi",
      error,
    };
  }
};
