import { useEffect, useState } from "react";
import { getOrdersByUserId, getOrderItemsByOrderId, updateOrder } from "../../services/order/order.service";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";
import { getProductById } from "../../services/product/product.service";
import OrderCard from "../../components/order/OrderCard";
import { getSizeById } from "../../services/size/size.service";
import { getColorById } from "../../services/color/color.service";

const fetchProductSafe = async (productId) => {
  try {
    return await getProductById(productId);
  } catch (err) {
    console.error("Lỗi lấy product:", productId, err);
    return null;
  }
};

const fetchSizeSafe = async (sizeId) => {
  try {
    return await getSizeById(sizeId);
  } catch (err) {
    console.error("Lỗi lấy size:", sizeId, err);
    return null;
  }
};

const fetchColorSafe = async (colorId) => {
  try {
    return await getColorById(colorId);
  } catch (err) {
    console.error("Lỗi lấy color:", colorId, err);
    return null;
  }
};

const enrichOrderItems = async (orderItems) => {
  return Promise.all(
    orderItems.map(async (item) => {
      const [product, size, color] = await Promise.all([
        fetchProductSafe(item.productId),
        fetchSizeSafe(item.sizeId),
        fetchColorSafe(item.colorId),
      ]);

      return { ...item, product, size, color };
    })
  );
};

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
          const itemsWithProduct = await enrichOrderItems(orderItems);

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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    try {
      await updateOrder(orderId, { status: ORDER_STATUS.CANCELLED, reason: "Khách hàng hủy" });
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Không thể hủy đơn hàng");
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
            onCancel={handleCancelOrder}
          />
        ))
      )}
    </div>
  );
}

export default OrderHistoryPage;