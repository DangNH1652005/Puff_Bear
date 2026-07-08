import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaStar, FaTimes, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import { createReview } from "../../services/review/review.service";
import { updateOrderStatus } from "../../services/order/order.service";
import "../../styles/customer/ReviewModal.css";

const STAR_LABELS = {
  1: "Rất tệ 😡",
  2: "Tệ 😕",
  3: "Bình thường 😐",
  4: "Tốt 😊",
  5: "Xuất sắc 🤩",
};

function StarRow({ itemId, rating, onRate }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="d-flex gap-2 mb-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={30}
          className={`star-icon ${hovered === star ? "hovered" : ""}`}
          style={{
            color: star <= (hovered || rating) ? "#f59e0b" : "#d1d5db",
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(itemId, star)}
        />
      ))}
    </div>
  );
}

export default function ReviewModal({ show, onHide, order, onSubmitSuccess }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ratings: { [itemId]: { rating: number, comment: string } }
  const [ratings, setRatings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = (itemId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], rating },
    }));
  };

  const handleComment = (itemId, comment) => {
    setRatings((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], comment },
    }));
  };

  const allRated =
    order?.items?.length > 0 &&
    order.items.every((item) => ratings[item.id]?.rating > 0);

  const avgRating = allRated
    ? (
        Object.values(ratings).reduce((acc, r) => acc + (r.rating || 0), 0) /
        order.items.length
      ).toFixed(1)
    : null;

  const handleSubmit = async () => {
    if (!allRated || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // 1. POST một review entry cho mỗi sản phẩm vào bảng /reviews
      await Promise.all(
        order.items.map((item) =>
          createReview({
            userId: user.id,
            productId: item.productId,
            orderId: order.id,
            sizeId: item.sizeId || null,
            colorId: item.colorId || null,
            rating: ratings[item.id].rating,
            comment: ratings[item.id].comment || "",
            createdAt: new Date().toISOString(),
          })
        )
      );

      // 2. Đánh dấu đơn hàng isReviewed = true
      await updateOrderStatus(order.id, { isReviewed: true });

      toast.success("Cảm ơn bạn đã đánh giá! 🐻");
      onSubmitSuccess(ratings); // truyền ratings về OrderCard để cập nhật UI
      onHide();
    } catch (err) {
      console.error(err);
      toast.error("Gửi đánh giá thất bại, thử lại nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRatings({});
    onHide();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="review-modal"
        dialogClassName="review-modal-dialog"
        backdrop="static"
      >
        {/* ── Header ── */}
        <Modal.Header className="border-0 pb-2 px-4 pt-4 review-modal-header">
          <div className="w-100 d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex align-items-center gap-2">
                <FaStar color="#f59e0b" size={20} />
                <Modal.Title className="fw-bold fs-6 m-0">
                  Đánh giá sản phẩm
                </Modal.Title>
              </div>
              <div className="text-muted small mt-1" style={{ fontSize: "0.78rem" }}>
                Đơn hàng{" "}
                <span className="fw-semibold text-dark">{order?.id?.slice(-8).toUpperCase()}</span>
                {" · "}
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                  : ""}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm border-0"
              style={{ width: 32, height: 32 }}
            >
              <FaTimes size={13} color="#6b7280" />
            </button>
          </div>
        </Modal.Header>

        {/* ── Body ── */}
        <Modal.Body
          className="px-4 pt-3 pb-2"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {order?.items?.map((item, idx) => (
            <div
              key={item.id}
              className={idx !== 0 ? "mt-4 pt-4 border-top" : ""}
            >
              {/* Product info */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={item.product?.mainImageUrl}
                  alt={item.product?.name}
                  width={52}
                  height={52}
                  className="rounded-3 shadow-sm flex-shrink-0"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                    {item.product?.name}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                    x{item.quantity} ·{" "}
                    {item.totalPrice?.toLocaleString()}đ
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="mb-1 small fw-semibold d-flex align-items-center gap-2">
                Chất lượng sản phẩm{" "}
                <span className="text-danger">*</span>
              </div>
              <StarRow
                itemId={item.id}
                rating={ratings[item.id]?.rating || 0}
                onRate={handleRate}
              />
              {ratings[item.id]?.rating > 0 && (
                <div
                  className="mt-1 mb-2 fw-medium"
                  style={{ color: "#f59e0b", fontSize: "0.82rem" }}
                >
                  {STAR_LABELS[ratings[item.id].rating]}
                </div>
              )}

              {/* Comment */}
              <div className="mt-2 mb-1 small fw-semibold">
                Nhận xét của bạn
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                className="review-textarea bg-light border"
                style={{ borderRadius: 12, resize: "none", fontSize: "0.88rem" }}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này... (màu sắc, chất liệu, độ dễ thương 🐻)"
                value={ratings[item.id]?.comment || ""}
                onChange={(e) => handleComment(item.id, e.target.value)}
              />
            </div>
          ))}
        </Modal.Body>

        {/* ── Footer ── */}
        <Modal.Footer className="border-0 px-4 pb-4 pt-3 gap-3 review-modal-footer">
          <Button
            variant="light"
            className="flex-grow-1 rounded-pill fw-semibold py-2 shadow-sm"
            onClick={handleClose}
          >
            Để sau
          </Button>
          <Button
            className={`flex-grow-1 rounded-pill fw-semibold py-2 review-submit-btn d-flex align-items-center justify-content-center gap-2 ${
              allRated ? "active" : ""
            }`}
            disabled={!allRated || isSubmitting}
            onClick={handleSubmit}
          >
            <FaPaperPlane size={13} />
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            {allRated && avgRating && (
              <span
                className="ms-1 px-2 py-0 rounded-pill"
                style={{
                  background: "rgba(255,255,255,0.3)",
                  fontSize: "0.75rem",
                }}
              >
                ⭐ {avgRating}
              </span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
