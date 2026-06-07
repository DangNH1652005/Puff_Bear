import { ORDER_STATUS } from "../../constants/orderStatus";
import { getProductById } from "../product/product.service";
import { createOrder, createOrderItem, updateProductStock } from "./order.service";

export const placeOrder = async (orderForm, product, selection) => {
  // 1. Validate form input
  if (!orderForm.receiverName || !orderForm.phone || !orderForm.address) {
    throw new Error("Vui lòng điền đầy đủ thông tin giao hàng.");
  }

  // 2. Lấy product mới nhất từ DB để check tồn kho chính xác
  const freshProduct = await getProductById(product.id);
  if (!freshProduct) {
    throw new Error("Sản phẩm không tồn tại.");
  }

  // 3. Kiểm tra tồn kho
  if (freshProduct.stock < selection.quantity) {
    throw new Error("Sản phẩm đã hết hàng hoặc không đủ số lượng.");
  }

  // 4. Tạo data tạm, tính totalAmount
  const totalAmount = freshProduct.price * selection.quantity;

  const orderPayload = {
    userId: orderForm.userId || null,
    receiverName: orderForm.receiverName,
    phone: orderForm.phone,
    address: orderForm.address,
    totalAmount,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
  };

  // 5. Tạo Order
  const createdOrder = await createOrder(orderPayload);

  // 6. Tạo OrderItem
  const orderItemPayload = {
    orderId: createdOrder.id,
    productId: freshProduct.id,
    productName: freshProduct.name,
    productPrice: freshProduct.price,
    sizeId: selection.size,
    colorId: selection.color,
    quantity: selection.quantity,
  };
  
  const createdOrderItem = await createOrderItem(orderItemPayload);

  // 7. Trừ tồn kho
  const newStock = freshProduct.stock - selection.quantity;
  await updateProductStock(freshProduct.id, newStock);

  // 8. Return kết quả
  return { order: createdOrder, orderItem: createdOrderItem };
};
