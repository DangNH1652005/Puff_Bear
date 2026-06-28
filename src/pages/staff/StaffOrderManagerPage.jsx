import { useState, useEffect } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import { Search } from "lucide-react";
import StaffOrderTable from "../../components/order/StaffOrderTable";
import OrderDetailDrawer from "../../components/order/OrderDetailDrawer";
import { getOrdersForStaff } from "../../services/order/order.logic";
import { updateOrderStatus } from "../../services/order/order.service";
import toast from "react-hot-toast";
import "../../styles/staff/StaffDashBoardPage.css";

function StaffOrderManagerPage() {
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter & Search whenever allOrders, searchTerm, or filterStatus changes
  useEffect(() => {
    let filtered = [...allOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((order) => {
        const matchesId = order.id.toLowerCase().includes(search);
        const matchesName = order.customer?.fullName?.toLowerCase().includes(search);
        const matchesEmail = order.customer?.email?.toLowerCase().includes(search);
        return matchesId || matchesName || matchesEmail;
      });
    }

    setOrders(filtered);
  }, [allOrders, searchTerm, filterStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrdersForStaff();
      setAllOrders(data);
    } catch (error) {
      console.error("Load orders error:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDrawer(true);
  };

  const handleSaveOrder = async (status, cancelReason) => {
    try {
      const updateData = { status };

      if (status === "CANCELLED" && cancelReason) {
        updateData.cancelReason = cancelReason;
      }

      await updateOrderStatus(selectedOrder.id, updateData);

      // Update local state
      setAllOrders(
        allOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status, cancelReason }
            : order
        )
      );

      toast.success("Cập nhật đơn hàng thành công");
      setShowDrawer(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Save order error:", error);
      toast.error("Không thể cập nhật đơn hàng");
    }
  };

  // Calculate statistics
  const stats = {
    total: allOrders.length,
    PENDING: allOrders.filter((o) => o.status === "PENDING").length,
    SHIPPING: allOrders.filter((o) => o.status === "SHIPPING").length,
    DELIVERED: allOrders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: allOrders.filter((o) => o.status === "CANCELLED").length,
  };



  if (loading) {
    return <div className="text-center py-5">Đang tải...</div>;
  }

  return (
    <div>
      {/* Header with Search */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý đơn hàng</h2>
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text className="bg-white border-end-0">
            <Search size={18} className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm mã đơn, tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-start-0"
          />
        </InputGroup>
      </div>

      {/* Statistics Cards */}
      <div className="staff-stat-grid">
        <div className="staff-stat-card">
          <div>
            <p>Đơn hàng cần xử lý</p>
            <h4>{stats.PENDING}</h4>
          </div>
          <div className="stat-icon green">🛒</div>
        </div>

        <div className="staff-stat-card">
          <div>
            <p>Đơn đã đóng gói</p>
            <h4>{stats.DELIVERED}</h4>
          </div>
          <div className="stat-icon blue">📦</div>
        </div>

        <div className="staff-stat-card">
          <div>
            <p>Đơn đang giao</p>
            <h4>{stats.SHIPPING}</h4>
          </div>
          <div className="stat-icon purple">🚚</div>
        </div>

        <div className="staff-stat-card">
          <div>
            <p>Đã hủy</p>
            <h4>{stats.CANCELLED}</h4>
          </div>
          <div className="stat-icon orange">❌</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === "ALL" ? "primary" : "outline-primary"}
          size="sm"
          onClick={() => setFilterStatus("ALL")}
        >
          Tất cả ({stats.total})
        </Button>
        <Button
          variant={filterStatus === "PENDING" ? "warning" : "outline-warning"}
          size="sm"
          onClick={() => setFilterStatus("PENDING")}
        >
          Đang xử lý ({stats.PENDING})
        </Button>
        <Button
          variant={filterStatus === "SHIPPING" ? "info" : "outline-info"}
          size="sm"
          onClick={() => setFilterStatus("SHIPPING")}
        >
          Đang giao ({stats.SHIPPING})
        </Button>
        <Button
          variant={filterStatus === "DELIVERED" ? "success" : "outline-success"}
          size="sm"
          onClick={() => setFilterStatus("DELIVERED")}
        >
          Đã giao ({stats.DELIVERED})
        </Button>
        <Button
          variant={filterStatus === "CANCELLED" ? "danger" : "outline-danger"}
          size="sm"
          onClick={() => setFilterStatus("CANCELLED")}
        >
          Đã hủy ({stats.CANCELLED})
        </Button>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Không có đơn hàng nào
            </div>
          ) : (
            <StaffOrderTable orders={orders} onView={handleViewOrder} />
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        show={showDrawer}
        onHide={() => setShowDrawer(false)}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />
    </div>
  );
}

export default StaffOrderManagerPage;
