import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import OrderStatusBadge from "./OrderStatusBadge";

function StaffOrderTable({
  orders,
  onView,
}) {
  return (
    <div className="table-responsive">
      <Table className="staff-table align-middle text-start">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id.slice(0, 8)}</td>

              <td>
                <div>
                  <strong>
                    {
                      order.customer
                        ?.fullName
                    }
                  </strong>

                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {
                      order.customer
                        ?.email
                    }
                  </div>
                </div>
              </td>

              <td>
                {new Date(
                  order.createdAt
                ).toLocaleDateString(
                  "vi-VN"
                )}
              </td>

              <td>
                {order.items.length}
              </td>

              <td>
                {order.totalPriceCart.toLocaleString()}
                đ
              </td>

              <td>
                {order.paymentMethod || "COD"}
              </td>

              <td>
                <OrderStatusBadge
                  status={order.status}
                />
              </td>

              <td>
                <button
                  className="staff-table-btn"
                  onClick={() =>
                    onView(order)
                  }
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
export default StaffOrderTable;