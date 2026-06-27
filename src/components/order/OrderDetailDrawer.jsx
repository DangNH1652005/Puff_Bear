import {
  Offcanvas,
  Form,
  Button,
} from "react-bootstrap";
import { useState } from "react";

function OrderDetailDrawer({
  show,
  onHide,
  order,
  onSave,
}) {
  const [status, setStatus] =
    useState(
      order?.status || "PENDING"
    );

  const [cancelReason, setCancelReason] =
    useState("");

  if (!order) return null;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "40%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {order.id}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>

        <h5>
          Thông tin khách hàng
        </h5>

        <div className="mb-4">
          <strong>
            {
              order.customer
                ?.fullName
            }
          </strong>

          <div>
            {
              order.customer
                ?.email
            }
          </div>

          <div>
            {order.phone}
          </div>
        </div>

        <h5>
          Địa chỉ & Thanh toán
        </h5>

        <div className="mb-4">
          <div>
            <strong>Địa chỉ:</strong>{" "}
            {order.address}
          </div>

          <div>
            <strong>Thanh toán:</strong>{" "}
            {order.paymentMethod || "COD"}
          </div>

          {order.cancelReason && (
            <div className="text-danger mt-2">
              <strong>Lý do hủy:</strong>{" "}
              {order.cancelReason}
            </div>
          )}
        </div>

        <h5>
          Sản phẩm (
          {order.items.length})
        </h5>

        {order.items.map(
          (item) => (
            <div
              key={item.id}
              className="d-flex mb-3"
            >
              <img
                src={
                  item.product
                    ?.image
                }
                width="70"
              />

              <div className="ms-3">
                <div>
                  {
                    item.product
                      ?.name
                  }
                </div>

                <div>
                  {
                    item.quantity
                  }
                  x
                </div>
              </div>
            </div>
          )
        )}

        <hr />

        <h5>
          Cập nhật trạng thái
        </h5>

        <Form.Select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >
          <option value="PENDING">
            Đang xử lý
          </option>

          <option value="SHIPPING">
            Đang giao
          </option>

          <option value="DELIVERED">
            Đã giao
          </option>

          <option value="CANCELLED">
            Đã hủy
          </option>
        </Form.Select>

        {status ===
          "CANCELLED" && (
          <Form.Group className="mt-3">
            <Form.Label>
              Lý do hủy
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={(e) =>
                setCancelReason(
                  e.target.value
                )
              }
            />
          </Form.Group>
        )}

        <div className="d-flex gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={onHide}
          >
            Đóng
          </Button>

          <Button
            onClick={() => {
              if (status === "CANCELLED" && !cancelReason.trim()) {
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