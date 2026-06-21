import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getOrderById,
  getOrderItemsByOrderId,
} from "../../services/order/order.service";
import { getProductById } from "../../services/product/product.service";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import {
  BsBoxSeam,
  BsCheckCircleFill,
  BsGeoAltFill,
  BsPersonFill,
  BsTelephoneFill,
} from "react-icons/bs";
import { getColorById } from "../../services/color/color.service";
import { getSizeById } from "../../services/size/size.service";

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const enrichOrderItems = async (itemsData) => {
    return Promise.all(
      itemsData.map(async (item) => {
        const [product, size, color] = await Promise.all([
          fetchProductSafe(item.productId),
          fetchSizeSafe(item.sizeId),
          fetchColorSafe(item.colorId),
        ]);

        return { ...item, product, size, color };
      }),
    );
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        const itemsData = await getOrderItemsByOrderId(orderId);

        const itemsWithDetails = await enrichOrderItems(itemsData);

        setOrder(orderData);
        setOrderItems(itemsWithDetails);
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
    <Container className="py-4">
      {/* SUCCESS HEADER */}
      <Card className="text-center shadow-sm border-0 mb-4">
        <Card.Body className="py-5">
          <BsCheckCircleFill size={70} className="text-success mb-3" />

          <h3 className="fw-bold text-success">Đặt hàng thành công</h3>

          <p className="text-muted mb-3">Cảm ơn bạn đã mua hàng tại cửa hàng</p>

          <Badge bg="dark" className="px-3 py-2 fs-6">
            Order ID: {order.id}
          </Badge>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {/* LEFT - SHIPPING INFO */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="mb-3">
                <BsPersonFill className="me-2" />
                Thông tin giao hàng
              </h5>

              <div className="mb-3">
                <strong>{order.receiverName}</strong>
              </div>

              <div className="mb-3">
                <BsTelephoneFill className="me-2 text-success" />
                {order.phone}
              </div>

              <div className="mb-3">
                <BsGeoAltFill className="me-2 text-danger" />
                {order.address}
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <span>Ngày đặt</span>
                <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <strong>Tổng tiền</strong>
                <strong className="text-danger">
                  {order.totalPriceCart?.toLocaleString("vi-VN")}đ
                </strong>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT - PRODUCTS */}
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-3">
                <BsBoxSeam className="me-2" />
                Sản phẩm đã đặt
              </h5>

              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between align-items-center py-3 border-bottom"
                >
                  {/* LEFT PRODUCT */}
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.product?.mainImageUrl}
                      alt={item.product?.name}
                      width={70}
                      height={70}
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />

                    <div>
                      <div className="fw-semibold">{item.product?.name}</div>

                      <small className="text-muted d-block">
                        Size: {item.size?.name || "—"}
                      </small>

                      <small className="text-muted d-block">
                        Màu: {item.color?.name || "—"}
                      </small>

                      <small className="text-muted d-block">
                        SL: {item.quantity}
                      </small>
                    </div>
                  </div>

                  {/* RIGHT PRICE */}
                  <div className="text-end">
                    <div className="fw-bold text-danger">
                      {item.totalPrice?.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BUTTON */}
      <div className="text-center mt-4">
        <Link to="/products">
          <Button variant="primary" size="lg">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default OrderSuccessPage;
