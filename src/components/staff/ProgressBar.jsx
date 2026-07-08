import React, { useMemo } from "react";
import { ProgressBar as BsProgressBar } from "react-bootstrap";
import { Star } from "lucide-react";
import "../../styles/staff/StaffReviews.css";

const ProgressBar = ({ reviews }) => {
  const { totalReviews, ratingCounts } = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!reviews) return { totalReviews: 0, ratingCounts: counts };
    
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return { totalReviews: reviews.length, ratingCounts: counts };
  }, [reviews]);

  return (
    <div className="review-progress-list">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = ratingCounts[star] || 0;
        const percentage = totalReviews === 0 ? 0 : (count / totalReviews) * 100;
        return (
          <div key={star} className="progress-item">
            <div className="progress-label">
              {star} <Star size={12} className="star-icon" />
            </div>
            <div className="progress-bar-container">
              <BsProgressBar 
                now={percentage} 
                variant={star >= 4 ? "success" : star === 3 ? "warning" : "danger"}
                className="custom-progress"
              />
            </div>
            <div className="progress-count">
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
