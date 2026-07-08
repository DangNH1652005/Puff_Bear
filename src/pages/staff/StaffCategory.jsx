import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryProductsModal from "../../components/admin/CategoryProductsModal";
import "../../styles/staff/StaffCategory.css";

const API_URL = process.env.REACT_APP_API_URL;

const StaffCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [productsModal, setProductsModal] = useState({ show: false, data: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = categories.filter((c) =>
        (c.type || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container fluid className="p-0 staff-category-page">
            <Row className="staff-header">
                <Col md={12}>
                    <h3>Danh sách Thể loại</h3>
                    <p>Xem và tìm kiếm các thể loại trong hệ thống</p>
                </Col>
            </Row>

            <Row>
                <Col>
                    <div className="staff-card category-filter-card">
                        <div className="category-search-box">
                            <input
                                type="text"
                                placeholder="Tìm tên thể loại..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="category-total">
                            Tổng số: {categories.length} thể loại
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: "var(--pink)" }} />
                        </div>
                    ) : (
                        <div className="staff-card">
                            <CategoryTable
                                categories={filtered}
                                onViewProducts={(category) => setProductsModal({ show: true, data: category })}
                                isStaff={true}
                            />
                        </div>
                    )}
                </Col>
            </Row>

            <CategoryProductsModal
                show={productsModal.show}
                handleClose={() => setProductsModal({ show: false, data: null })}
                category={productsModal.data}
            />
        </Container>
    );
};

export default StaffCategory;
