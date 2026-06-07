import { calculateTotalPrice } from "../../utils/calculate";
import { createCartItem } from "./cart.service";

export const addCartItemLogic = async ({ product, selection, user }) => {
    try {
        if (!user || !user.id) {
            return { success: false, message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng" };
        }

        // kiem tra xem trong kho con san pham hay khong
        if (product.stock < selection.quantity) {
            return { success: false, message: "Số lượng sản phẩm trong kho không đủ" };
        }

        if (!selection?.size || !selection?.color) {
            return { success: false, message: "Vui lòng chọn kích thước và màu sắc" };
        }

        // Tính tổng tiền dựa trên giá sản phẩm và số lượng
        const totalPrice = calculateTotalPrice(product.price, selection.quantity);

        const newCartItem = {
            userId: user.id,
            productId: product.id,
            sizeId: selection.size,
            colorId: selection.color,
            quantity: selection.quantity,
            totalPrice: totalPrice
        };

        const result = await createCartItem(newCartItem);

        if (result instanceof Error) {
            return { success: false, message: "Đã xảy ra lỗi khi thêm vào giỏ hàng" };
        }

        return {
            success: true,
            message: "Đã thêm sản phẩm vào giỏ hàng thành công",
            data: result
        };

    } catch (error) {
        return {
            success: false,
            message: error.message || "Đã xảy ra lỗi",
            error
        };
    }
}