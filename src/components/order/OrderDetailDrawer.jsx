import { Offcanvas, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";

function OrderDetailDrawer({ show, onHide, order, onSave }) {
  const [status, setStatus] = useState(order?.status || ORDER_STATUS.PENDING);

  const [cancelReason, setCancelReason] = useState("");

  if (!order) return null;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "40%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{order.id}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <h5>Thông tin khách hàng</h5>

        <div className="mb-4">
          <strong>{order.customer?.fullName}</strong>

          <div>{order.customer?.email}</div>

          <div>{order.phone}</div>
        </div>
        <hr />
        <h5>Địa chỉ</h5>

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

        <h5>Sản phẩm ({order.items.length})</h5>

        {order.items.map((item) => (
          <div key={item.id} className="d-flex mb-3">
            <img src={item.product?.mainImageUrl} width="70" />

            <div className="ms-3">
              <div>{item.product?.name}</div>

              <div>{item.quantity}x</div>
            </div>
          </div>
        ))}

        <hr />

        <h5>Cập nhật trạng thái</h5>

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

        <div className="d-flex gap-2 mt-4">
          <Button variant="secondary" onClick={onHide}>
            Đóng
          </Button>

          <Button
            onClick={() => {
              if (status === ORDER_STATUS.CANCELLED && !cancelReason.trim()) {
                alert("Vui lòng nhập lý do hủy");
                return;
              }
              onSave(status, cancelReason);
            }}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default OrderDetailDrawer;
