import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Spinner, InputGroup } from "react-bootstrap";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryProductsModal from "../../components/admin/CategoryProductsModal";
import "../../styles/admin/AdminCategory.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");

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

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: newCategoryName.trim(), id: Date.now().toString() })
            });
            const created = await res.json();
            setCategories((prev) => [...prev, created]);
            setNewCategoryName("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditSubmit = async (updatedCategory) => {
        try {
            const res = await fetch(`${API_URL}/categories/${updatedCategory.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCategory)
            });
            const updated = await res.json();
            setCategories((prev) =>
                prev.map((c) => (c.id === updatedCategory.id ? updated : c))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
            try {
                await fetch(`${API_URL}/categories/${id}`, {
                    method: 'DELETE'
                });
                setCategories((prev) => prev.filter((c) => c.id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const filtered = categories.filter((c) =>
        (c.type || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container fluid className="p-0 admin-category-page">
            <Row className="mb-4 align-items-center admin-category-header">
                <Col md={6} className="mb-3 mb-md-0">
                    <h4 className="mb-0">Quản lý Thể loại</h4>
                    <p className="text-muted mb-0">Thêm, chỉnh sửa, xoá và xem danh sách thể loại</p>
                </Col>
                <Col md={6}>
                    <div className="d-flex gap-2 category-add-form">
                        <Form.Control
                            className="category-input"
                            type="text"
                            placeholder="Nhập tên thể loại mới..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <Button className="category-add-btn" variant="primary" onClick={handleAddCategory}>
                            Thêm
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="mb-3 align-items-center">
                <Col md={6} lg={4}>
                    <Form.Control
                        className="category-search-input"
                        type="text"
                        placeholder="Tìm tên thể loại..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col md={6} lg={8} className="text-md-end mt-3 mt-md-0">
                    <span className="category-total-text">
                        Tổng số: {categories.length} thể loại
                    </span>
                </Col>
            </Row>

            <Row>
                <Col>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="admin-category-card">
                            <CategoryTable
                                categories={filtered}
                                onEdit={handleEditSubmit}
                                onDelete={handleDelete}
                                onViewProducts={(category) => setProductsModal({ show: true, data: category })}
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

export default AdminCategory;
