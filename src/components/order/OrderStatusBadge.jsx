import Badge from "react-bootstrap/Badge";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";

function OrderStatusBadge({
  status,
}) {
  const map = {
    [ORDER_STATUS.PENDING]: {
      text: "Đang xử lý",
      bg: "warning",
    },
    [ORDER_STATUS.CONFIRMED]: {
      text: "Đã xác nhận",
      bg: "secondary",
    },
    [ORDER_STATUS.SHIPPING]: {
      text: "Đang giao",
      bg: "primary",
    },
    [ORDER_STATUS.DELIVERED]: {
      text: "Đã giao",
      bg: "success",
    },
    [ORDER_STATUS.CANCELLED]: {
      text: "Đã hủy",
      bg: "danger",
    },
  };

  return (
    <Badge bg={map[status]?.bg || "secondary"}>
      {map[status]?.text || status}
    </Badge>
  );
}

export default OrderStatusBadge;