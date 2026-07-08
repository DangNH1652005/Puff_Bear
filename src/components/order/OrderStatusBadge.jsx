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
<<<<<<< HEAD
    [ORDER_STATUS.CONFIRMED]: {
      text: "Đã xác nhận",
      bg: "secondary",
    },
    [ORDER_STATUS.SHIPPING]: {
=======
    CONFIRMED: {
      text: "Đã xác nhận",
      bg: "info",
    },
    SHIPPING: {
>>>>>>> b802cf70d2433e8baabf3cab400ed966fce7aa11
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