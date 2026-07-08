import React, { useState, useEffect, useMemo } from "react";
import { Container, Table, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { Trash2, Star } from "lucide-react";
import instance from "../../libs/axios";
import ProgressBar from "../../components/staff/ProgressBar";
import TopRankingProduct from "../../components/staff/TopRankingProduct";
import "../../styles/staff/StaffReviews.css";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterProduct, setFilterProduct] = useState("");
  const [filterStar, setFilterStar] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, usersRes, productsRes] = await Promise.all([
        instance.get("/reviews"),
        instance.get("/users"),
        instance.get("/products"),
      ]);
      setReviews(reviewsRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
      alert("Không thể tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      try {
        await instance.delete(`/reviews/${id}`);
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Xóa đánh giá thất bại");
      }
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => String(u.id) === String(userId));
    return user ? user.fullName : `Unknown User (${userId})`;
  };

  const getProductName = (productId) => {
    const product = products.find((p) => String(p.id) === String(productId));
    return product ? product.name : `Unknown Product (${productId})`;
  };

  const totalReviews = reviews.length;
  const uniqueReviewers = new Set(reviews.map((r) => r.userId)).size;
  const lowReviews = reviews.filter((r) => r.rating <= 2).length;

  const analytics = {
    totalReviews,
    uniqueReviewers,
    lowReviews,
  };

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews];

    if (filterProduct) {
      filtered = filtered.filter((r) => String(r.productId) === String(filterProduct));
    }

    if (filterStar) {
      filtered = filtered.filter((r) => Number(r.rating) === Number(filterStar));
    }

    // Sort earliest to latest (oldest first)
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return filtered;
  }, [reviews, filterProduct, filterStar]);

  if (loading) {
    return (
      <Container className="reviews-loading">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid className="p-0 staff-reviews-page">
      <Row className="staff-header">
        <Col md={12}>
          <h3>Quản lý Đánh giá</h3>
          <p>Xem và quản lý các đánh giá của khách hàng</p>
        </Col>
      </Row>

      {/* Analytics Section */}
      <Row>
        <Col>
          <div className="staff-card mb-4">
            {/* Top row stats */}
            <Row className="analytics-stats">
              <Col className="stat-item">
                <div className="stat-label">Tổng Đánh Giá</div>
                <h2 className="stat-value">{analytics.totalReviews.toLocaleString()}</h2>
              </Col>
              <Col className="stat-item">
                <div className="stat-label">Người Đánh Giá</div>
                <h2 className="stat-value">{analytics.uniqueReviewers.toLocaleString()}</h2>
              </Col>
              <Col className="stat-item">
                <div className="stat-label">Đánh Giá Thấp (≤2★)</div>
                <h2 className="stat-value">{analytics.lowReviews.toLocaleString()}</h2>
              </Col>
            </Row>

            {/* Second row */}
            <Row className="analytics-details">
              {/* Rating Distribution */}
              <Col md={7} className="rating-distribution">
                <h6 className="section-subtitle">Phân bố đánh giá</h6>
                <ProgressBar reviews={reviews} />
              </Col>

              {/* Top Rated Products */}
              <Col md={5} className="top-products">
                <h6 className="section-subtitle">Sản phẩm đánh giá cao</h6>
                <TopRankingProduct reviews={reviews} products={products} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="staff-card">
            {/* Filters */}
            <Row className="filters-section">
              <Col md={4} className="filter-item">
                <Form.Group>
                  <Form.Label className="filter-label">Lọc theo sản phẩm</Form.Label>
                  <Form.Select
                    value={filterProduct}
                    onChange={(e) => setFilterProduct(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Tất cả sản phẩm</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={8} className="filter-item">
                <Form.Group>
                  <Form.Label className="filter-label">Lọc theo số sao</Form.Label>
                  <div className="filter-buttons">
                    <Button
                      variant={filterStar === "" ? "primary" : "outline-primary"}
                      onClick={() => setFilterStar("")}
                      className="filter-btn"
                    >
                      Tất cả
                    </Button>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <Button
                        key={star}
                        variant={String(filterStar) === String(star) ? "primary" : "outline-primary"}
                        onClick={() => setFilterStar(String(star))}
                        className="filter-btn"
                      >
                        {star} <Star size={14} fill="currentColor" />
                      </Button>
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Table */}
            <div className="table-responsive">
              <Table hover className="reviews-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th style={{ width: "12%" }}>Khách hàng</th>
                    <th>Thông tin SP</th>
                    <th>Đánh giá</th>
                    <th>Nội dung</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedReviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-reviews">
                        Không có đánh giá nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedReviews.map((review) => (
                      <tr key={review.id}>
                        <td className="review-time">
                          {new Date(review.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="review-user">{getUserName(review.userId)}</td>
                        <td className="review-product">{getProductName(review.productId)}</td>
                        <td className="review-rating">
                          <div className="rating-stars">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                size={16}
                                fill={index < review.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="review-comment">
                          {review.comment}
                        </td>
                        <td className="review-actions">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
                            className="delete-btn"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminReviews;
