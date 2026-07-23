import { useEffect, useState } from "react";
import { getOrdersByUserId, getOrderItemsByOrderId, updateOrder } from "../../services/order/order.service";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";
import { getProductById } from "../../services/product/product.service";
import OrderCard from "../../components/order/OrderCard";
import { getSizeById } from "../../services/size/size.service";
import { getColorById } from "../../services/color/color.service";
import { Search } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const getStatusCount = (status) => {
    if (status === "ALL") return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item) =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const TABS = [
    { label: "Tất cả", value: "ALL" },
    { label: "Đang xử lý", value: ORDER_STATUS.PENDING },
    { label: "Đang giao", value: ORDER_STATUS.SHIPPING },
    { label: "Đã giao", value: ORDER_STATUS.DELIVERED },
    { label: "Đã hủy", value: ORDER_STATUS.CANCELLED },
  ];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h5>Đang tải đơn hàng...</h5>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4 d-flex flex-wrap align-items-center gap-3 bg-white p-3 rounded-pill shadow-sm" style={{ border: "1px solid #ffe9e6" }}>
        <div className="position-relative flex-grow-1" style={{ maxWidth: "350px" }}>
          <Search size={18} className="position-absolute text-muted" style={{ top: "50%", left: "16px", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            className="form-control rounded-pill border-0 ps-5" 
            style={{ backgroundColor: "#f8f9fa", fontSize: "0.95rem" }}
            placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="d-flex flex-wrap gap-2 ms-auto">
          {TABS.map((tab) => {
            const count = getStatusCount(tab.value);
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-semibold border`}
                style={{
                  backgroundColor: isActive ? "#ffb6c1" : "#fff",
                  borderColor: isActive ? "#ffb6c1" : "#eaeaea",
                  color: isActive ? "#fff" : "#6c757d",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setStatusFilter(tab.value)}
              >
                {tab.label}
                {tab.value !== "ALL" && (
                  <span
                    className="badge rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "20px", height: "20px",
                      backgroundColor: isActive ? "#fff" : "#f8f9fa",
                      color: isActive ? "#ffb6c1" : "#6c757d",
                      fontSize: "0.75rem", padding: 0
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Không tìm thấy đơn hàng nào phù hợp 🛒</h4>
        </div>
      ) : (
        filteredOrders.map((order) => (
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