import {
  getAllOrders,
  getOrderItemsByOrderId,
  getUserById,
  getProductById,
} from "./order.service";

const normalizeStatus = (status) => {
  const statusMap = {
    pending: "PENDING",
    confirmed: "PENDING",
    shipping: "SHIPPING",
    delivered: "DELIVERED",
    cancelled: "CANCELLED",
  };
  return statusMap[status?.toLowerCase()] || status?.toUpperCase() || "PENDING";
};

export const getOrdersForStaff =
  async () => {
    const orders =
      await getAllOrders();

    const result =
      await Promise.all(
        orders.map(async (order) => {
          const user =
            await getUserById(
              order.userId
            );

          const items =
            await getOrderItemsByOrderId(
              order.id
            );

          const detailItems =
            await Promise.all(
              items.map(async (item) => {
                const product =
                  await getProductById(
                    item.productId
                  );

                return {
                  ...item,
                  product,
                };
              })
            );

          return {
            ...order,
            status: normalizeStatus(order.status),
            customer: user,
            items: detailItems,
          };
        })
      );

    return result;
  };