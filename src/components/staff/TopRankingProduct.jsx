import React, { useMemo } from "react";
import { Star } from "lucide-react";
import "../../styles/staff/StaffReviews.css";

const TopRankingProduct = ({ reviews, products }) => {
  const topProducts = useMemo(() => {
    if (!reviews || !products) return [];

    const scoreboard = {};

    for (let i = 0; i < reviews.length; i++) {
      const reviewItem = reviews[i];
      const productId = String(reviewItem.productId);
      const rating = Number(reviewItem.rating);

      if (scoreboard[productId] === undefined) {
        scoreboard[productId] = { 
          totalStars: 0, 
          reviewersCount: 0 
        };
      }

      scoreboard[productId].totalStars = scoreboard[productId].totalStars + rating;
      scoreboard[productId].reviewersCount = scoreboard[productId].reviewersCount + 1;
    }

    const resultsList = [];
    const productIdsList = Object.keys(scoreboard);

    for (let i = 0; i < productIdsList.length; i++) {
      const productId = productIdsList[i];
      const scoreInfo = scoreboard[productId];
      
      const averageRating = scoreInfo.totalStars / scoreInfo.reviewersCount;
      
      let productName = "Unknown Product";
      for (let j = 0; j < products.length; j++) {
        if (String(products[j].id) === productId) {
          productName = products[j].name;
          break; 
        }
      }

      resultsList.push({
        productId: productId,
        name: productName,
        avgRating: averageRating.toFixed(1) 
      });
    }

    resultsList.sort((a, b) => {
      return b.avgRating - a.avgRating;
    });

    const top3Products = [];
    for (let i = 0; i < resultsList.length; i++) {
      if (i < 3) { // Chỉ lấy index 0, 1, 2
        top3Products.push(resultsList[i]);
      }
    }

    return top3Products;
  }, [reviews, products]);

  if (!topProducts || topProducts.length === 0) {
    return <div className="no-data">Chưa có dữ liệu</div>;
  }

  return (
    <ul className="top-ranking-list">
      {topProducts.map((prod, index) => (
        <li key={prod.productId} className="ranking-item">
          <div className="ranking-info">
            <span className="ranking-index">{index + 1}.</span>
            <span className="ranking-name">{prod.name}</span>
          </div>
          <div className="ranking-rating">
            {prod.avgRating} <Star size={14} className="star-icon" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TopRankingProduct;
