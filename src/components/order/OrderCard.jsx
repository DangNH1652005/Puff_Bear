import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";
import ReviewModal from "./ReviewModal";
import { FaStar } from "react-icons/fa";
import { Clock, Truck, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
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

function OrderCard({ order, onCancel }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [localOrder, setLocalOrder] = useState(order);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setLocalOrder(order);
  }, [order]);

  useEffect(() => {
    if (localOrder.isReviewed) {
      fetchReviews();
    }
  }, [localOrder.isReviewed]);

  const fetchReviews = async () => {
    try {
      const data = await getReviewsByOrderId(localOrder.id);
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

  const handleSubmitSuccess = (ratings) => {
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

  const getThemeClass = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return "theme-pending";
      case ORDER_STATUS.SHIPPING: return "theme-shipping";
      case ORDER_STATUS.DELIVERED: return "theme-delivered";
      case ORDER_STATUS.CANCELLED: return "theme-cancelled";
      default: return "";
    }
  };

  const getHeaderIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return <div className="header-icon-box icon-pending"><Clock size={20} /></div>;
      case ORDER_STATUS.SHIPPING:
        return <div className="header-icon-box icon-shipping"><Truck size={20} /></div>;
      case ORDER_STATUS.DELIVERED:
        return <div className="header-icon-box icon-delivered"><CheckCircle2 size={20} /></div>;
      case ORDER_STATUS.CANCELLED:
        return <div className="header-icon-box icon-cancelled"><XCircle size={20} /></div>;
      default:
        return <div className="header-icon-box"><Clock size={20} /></div>;
    }
  };

  const getPillClass = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return "pill-pending";
      case ORDER_STATUS.SHIPPING: return "pill-shipping";
      case ORDER_STATUS.DELIVERED: return "pill-delivered";
      case ORDER_STATUS.CANCELLED: return "pill-cancelled";
      default: return "bg-secondary text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return "Đang xử lý";
      case ORDER_STATUS.CONFIRMED: return "Đã xác nhận";
      case ORDER_STATUS.SHIPPING: return "Đang giao";
      case ORDER_STATUS.DELIVERED: return "Đã giao";
      case ORDER_STATUS.CANCELLED: return "Đã hủy";
      default: return status;
    }
  };


  return (
    <>
      <Card className={`mb-4 shadow-sm order-card-container`}>
        {/* ── Header ── */}
        <Card.Header className={`order-card-header ${getThemeClass(localOrder.status)}`}>
          <div className="d-flex align-items-center">
            {getHeaderIcon(localOrder.status)}
            <div>
              <div className="text-muted small">Mã đơn hàng</div>
              <h6 className="mb-0 fw-bold">{localOrder.id}</h6>
            </div>
          </div>

          <div className="d-flex align-items-center gap-4 text-end">
            <div>
              <div className="text-muted small">Ngày đặt</div>
              <div className="fw-semibold">
                {new Date(localOrder.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
            <span className={`status-pill ms-2 ${getPillClass(localOrder.status)}`}>
              {getStatusText(localOrder.status)}
            </span>
          </div>
        </Card.Header>

        {/* ── Body ── */}
        <Card.Body className="pt-4">
          {/* Product list */}
          {localOrder.items?.map((item) => {
            const itemReview = reviews.find((r) => r.productId === item.productId);
            const isCancelled = localOrder.status === ORDER_STATUS.CANCELLED;
            return (
              <div
                key={item.id}
                className={`d-flex align-items-start mb-3 pb-3 border-bottom ${isCancelled ? 'opacity-50' : ''}`}
              >
                <div className="order-item-img-wrapper">
                  <div className="order-item-qty-badge">{item.quantity}</div>
                  <div className="order-item-img-inner">
                    <img
                      src={item.product?.mainImageUrl}
                      alt={item.product?.name}
                      className="order-item-img"
                    />
                  </div>
                </div>

                <div className="ms-3 flex-grow-1">
                  <h5 className="mb-1">{item.product?.name}</h5>
                  <div className="text-muted small">Size: {item.size?.name}</div>
                  <div className="text-muted small">Màu: {item.color?.name}</div>
                  <div className="text-muted small">Số lượng: {item.quantity}</div>

                  {localOrder.isReviewed && itemReview && (
                    <MiniStars rating={itemReview.rating} />
                  )}
                </div>

                <div className="price-text fs-5 fw-semibold ms-2" style={{ color: "#ff8fb1" }}>
                  {item.totalPrice?.toLocaleString()}đ
                </div>
              </div>
            );
          })}

          {/* Cancelled notice */}
          {localOrder.status === ORDER_STATUS.CANCELLED && (
            <div className="text-danger fw-semibold my-4 d-flex align-items-center gap-2">
              <XCircle size={18} /> Đơn hàng đã bị hủy
            </div>
          )}

          {/* Footer row: total + action buttons */}
          <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2 p-3 bg-light rounded-4" style={{ backgroundColor: "#f8fafc" }}>
            <div className="d-flex align-items-baseline gap-2">
              <span className="text-muted">Tổng thanh toán</span>
              <h4 className="fw-bold mb-0" style={{ color: "#ff8fb1" }}>
                {localOrder.totalPriceCart?.toLocaleString()}đ
              </h4>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button
                className="btn btn-outline-secondary rounded-pill px-3"
                style={{ backgroundColor: "#fff" }}
                onClick={() => setShowDetail(!showDetail)}
              >
                {showDetail ? "▲ Ẩn bớt" : "▼ Chi tiết"}
              </button>

              {localOrder.status === ORDER_STATUS.PENDING && (
                <button
                  className="btn btn-outline-danger rounded-pill px-4"
                  onClick={() => onCancel && onCancel(localOrder.id)}
                >
                  Hủy đơn
                </button>
              )}

              {localOrder.status === ORDER_STATUS.SHIPPING && (
                <button className="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center gap-2">
                  <Truck size={16} /> Theo dõi
                </button>
              )}

              {localOrder.status === ORDER_STATUS.DELIVERED && (
                <>
                  {localOrder.isReviewed ? (
                    <div 
                      className="btn rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                      style={{ background: "#fef08a", color: "#a16207", cursor: "default" }}
                    >
                      <FaStar size={14} color="#eab308" /> Đã đánh giá
                    </div>
                  ) : (
                    <button
                      className="btn btn-solid-yellow rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                      onClick={() => setShowReviewModal(true)}
                    >
                      <FaStar size={14} color="#eab308" /> Đánh giá
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Detail panel */}
          {showDetail && (
            <div className="mt-4 pt-4 border-top">
              <div className="row g-4">
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
