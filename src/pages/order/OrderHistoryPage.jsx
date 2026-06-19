import { useEffect, useState } from "react";
import { getOrdersByUserId, getOrderItemsByOrderId } from "../../services/order/order.service";
import { getProductById } from "../../services/product/product.service";
import OrderCard from "../../components/order/OrderCard";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orderList = await getOrdersByUserId(user.id);

      const ordersWithItems = await Promise.all(
        orderList.map(async (order) => {
          const orderItems = await getOrderItemsByOrderId(order.id);

          const itemsWithProduct = await Promise.all(
            orderItems.map(async (item) => {
              const product = await getProductById(item.productId);

              return {
                ...item,
                product,
              };
            })
          );

          return {
            ...order,
            items: itemsWithProduct,
          };
        })
      );

      setOrders(
        ordersWithItems.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h5>Đang tải đơn hàng...</h5>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="mb-4">
        <h1 className="fw-bold">
          Lịch sử đơn hàng
        </h1>

        <p className="text-muted">
          Theo dõi tất cả đơn hàng của bạn
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
          />
        ))
      )}
    </div>
  );
}

export default OrderHistoryPage;