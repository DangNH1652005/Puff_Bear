import { useState } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";

function OrderCard({ order }) {
  const [showDetail, setShowDetail] = useState(false);
  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "warning";
      case ORDER_STATUS.SHIPPING:
        return "primary";
      case ORDER_STATUS.DELIVERED:
        return "success";
      case ORDER_STATUS.CANCELLED:
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="mb-4 shadow-sm border-0 overflow-hidden">
      <Card.Header className="bg-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small">Mã đơn hàng</div>

            <h5 className="mb-0 fw-bold">{order.id}</h5>
          </div>

          <div className="text-end">
            <div className="text-muted small">Ngày đặt</div>

            <div className="fw-semibold">
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>

          <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
        </div>
      </Card.Header>

      <Card.Body>
        {order.items?.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center mb-3 pb-3 border-bottom"
          >
            <img
              src={item.product?.mainImageUrl}
              alt={item.product?.name}
              width="90"
              height="90"
              style={{
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            <div className="ms-3 flex-grow-1">
              <h5 className="mb-1">{item.product?.name}</h5>

              <div className="text-muted">Size: {item.size?.name}</div>

              <div className="text-muted">Màu: {item.color?.name}</div>

              <div className="text-muted">Số lượng: {item.quantity}</div>
            </div>

            <div className="fw-bold text-danger fs-5">
              {item.totalPrice?.toLocaleString()}đ
            </div>
          </div>
        ))}

        {order.status === "CANCELLED" && (
          <div className="text-danger fw-semibold mb-3">
            ❌ Đơn hàng đã bị hủy
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            <div className="text-muted">Tổng thanh toán</div>

            <h3 className="text-danger fw-bold mb-0">
              {order.totalPriceCart?.toLocaleString()}đ
            </h3>
          </div>

          <Button
            variant="outline-secondary"
            onClick={() => setShowDetail(!showDetail)}
          >
            {showDetail ? "▲ Thu gọn" : "▼ Chi tiết"}
          </Button>
        </div>

        {showDetail && (
          <div className="mt-4 pt-4 border-top">
            <div className="row">
              <div className="col-md-6">
                <div className="text-muted mb-2">Địa chỉ nhận hàng</div>

                <div className="fw-semibold">
                  📍 {order.address}
                  {order.district && `, ${order.district}`}
                  {order.city && `, ${order.city}`}
                </div>

                <div className="mt-2 text-muted">📞 {order.phone}</div>

                <div className="mt-2">Người nhận: {order.receiverName}</div>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default OrderCard;
