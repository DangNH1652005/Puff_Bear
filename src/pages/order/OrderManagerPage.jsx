import {
  useEffect,
  useState,
} from "react";

import StaffOrderTable from "../../components/order/StaffOrderTable";
import OrderDetailDrawer from "../../components/order/OrderDetailDrawer";

import {
  getFullOrders,
} from "../../services/order/order.logic";

import {
  updateOrder,
} from "../../services/order/order.service";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";

function OrderManagementPage() {
  const [orders, setOrders] =
    useState([]);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [showDrawer, setShowDrawer] =
    useState(false);

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data =
      await getFullOrders();

    setOrders(data);
  };

  const handleSave =
    async (
      status,
      cancelReason
    ) => {
      await updateOrder(
        selectedOrder.id,
        {
          status,
          reason: status === ORDER_STATUS.CANCELLED ? cancelReason || null : null,
        }
      );

      await loadOrders();

      setShowDrawer(false);
    };

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter(
          (o) =>
            o.status ===
            statusFilter
        );

  return (
    <div className="container-fluid p-4">

      <h2>
        Quản lý đơn hàng
      </h2>

      <div className="d-flex gap-2 my-4">
        <button
          onClick={() =>
            setStatusFilter("ALL")
          }
        >
          Tất cả
        </button>

        <button
          onClick={() =>
            setStatusFilter(
              "PENDING"
            )
          }
        >
          Đang xử lý
        </button>

        <button
          onClick={() =>
            setStatusFilter(
              "SHIPPING"
            )
          }
        >
          Đang giao
        </button>

        <button
          onClick={() =>
            setStatusFilter(
              "DELIVERED"
            )
          }
        >
          Đã giao
        </button>

        <button
          onClick={() =>
            setStatusFilter(
              "CANCELLED"
            )
          }
        >
          Đã hủy
        </button>
      </div>

      <StaffOrderTable
        orders={filteredOrders}
        onView={(order) => {
          setSelectedOrder(
            order
          );

          setShowDrawer(true);
        }}
      />

      <OrderDetailDrawer
        show={showDrawer}
        onHide={() =>
          setShowDrawer(false)
        }
        order={selectedOrder}
        onSave={handleSave}
      />

    </div>
  );
}

export default OrderManagementPage;