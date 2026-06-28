import React from "react";
import { useState, useEffect, useCallback } from "react";
import instance from "../../libs/axios";
import "../../styles/admin/AdminDashBoardPage.css";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";


const AdminDashBoardPage = () => {
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
          instance.get("/products"),
          instance.get("/orders"),
          instance.get("/users"),
          instance.get("/orderItems"),
        ]);


      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setOrderItems(orderItemsRes.data);
    } catch (error) {
      console.error("Cannot load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== ORDER_STATUS.DELIVERED) return sum;
    return sum + Number(order.totalPriceCart || 0);
  }, 0);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = users.filter(
    (user) => user.roleId === "0eLmcbt9W-M",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === ORDER_STATUS.PENDING,
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
    if (status === ORDER_STATUS.PENDING) return "Đang xử lý";
    if (status === ORDER_STATUS.DELIVERED) return "Đã giao";
    if (status === ORDER_STATUS.SHIPPING) return "Đang giao";
    if (status === ORDER_STATUS.CANCELLED) return "Đã huỷ";
    return status;
  };


  if (loading) {
    return (
      <div className="admin-dashboard">
        <h3>Dashboard</h3>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }


  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h3>Dashboard</h3>
        <p>Chào mừng trở lại, Admin! Đây là tổng quan cửa hàng của bạn.</p>
      </div>


      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div>
            <p>Tổng doanh thu</p>
            <h4>{fmt(totalRevenue)}</h4>
          </div>
          <div className="stat-icon green">$</div>
        </div>


        <div className="admin-stat-card">
          <div>
            <p>Đơn hàng</p>
            <h4>{totalOrders}</h4>
          </div>
          <div className="stat-icon blue">🛒</div>
        </div>


        <div className="admin-stat-card">
          <div>
            <p>Khách hàng</p>
            <h4>{totalCustomers}</h4>
          </div>
          <div className="stat-icon purple">👥</div>
        </div>


        <div className="admin-stat-card">
          <div>
            <p>Sản phẩm</p>
            <h4>{totalProducts}</h4>
          </div>
          <div className="stat-icon orange">📦</div>
        </div>
      </div>


      <div className="admin-main-grid">
        <div className="admin-card recent-orders">
          <h5>Đơn hàng gần đây</h5>
          <p>Danh sách đơn hàng mới nhất của cửa hàng</p>


          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th className="text-center">Giá trị</th>
                <th className="text-center">Trạng thái</th>
              </tr>
            </thead>


            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 5)}</td>
                  <td>{order.receiverName}</td>
                  <td>{getOrderProductName(order.id)}</td>
                  <td className="text-center">{fmt(order.totalPriceCart)}</td>
                  <td className="text-center">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="admin-card best-products">
          <h5>Sản phẩm bán chạy</h5>
          <p>Top sản phẩm có doanh số cao nhất</p>


          {bestSellingProducts.map((product) => (
            <div className="best-item" key={product.id}>
              <img src={product.mainImageUrl} alt={product.name} />
              <div className="best-info">
                <strong>{product.name}</strong>
                <span>Đã bán: {product.sold}</span>
              </div>
              <div className="best-price">{fmt(product.price * product.sold)}</div>
            </div>
          ))}
        </div>
      </div>


      <div className="admin-bottom-grid">
        <div className="admin-card quick-info">
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
      </div>
    </div>
  );
};


export default AdminDashBoardPage;

