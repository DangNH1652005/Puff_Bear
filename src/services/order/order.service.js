import instance from "../../libs/axios";

// Tạo một order mới
export const createOrder = async (data) => {
  const res = await instance.post("/orders", data);
  return res.data;
};

// Tạo một order item gắn với order vừa tạo
export const createOrderItem = async (data) => {
  const res = await instance.post("/orderItems", data);
  return res.data;
};

// Cập nhật stock của product sau khi đặt hàng
export const updateProductStock = async (productId, newStock) => {
  const res = await instance.patch(`/products/${productId}`, { stock: newStock });
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await instance.get(`/orders/${orderId}`);
  return res.data;
};

export const getOrderItemsByOrderId = async (orderId) => {
  const res = await instance.get(`/orderItems?orderId=${orderId}`);
  return res.data; 
};

export const getOrdersByUserId = async (userId) => {
  const res = await instance.get(`/orders?userId=${userId}`);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await instance.get("/orders");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await instance.get(`/products/${id}`);
  return res.data;
};

export const getAllOrderItems = async () => {
  const res = await instance.get(`/orderItems`);
  return res.data;
}
