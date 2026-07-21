import { useEffect, useState, useMemo } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { getReviewsByProductId } from "../../services/review/review.service";
import { getUserById } from "../../services/user/user.service";
import { getSizeById } from "../../services/size/size.service";
import { getColorById } from "../../services/color/color.service";
import { useProductDetailStore } from "../../store/product.store";
import "../../styles/customer/ProductReviews.css";

const PAGE_SIZE = 5;


// Star row
function StarRow({ rating, size = 14 }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar key={s} size={size} color={s <= rating ? "#f59e0b" : "#d1d5db"} />
      ))}
    </div>
  );
}

export default function ProductReviews() {
  const { product } = useProductDetailStore();
  const [reviews, setReviews] = useState([]); // enriched reviews
  const [loading, setLoading] = useState(true);
  const [filterStar, setFilterStar] = useState(0); // 0 = all
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!product?.id) return;
    loadReviews(product.id);
  }, [product?.id]);

  const loadReviews = async (productId) => {
    setLoading(true);
    try {
      const raw = await getReviewsByProductId(productId);

      // Enrich each review with user info, size name, color name
      const enriched = await Promise.all(
        raw.map(async (r) => {
          const [user, size, color] = await Promise.allSettled([
            r.userId ? getUserById(r.userId) : Promise.resolve(null),
            r.sizeId ? getSizeById(r.sizeId) : Promise.resolve(null),
            r.colorId ? getColorById(r.colorId) : Promise.resolve(null),
          ]);
          return {
            ...r,
            user: user.status === "fulfilled" ? user.value : null,
            sizeName: size.status === "fulfilled" ? size.value?.name : null,
            colorName: color.status === "fulfilled" ? color.value?.name : null,
          };
        })
      );

      setReviews(enriched);
    } catch (err) {
      console.error("Lỗi load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    return counts;
  }, [reviews]);

  // Filtered + paginated
  const filtered = useMemo(
    () => (filterStar === 0 ? reviews : reviews.filter((r) => r.rating === filterStar)),
    [reviews, filterStar]
  );
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  if (!product) return null;

  return (
    <section className="reviews-section">
      {/* Section heading */}
      <div className="reviews-section-title mb-3">
        <FaStar color="#f59e0b" size={18} />
        Đánh giá từ khách hàng
      </div>

      {/* ── Summary ── */}
      {reviews.length > 0 && (
        <div className="reviews-summary">
          <div className="text-center">
            <div className="reviews-avg-score">{avgRating}</div>
            <StarRow rating={Math.round(Number(avgRating))} size={16} />
            <div className="reviews-total-count mt-1">
              {reviews.length} đánh giá
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="reviews-breakdown">
            {[5, 4, 3, 2, 1].map((star) => (
              <div className="breakdown-row" key={star}>
                <span className="breakdown-label">{star} ⭐</span>
                <div className="breakdown-bar-track">
                  <div
                    className="breakdown-bar-fill"
                    style={{
                      width: reviews.length
                        ? `${(breakdown[star] / reviews.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="breakdown-count">{breakdown[star]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter tabs ── */}
      {reviews.length > 0 && (
        <div className="reviews-filter-tabs">
          {[0, 5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              className={`review-filter-btn ${filterStar === star ? "active" : ""}`}
              onClick={() => {
                setFilterStar(star);
                setPage(1);
              }}
            >
              {star === 0 ? "Tất cả" : `${star} sao (${breakdown[star]})`}
            </button>
          ))}
        </div>
      )}

      {/* ── Review list ── */}
      {loading ? (
        <div className="reviews-empty">
          <div className="reviews-empty-icon">⏳</div>
          <p>Đang tải đánh giá...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="reviews-empty">
          <div className="reviews-empty-icon">🐻</div>
          <p>
            {reviews.length === 0
              ? "Chưa có đánh giá nào. Hãy là người đầu tiên!"
              : "Không có đánh giá nào ở mức sao này."}
          </p>
        </div>
      ) : (
        <>
          {paginated.map((review) => {
            const displayName = review.user?.fullName || "Khách hàng ẩn danh";
            const dateStr = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("vi-VN")
              : "";

            return (
              <div className="review-card" key={review.id}>
                {/* Row 1: avatar + name + date */}
                <div className="d-flex align-items-start gap-3">
                  {/* Avatar */}
                  <img
                    src={review.user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={displayName}
                    className="review-avatar rounded-circle"
                    style={{ width: "45px", height: "45px", objectFit: "cover" }}
                  />

                  <div className="flex-grow-1">
                    {/* Name + verified + date */}
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                      <div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="review-author-name">
                            {displayName}
                          </span>
                          <span className="review-verified">
                            <FaCheckCircle size={10} />
                            Đã mua
                          </span>
                        </div>
                        {/* Stars */}
                        <StarRow rating={review.rating} size={13} />
                      </div>
                      <span className="review-date">{dateStr}</span>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="review-comment mt-2 mb-2">
                        {review.comment}
                      </p>
                    )}

                    {/* Size & Color tags */}
                    {(review.colorName || review.sizeName) && (
                      <div className="review-tags">
                        {review.colorName && (
                          <span className="review-tag review-tag-color">
                            Màu: {review.colorName}
                          </span>
                        )}
                        {review.sizeName && (
                          <span className="review-tag review-tag-size">
                            Size: {review.sizeName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load more */}
          {hasMore && (
            <div className="reviews-load-more">
              <button
                className="btn-load-more"
                onClick={() => setPage((p) => p + 1)}
              >
                Xem thêm đánh giá
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
