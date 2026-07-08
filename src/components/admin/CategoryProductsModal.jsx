import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Spinner, Badge } from "react-bootstrap";
import "../../styles/admin/AdminCategory.css";

const CategoryProductsModal = ({ show, handleClose, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && category) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [show, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await fetch(`${API_URL}/products?categoryId=${category.id}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered dialogClassName="category-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          Sản phẩm thuộc thể loại: {category?.type}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Không có sản phẩm nào thuộc thể loại này.
          </div>
        ) : (
          <Table responsive hover className="category-modal-table align-middle">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="align-middle text-center">
                    <img
                      src={p.mainImageUrl}
                      alt={p.name}
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  </td>
                  <td className="align-middle">
                    <div className="fw-semibold">{p.name}</div>
                  </td>
                  <td className="align-middle">{p.price.toLocaleString("vi-VN")} đ</td>
                  <td className="align-middle">{p.stock}</td>
                  <td className="align-middle">
                    <Badge bg={p.status === "active" ? "success" : "secondary"}>
                      {p.status === "active" ? "Hoạt động" : "Đã ẩn"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="action-btn cancel-btn" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryProductsModal;
