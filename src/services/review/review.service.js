import instance from "../../libs/axios";

// Tạo review mới cho một sản phẩm trong đơn hàng
export const createReview = async (data) => {
  // data: { userId, productId, orderId, rating, comment, createdAt }
  const res = await instance.post("/reviews", data);
  return res.data;
};

// Lấy tất cả review theo productId
export const getReviewsByProductId = async (productId) => {
  const res = await instance.get(`/reviews?productId=${productId}`);
  return res.data;
};

// Lấy tất cả review theo userId
export const getReviewsByUserId = async (userId) => {
  const res = await instance.get(`/reviews?userId=${userId}`);
  return res.data;
};

// Lấy reviews theo orderId
export const getReviewsByOrderId = async (orderId) => {
  const res = await instance.get(`/reviews?orderId=${orderId}`);
  return res.data;
};

// Kiểm tra xem user đã review sản phẩm trong đơn này chưa
export const getReviewByUserAndProduct = async (userId, productId, orderId) => {
  const res = await instance.get(
    `/reviews?userId=${userId}&productId=${productId}&orderId=${orderId}`
  );
  return res.data;
};
