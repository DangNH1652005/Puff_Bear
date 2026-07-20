import { Offcanvas, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";

function OrderDetailDrawer({ show, onHide, order, onSave }) {
  const [status, setStatus] = useState(order?.status || ORDER_STATUS.PENDING);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status || ORDER_STATUS.PENDING);
      setCancelReason(order.cancelReason || "");
    }
  }, [order]);

  if (!order) return null;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "40%" }}
      className="staff-drawer"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{order.id}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <div className="drawer-section-title">Thông tin khách hàng</div>

        <div className="mb-4">
          <strong>{order.customer?.fullName}</strong>

          <div>{order.customer?.email}</div>

          <div>{order.phone}</div>
        </div>
        <div className="drawer-section-title mt-4">Địa chỉ giao hàng</div>

        <div className="mb-4">
          <div>
            <strong>Địa chỉ:</strong> {order.address}
          </div>

          <div>
            <strong>Thành phố:</strong> {order.city}
          </div>

          <hr />
          {order.cancelReason && (
            <div className="text-danger mt-2">
              <strong>Lý do hủy:</strong> {order.cancelReason}
            </div>
          )}
        </div>
        <div className="drawer-section-title mt-4">Sản phẩm ({order.items.length})</div>

        {order.items.map((item) => (
          <div key={item.id} className="d-flex align-items-center mb-3">
            <img src={item.product?.mainImageUrl} className="drawer-item-img" alt={item.product?.name} />

            <div className="ms-3">
              <div>{item.product?.name}</div>

              <div>{item.quantity}x</div>
            </div>
          </div>
        ))}

        <div className="drawer-section-title mt-4">Cập nhật trạng thái</div>

        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value={ORDER_STATUS.PENDING}>Đang xử lý</option>

          <option value={ORDER_STATUS.CONFIRMED}>Đã xác nhận đơn</option>

          <option value={ORDER_STATUS.SHIPPING}>Đang giao</option>

          <option value={ORDER_STATUS.DELIVERED}>Đã giao</option>

          <option value={ORDER_STATUS.CANCELLED}>Đã hủy</option>
        </Form.Select>

        {status === ORDER_STATUS.CANCELLED && (
          <Form.Group className="mt-3">
            <Form.Label>Lý do hủy</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Group>
        )}

        <div className="d-flex gap-2 mt-4 pt-3 border-top">
          <Button variant="outline-secondary" className="rounded-pill px-4" onClick={onHide}>
            Đóng
          </Button>

          <button
            className="drawer-save-btn"
            onClick={() => {
              if (status === ORDER_STATUS.CANCELLED && !cancelReason.trim()) {
                alert("Vui lòng nhập lý do hủy");
                return;
              }
              onSave(status, cancelReason);
            }}
          >
            Lưu thay đổi
          </button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default OrderDetailDrawer;
