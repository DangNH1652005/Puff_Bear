import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, getOrderItemsByOrderId } from "../../services/order/order.service";
import { Container, Spinner, Alert, Button } from "react-bootstrap";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        const itemsData = await getOrderItemsByOrderId(orderId);
        
        setOrder(orderData);
        setOrderItems(itemsData);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Order not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Alert variant="success">
        <Alert.Heading>Đặt hàng thành công!</Alert.Heading>
        <p>Mã đơn hàng của bạn là: <strong>{order.id}</strong></p>
      </Alert>

      <div className="mt-4">
        <h4>Thông tin giao hàng</h4>
        <p><strong>Người nhận:</strong> {order.receiverName}</p>
        <p><strong>Số điện thoại:</strong> {order.phone}</p>
        <p><strong>Địa chỉ:</strong> {order.address}</p>
        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
        <p><strong>Tổng tiền:</strong> {order.totalAmount?.toLocaleString("vi-VN")}đ</p>
      </div>

      <div className="mt-4">
        <h4>Sản phẩm đã đặt</h4>
        <ul className="list-group">
          {orderItems.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.productName}</strong>
                <br />
                <small className="text-muted">
                  Size: {item.sizeId} | Màu: {item.colorId} | Số lượng: {item.quantity}
                </small>
              </div>
              <span>{(item.productPrice * item.quantity).toLocaleString("vi-VN")}đ</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <Link to="/">
          <Button variant="primary">Về trang chủ</Button>
        </Link>
      </div>
    </Container>
  );
};

export default OrderSuccessPage;
