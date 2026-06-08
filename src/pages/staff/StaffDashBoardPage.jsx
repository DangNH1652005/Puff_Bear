import React from "react";
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import "./StaffDashBoardPage.css";

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

const StaffDashBoardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes, usersRes, orderItemsRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/orders"),
          api.get("/users"),
          api.get("/orderItems"),
        ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setOrderItems(orderItemsRes.data);
    } catch (error) {
      console.error("Cannot load staff dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPriceCart || 0),
    0,
  );

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = users.filter(
    (user) => user.roleId === "0eLmcbt9W-M",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const packedOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  const shippingOrders = orders.filter(
    (order) => order.status === "SHIPPING",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED",
  ).length;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= 15,
  ).length;

  const activeProducts = products.filter(
    (product) => product.status === "active",
  ).length;

  const bestSellingProducts = [...products]
    .sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0))
    .slice(0, 4);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getOrderProductName = (orderId) => {
    const item = orderItems.find((i) => i.orderId === orderId);
    const product = products.find((p) => String(p.id) === String(item?.productId));

    return product?.name || "Sản phẩm chưa xác định";
  };

  const getStatusText = (status) => {
    if (status === "PENDING") return "Đang xử lý";
    if (status === "DELIVERED") return "Đã giao";
    if (status === "SHIPPING") return "Đang giao";
    if (status === "CANCELLED") return "Đã huỷ";
    return status;
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <h3>Dashboard</h3>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
        <h3>Dashboard</h3>
        <p>Chào mừng trở lại, Staff! Đây là tổng quan cửa hàng của bạn.</p>
      </div>

      <div className="staff-stat-grid">
        <div className="staff-stat-card">
          <div>
            <p>Đơn hàng cần xử lý</p>
            <h4>{pendingOrders}</h4>
          </div>
          <div className="stat-icon green">🛒</div>
        </div>

        <div className="staff-stat-card">
          <div>
            <p>Đơn đã đóng gói</p>
            <h4>{packedOrders}</h4>
          </div>
          <div className="stat-icon blue">📦</div>
        </div>

        <div className="staff-stat-card">
          <div>
            <p>Đơn đang giao</p>
            <h4>{shippingOrders}</h4>
          </div>
          <div className="stat-icon purple">🚚</div>
        </div>

        <div className="staff-stat-card">
          <div>
            <p>Đã hủy</p>
            <h4>{cancelledOrders}</h4>
          </div>
          <div className="stat-icon orange">❌</div>
        </div>
      </div>

      <div className="staff-main-grid">
        <div className="staff-card recent-orders">
          <h5>Đơn hàng gần đây</h5>
          <p>Danh sách đơn hàng mới nhất của cửa hàng</p>

          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th  className="text-center">Giá trị</th>
                <th  className="text-center">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 5)}</td>
                  <td>{order.receiverName}</td>
                  <td>{getOrderProductName(order.id)}</td>
                  <td  className="text-center">{fmt(order.totalPriceCart)}</td>
                  <td  className="text-center">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="staff-card best-products">
          <h5>Sản phẩm bán chạy</h5>
          <p>Top sản phẩm có doanh số cao nhất</p>

          {bestSellingProducts.map((product) => (
            <div className="best-item" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="best-info">
                <strong>{product.name}</strong>
                <span>Đã bán: {product.sold}</span>
              </div>
              <div className="best-price">{fmt(product.price * product.sold)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="staff-bottom-grid">
        <div className="staff-card quick-info">
          <h5>Thông tin nhanh</h5>
          <p>Các chỉ số quan trọng khác</p>

          <div className="info-row">
            <span>Đơn hàng chờ xử lý</span>
            <strong>{pendingOrders}</strong>
          </div>

          <div className="info-row">
            <span>Sản phẩm sắp hết hàng</span>
            <strong className="danger">{lowStockProducts}</strong>
          </div>

          <div className="info-row">
            <span>Sản phẩm đang bán</span>
            <strong>{activeProducts}</strong>
          </div>

          <div className="info-row">
            <span>Doanh thu hôm nay</span>
            <strong className="success">{fmt(totalRevenue)}</strong>
          </div>
        </div>

        <div className="staff-card promo-card">
          <h5>🎉 Khuyến mãi đặc biệt</h5>
          <p>Tăng doanh số với chương trình mới</p>
          <span>
            Tạo chương trình khuyến mãi để thu hút khách hàng mua sắm nhiều hơn.
          </span>

          <button>Tạo khuyến mãi mới</button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashBoardPage;