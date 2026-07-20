import Badge from "react-bootstrap/Badge";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";

function OrderStatusBadge({
  status,
}) {
  const map = {
    [ORDER_STATUS.PENDING]: {
      text: "Đang xử lý",
      className: "status-pill pending",
    },
    [ORDER_STATUS.CONFIRMED]: {
      text: "Đã xác nhận",
      className: "status-pill confirmed",
    },
    [ORDER_STATUS.SHIPPING]: {
      text: "Đang giao",
      className: "status-pill shipping",
    },
    [ORDER_STATUS.DELIVERED]: {
      text: "Đã giao",
      className: "status-pill delivered",
    },
    [ORDER_STATUS.CANCELLED]: {
      text: "Đã hủy",
      className: "status-pill cancelled",
    },
  };

  return (
    <span className={map[status]?.className || "status-pill"}>
      {map[status]?.text || status}
    </span>
  );
}

export default OrderStatusBadge;