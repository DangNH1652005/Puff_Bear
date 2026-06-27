import { ORDER_STATUS } from "../../constants/orderStatus";
import { deleteCartItemById, getCartItemsByUserId } from "../cart/cart.service";
import { getProductById } from "../product/product.service";
import {
  createOrder,
  createOrderItem,
  updateProductStock,
} from "./order.service";

const createOrderItemFromCart = async (orderId, item) => {
  const product = await getProductById(item.productId);

  if (product.stock < item.quantity) {
    throw new Error(
      `${product.name} chỉ còn ${product.stock} sản phẩm trong kho`,
    );
  }

  const orderItemPayload = {
    orderId,
    productId: item.productId,
    sizeId: item.sizeId,
    colorId: item.colorId,
    quantity: item.quantity,
    totalPrice: item.totalPrice,
  };

  await createOrderItem(orderItemPayload);
  await updateProductStock(item.productId, product.stock - item.quantity);
};

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
    email: orderForm.email,
    totalPriceCart: totalPriceCart,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    reason: null,
  };

  // 5. Tạo Order
  const createdOrder = await createOrder(orderPayload);

  for (const item of cartItems) {
    await createOrderItemFromCart(createdOrder.id, item);
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


