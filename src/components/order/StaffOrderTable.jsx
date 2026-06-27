import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import OrderStatusBadge from "./OrderStatusBadge";

function StaffOrderTable({
  orders,
  onView,
}) {
  return (
    <div style={styles.tableWrapper}>
      <Table hover responsive  className="text-center align-middle" style={styles.table}>
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
                <Button
                  size="sm"
                  variant="light"
                  onClick={() =>
                    onView(order)
                  }
                >
                  Xem
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

const styles = {
  tableWrapper: {
    marginTop: "16px",
    overflowX: "auto",
  },
  table: {
    marginBottom: 0,
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default StaffOrderTable;