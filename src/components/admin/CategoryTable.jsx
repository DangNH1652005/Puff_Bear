import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import "../../styles/admin/AdminCategory.css";

const CategoryTable = ({ categories, onEdit, onDelete, onViewProducts, isStaff }) => {
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    const handleStartEdit = (cat) => {
        setEditId(cat.id);
        setEditName(cat.type);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditName("");
    };

    const handleSaveEdit = (cat) => {
        if (editName.trim() && editName.trim() !== cat.type) {
            onEdit({ ...cat, type: editName.trim() });
        }
        setEditId(null);
    };

    return (
        <Table responsive hover className="category-table align-middle">
            <thead>
                <tr>
                    <th style={{ width: '20%' }}>ID</th>
                    <th style={{ width: '45%', textAlign: 'center' }}>Tên thể loại</th>
                    <th style={{ width: '35%', textAlign: 'center' }}>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {categories.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="text-center py-4 text-muted">
                            Không tìm thấy thể loại nào
                        </td>
                    </tr>
                ) : (
                    categories.map((cat) => (
                        <tr key={cat.id}>
                            <td className="align-middle text-muted">{cat.id}</td>

                            {editId === cat.id ? (
                                <td className="align-middle text-center">
                                    <Form.Control
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit(cat);
                                            if (e.key === 'Escape') handleCancelEdit();
                                        }}
                                        autoFocus
                                        className="text-center"
                                    />
                                </td>
                            ) : (
                                <td className="align-middle fw-semibold text-center">{cat.type}</td>
                            )}

                            <td className="align-middle text-center">
                                {editId === cat.id ? (
                                    <>
                                        <Button size="sm" className="me-2 action-btn save-btn" onClick={() => handleSaveEdit(cat)}>
                                            Lưu
                                        </Button>
                                        <Button size="sm" className="action-btn cancel-btn" onClick={handleCancelEdit}>
                                            Hủy
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="sm" className="me-2 action-btn view-btn" onClick={() => onViewProducts(cat)}>
                                            Xem SP
                                        </Button>
                                        {!isStaff && (
                                            <>
                                                <Button size="sm" className="me-2 action-btn edit-btn" onClick={() => handleStartEdit(cat)}>
                                                    Sửa
                                                </Button>
                                                <Button size="sm" className="action-btn delete-btn" onClick={() => onDelete(cat.id)}>
                                                    Xóa
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
};

export default CategoryTable;
