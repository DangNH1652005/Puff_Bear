import { calculateTotalPrice } from "../../utils/calculate";
import { createCheckout } from "./checkout.service";


export const createCheckoutLogic = async ({ product, selection, user }) => {
  try {
    const totalPrice = calculateTotalPrice(product.price, selection.quantity);

    const payload = {
      proId: product.id,
      userId: user.id,
      totalPrice: totalPrice,
      uniquePrice: product.price,
      quantity: selection.quantity,
      size: selection.size,
      color: selection.color,
    }

    const response = await createCheckout(payload);
    return response;

  } catch (error) {
    const backendMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
    return {
      success: false,
      errorType: "API_ERROR",
      message: backendMessage,
    };
  }
};
