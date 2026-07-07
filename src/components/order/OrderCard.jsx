import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";
import ReviewModal from "./ReviewModal";
import { FaStar } from "react-icons/fa";
import { getReviewsByOrderId } from "../../services/review/review.service";
import "../../styles/customer/OrderCard.css";

const STAR_LABELS = {
  1: "Rất tệ 😡",
  2: "Tệ 😕",
  3: "Bình thường 😐",
  4: "Tốt 😊",
  5: "Xuất sắc 🤩",
};

function MiniStars({ rating, label = true }) {
  return (
    <div className="d-flex align-items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          size={12}
          color={s <= rating ? "#f59e0b" : "#d1d5db"}
        />
      ))}
      {label && rating > 0 && (
        <span
          className="ms-1 rounded-pill px-2 mini-rating-label"
        >
          {STAR_LABELS[rating]}
        </span>
      )}
    </div>
  );
}

function ReviewBubble({ review }) {
  return (
    <div className="p-3 rounded-4 shadow-sm review-bubble">
      <div className="d-flex align-items-center gap-2 mb-2">
        <img
          src={review.product?.mainImageUrl}
          alt={review.product?.name}
          width={28}
          height={28}
          className="rounded-circle flex-shrink-0 review-bubble-product-img"
        />
        <span className="fw-semibold text-truncate review-bubble-product-name">
          {review.product?.name}
        </span>
        <div className="ms-auto d-flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <FaStar key={s} size={10} color={s <= review.rating ? "#f59e0b" : "#d1d5db"} />
          ))}
        </div>
      </div>
      {review.comment && (
        <div className="fst-italic text-secondary review-bubble-comment">
          &ldquo;{review.comment}&rdquo;
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  // localOrder mirrors order but can be updated after submit without re-fetch
  const [localOrder, setLocalOrder] = useState(order);
  // reviews: array of review objects enriched with product info
  const [reviews, setReviews] = useState([]);

  // Sync if parent refreshes the prop
  useEffect(() => {
    setLocalOrder(order);
  }, [order]);

  // If already reviewed, load reviews from API to show in detail panel
  useEffect(() => {
    if (localOrder.isReviewed) {
      fetchReviews();
    }
  }, [localOrder.isReviewed]);

  const fetchReviews = async () => {
    try {
      const data = await getReviewsByOrderId(localOrder.id);
      // Enrich with product info from order items
      const enriched = data.map((r) => {
        const matchItem = localOrder.items?.find(
          (i) => i.productId === r.productId
        );
        return { ...r, product: matchItem?.product };
      });
      setReviews(enriched);
    } catch (err) {
      console.error("Lỗi load reviews:", err);
    }
  };

  // Called by ReviewModal after successful POST
  const handleSubmitSuccess = (ratings) => {
    // Build local reviews from ratings + order items for instant UI update
    const localReviews = localOrder.items.map((item) => ({
      productId: item.productId,
      rating: ratings[item.id]?.rating || 0,
      comment: ratings[item.id]?.comment || "",
      product: item.product,
    }));
    setReviews(localReviews);
    setLocalOrder((prev) => ({ ...prev, isReviewed: true }));
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "warning";
      case ORDER_STATUS.SHIPPING:
        return "primary";
      case ORDER_STATUS.DELIVERED:
        return "success";
      case ORDER_STATUS.CANCELLED:
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm border-0 overflow-hidden">
        {/* ── Header ── */}
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small">Mã đơn hàng</div>
              <h5 className="mb-0 fw-bold">{localOrder.id}</h5>
            </div>

            <div className="text-end">
              <div className="text-muted small">Ngày đặt</div>
              <div className="fw-semibold">
                {new Date(localOrder.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>

            <Badge bg={getStatusColor(localOrder.status)}>
              {localOrder.status}
            </Badge>
          </div>
        </Card.Header>

        {/* ── Body ── */}
        <Card.Body>
          {/* Product list */}
          {localOrder.items?.map((item) => {
            const itemReview = reviews.find(
              (r) => r.productId === item.productId
            );
            return (
              <div
                key={item.id}
                className="d-flex align-items-start mb-3 pb-3 border-bottom"
              >
                <img
                  src={item.product?.mainImageUrl}
                  alt={item.product?.name}
                  width={90}
                  height={90}
                  className="order-item-img"
                />

                <div className="ms-3 flex-grow-1">
                  <h5 className="mb-1">{item.product?.name}</h5>
                  <div className="text-muted small">Size: {item.size?.name}</div>
                  <div className="text-muted small">Màu: {item.color?.name}</div>
                  <div className="text-muted small">Số lượng: {item.quantity}</div>

                  {/* Mini review badge below product */}
                  {localOrder.isReviewed && itemReview && (
                    <MiniStars rating={itemReview.rating} />
                  )}
                </div>

                <div className="fw-bold text-danger fs-5 ms-2">
                  {item.totalPrice?.toLocaleString()}đ
                </div>
              </div>
            );
          })}

          {/* Cancelled notice */}
          {localOrder.status === ORDER_STATUS.CANCELLED && (
            <div className="text-danger fw-semibold mb-3">
              ❌ Đơn hàng đã bị hủy
            </div>
          )}

          {/* Footer row: total + action buttons */}
          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
            <div>
              <div className="text-muted small">Tổng thanh toán</div>
              <h3 className="text-danger fw-bold mb-0">
                {localOrder.totalPriceCart?.toLocaleString()}đ
              </h3>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Review section — only for delivered orders */}
              {localOrder.status === ORDER_STATUS.DELIVERED && (
                localOrder.isReviewed ? (
                  <div className="reviewed-badge">
                    <FaStar size={14} />
                    Đã đánh giá ✓
                    {avgRating && (
                      <span className="ms-1 px-2 rounded-pill avg-rating-pill">
                        ⭐ {avgRating}
                      </span>
                    )}
                  </div>
                ) : (
                  <Button
                    className="review-trigger-btn rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <FaStar size={14} />
                    Đánh giá
                  </Button>
                )
              )}

              <Button
                variant="outline-secondary"
                className="rounded-pill px-3"
                onClick={() => setShowDetail(!showDetail)}
              >
                {showDetail ? "▲ Thu gọn" : "▼ Chi tiết"}
              </Button>
            </div>
          </div>

          {/* Detail panel */}
          {showDetail && (
            <div className="mt-4 pt-4 border-top">
              <div className="row g-4">
                {/* Shipping address */}
                <div className="col-md-6">
                  <div className="text-muted small mb-2 fw-semibold">
                    📦 Địa chỉ nhận hàng
                  </div>
                  <div className="fw-semibold">
                    📍 {localOrder.address}
                    {localOrder.district && `, ${localOrder.district}`}
                    {localOrder.city && `, ${localOrder.city}`}
                  </div>
                  <div className="mt-1 text-muted small">
                    📞 {localOrder.phone}
                  </div>
                  <div className="mt-1 small">
                    Người nhận: {localOrder.receiverName}
                  </div>
                </div>

                {/* Review bubbles — visible when reviewed + detail open */}
                {localOrder.isReviewed && reviews.length > 0 && (
                  <div className="col-md-6">
                    <div className="text-muted small mb-2 fw-semibold">
                      ⭐ Đánh giá của bạn
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {reviews.map((review, i) => (
                        <ReviewBubble key={review.productId || i} review={review} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Review Modal */}
      <ReviewModal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        order={localOrder}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </>
  );
}

export default OrderCard;
