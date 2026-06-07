import { ORDER_STATUS } from "../../constants/orderStatus";
import { deleteCartItemById, getCartItemsByUserId } from "../cart/cart.service";
import { getProductById } from "../product/product.service";
import {
  createOrder,
  createOrderItem,
  updateProductStock,
} from "./order.service";

export const placeOrder = async (
  user,
  orderForm,
  totalPriceCart,
  cartItems,
) => {
  // 1. Validate form input
  if (!orderForm.receiverName || !orderForm.phone || !orderForm.address) {
    throw new Error("Vui lòng điền đầy đủ thông tin giao hàng.");
  }

  const orderPayload = {
    userId: user.id || null,
    receiverName: orderForm.receiverName,
    phone: orderForm.phone,
    address: orderForm.address,
    city: orderForm.city,
    zipCode: orderForm.zipCode,
    totalPriceCart: totalPriceCart,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
  };

  // 5. Tạo Order
  const createdOrder = await createOrder(orderPayload);

  for (const item of cartItems) {
    const orderItemPayload = {
      orderId: createdOrder.id,
      productId: item.productId,
      sizeId: item.sizeId,
      colorId: item.colorId,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    };

    await createOrderItem(orderItemPayload);

    const product = await getProductById(item.productId);

    if (product.stock < item.quantity) {
      throw new Error(
        `${product.name} chỉ còn ${product.stock} sản phẩm trong kho`,
      );
    }
    await updateProductStock(item.productId, product.stock - item.quantity);
  }

  await clearCartByUserId(user.id);
  return createdOrder;
};

export const clearCartByUserId = async (userId) => {
  try {
    const cartItems = await getCartItemsByUserId(userId);

    await Promise.all(
      cartItems.map(item =>
        deleteCartItemById(item.id)
      )
    );

    return true;
  } catch (error) {
    return error;
  }
};
