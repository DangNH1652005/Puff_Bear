import Badge from "react-bootstrap/Badge";

function OrderStatusBadge({
  status,
}) {
  const map = {
    PENDING: {
      text: "Đang xử lý",
      bg: "warning",
    },
    CONFIRMED: {
      text: "Đã xác nhận",
      bg: "info",
    },
    SHIPPING: {
      text: "Đang giao",
      bg: "primary",
    },
    DELIVERED: {
      text: "Đã giao",
      bg: "success",
    },
    CANCELLED: {
      text: "Đã hủy",
      bg: "danger",
    },
  };

  return (
    <Badge bg={map[status]?.bg}>
      {map[status]?.text}
    </Badge>
  );
}

export default OrderStatusBadge;