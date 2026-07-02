// Đổi số thành tiền VNĐ
export function formatMoney(n) {
  if (!n) return "0đ";
  return n.toLocaleString("vi-VN") + "đ";
}

// Đổi ngày ISO thành ngày Việt Nam
export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
}

// Lấy chữ cái đầu tên cho avatar
export function getInitial(name) {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}