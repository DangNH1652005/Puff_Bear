import instance from "../libs/axios"

export async function getOrders(params = {}) {
  const res = await instance.get("/orders", { params });
  return res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getOrderById(id) {
  const res = await instance.get(`/orders/${id}`);
  return res.data;
}

export async function updateOrderStatus(id, status) {
  const res = await instance.patch(`/orders/${id}`, { status });
  return res.data;
}

export async function deleteOrder(id) {
  await instance.delete(`/orders/${id}`);
}

export async function getOrderStats() {
  const orders = await getOrders();
  return {
    total:      orders.length,
    pending:    orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipping:   orders.filter((o) => o.status === "shipping").length,
    delivered:  orders.filter((o) => o.status === "delivered").length,
    cancelled:  orders.filter((o) => o.status === "cancelled").length,
    revenue:    orders
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + o.total, 0),
  };
}