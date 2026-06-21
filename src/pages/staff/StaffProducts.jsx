import { useCallback, useEffect, useMemo, useState } from "react";
import instance from "../../libs/axios";
import "../../styles/staff/StaffProduct.css";
import { getAllProducts } from "../../services/product/product.service";
import { getAllCategories } from "../../services/category/category.service";
import { getAllSizes } from "../../services/size/size.service";
import { getAllColors } from "../../services/color/color.service";
import { productStatus } from "../../constants/productStatus.constant";

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

const StaffProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [searchKey, setSearchKey] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editStock, setEditStock] = useState(0);
    const [editStatus, setEditStatus] = useState("active");

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);

            const [
                productsRes,
                categoriesRes,
                sizesRes,
                colorsRes,
            ] = await Promise.all([
                getAllProducts(),
                getAllCategories(),
                getAllSizes(),
                getAllColors(),
            ]);

            setProducts(productsRes);
            setCategories(categoriesRes);
            setSizes(sizesRes);
            setColors(colorsRes);
        } catch (error) {
            console.error("Cannot load staff products:", error);
            alert("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const getCategoryName = (categoryId) => {
        return categories.find((item) => item.id === categoryId)?.type || "N/A";
    };

    const getSizeLabels = (sizeIds = []) => {
        const result = sizeIds
            .map((id) => sizes.find((item) => item.id === id)?.name)
            .filter(Boolean)
            .join(", ");

        return result || "N/A";
    };

    const getColorNames = (colorIds = []) => {
        const result = colorIds
            .map((id) => colors.find((item) => item.id === id)?.name)
            .filter(Boolean)
            .join(", ");

        return result || "N/A";
    };

    const getStatusText = (status) => {
        if (status === productStatus.ACTIVE) return "Đang bán";
        if (status === productStatus.INACTIVE) return "Ngừng bán";
        return status || "N/A";
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchKey.trim()) {
            result = result.filter((product) =>
                product.name?.toLowerCase().includes(searchKey.toLowerCase()),
            );
        }

        if (statusFilter !== "all") {
            result = result.filter((product) => product.status === statusFilter);
        }

        return result;
    }, [products, searchKey, statusFilter]);

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;
    const inactiveProducts = products.filter((p) => p.status === "inactive").length;
    const lowStockProducts = products.filter((p) => Number(p.stock || 0) <= 15).length;

    const openUpdateForm = (product) => {
        setEditingProduct(product);
        setEditStock(product.stock ?? 0);
        setEditStatus(product.status || "active");
    };

    const closeEditModal = () => {
        setEditingProduct(null);
        setEditStock(0);
        setEditStatus("active");
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const stockNumber = Number(editStock);

        if (Number.isNaN(stockNumber) || stockNumber < 0) {
            alert("Stock phải là số lớn hơn hoặc bằng 0");
            return;
        }

        try {
            const res = await instance.patch(`/products/${editingProduct.id}`, {
                stock: stockNumber,
                status: editStatus,
            });

            const updatedProduct = res.data;

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product,
                ),
            );

            if (selectedProduct?.id === updatedProduct.id) {
                setSelectedProduct(updatedProduct);
            }

            closeEditModal();
        } catch (error) {
            console.error("Cannot update product:", error);
            alert("Cập nhật sản phẩm thất bại");
        }
    };

    if (loading) {
        return (
            <div className="staff-dashboard staff-product-page">
                <h3>Products</h3>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="staff-dashboard staff-product-page">
            <div className="staff-header">
                <h3>Products</h3>
                <p>
                    Quản lý sản phẩm dành cho Staff. Bạn chỉ được cập nhật số lượng tồn kho
                    và trạng thái bán.
                </p>
            </div>

            <div className="staff-stat-grid">
                <div className="staff-stat-card">
                    <div>
                        <p>Tổng sản phẩm</p>
                        <h4>{totalProducts}</h4>
                    </div>
                    <div className="stat-icon green">🧸</div>
                </div>

                <div className="staff-stat-card">
                    <div>
                        <p>Đang bán</p>
                        <h4>{activeProducts}</h4>
                    </div>
                    <div className="stat-icon blue">✅</div>
                </div>

                <div className="staff-stat-card">
                    <div>
                        <p>Ngừng bán</p>
                        <h4>{inactiveProducts}</h4>
                    </div>
                    <div className="stat-icon purple">⏸️</div>
                </div>

                <div className="staff-stat-card">
                    <div>
                        <p>Sắp hết hàng</p>
                        <h4>{lowStockProducts}</h4>
                    </div>
                    <div className="stat-icon orange">⚠️</div>
                </div>
            </div>

            <div className="staff-card product-filter-card">
                <div>
                    <h5>Danh sách sản phẩm</h5>
                    <p>Tìm kiếm, lọc trạng thái và cập nhật tồn kho sản phẩm.</p>
                </div>

                <div className="product-filter-row">
                    <div className="product-search-box">
                        <label>Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Nhập tên sản phẩm..."
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>

                    <div className="product-status-filter">
                        <label>Trạng thái</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang bán</option>
                            <option value="inactive">Ngừng bán</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="staff-card product-table-card">
                <div className="product-table-wrap">
                    <table className="staff-product-table">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th> Sản phẩm </th>
                                <th> Thể loại</th>
                                <th className="text-center">Giá bán</th>
                                <th className="text-center">Tồn kho</th>
                                <th className="text-center">Đã bán</th>
                                <th className="text-center">Trạng thái</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="empty-product">
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td className="text-center">
                                            {index + 1}
                                        </td>

                                        <td>
                                            <div className="product-info-cell">
                                                <img
                                                    className="product-thumb"
                                                    src={product.mainImageUrl}
                                                    alt={product.name}
                                                />

                                                <div>
                                                    <strong className="product-name">{product.name}</strong>
                                                    <span className="product-desc">
                                                        {product.description || "Không có mô tả"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{getCategoryName(product.categoryId)}</td>

                                        <td className="text-center product-price">
                                            {fmt(product.price)}
                                        </td>

                                        <td className="text-center">
                                            <span
                                                className={
                                                    Number(product.stock || 0) <= 15
                                                        ? "stock-badge low"
                                                        : "stock-badge"
                                                }
                                            >
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td className="text-center">
                                            {product.sold || 0}
                                        </td>

                                        <td className="text-center">
                                            <span className={`product-status ${product.status}`}>
                                                {getStatusText(product.status)}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="product-actions">
                                                <button
                                                    type="button"
                                                    className="staff-btn view"
                                                    onClick={() => setSelectedProduct(product)}
                                                >
                                                    Detail
                                                </button>

                                                <button
                                                    type="button"
                                                    className="staff-btn edit"
                                                    onClick={() => openUpdateForm(product)}
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedProduct && (
                <div className="staff-modal-backdrop">
                    <div className="staff-modal detail-modal">
                        <div className="staff-modal-header">
                            <div>
                                <h4>Chi tiết sản phẩm</h4>
                                <p>Thông tin đầy đủ của sản phẩm</p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => setSelectedProduct(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="product-detail-grid">
                            <div className="product-detail-image">
                                <img src={selectedProduct.mainImageUrl} alt={selectedProduct.name} />
                            </div>

                            <div className="product-detail-info">
                                <h3>{selectedProduct.name}</h3>
                                <p>{selectedProduct.description}</p>

                                <div className="detail-row">
                                    <span>Giá</span>
                                    <strong>{fmt(selectedProduct.price)}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Thể loại</span>
                                    <strong>{getCategoryName(selectedProduct.categoryId)}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Size</span>
                                    <strong>{getSizeLabels(selectedProduct.sizeIds)}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Màu sắc</span>
                                    <strong>{getColorNames(selectedProduct.colorIds)}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Stock</span>
                                    <strong>{selectedProduct.stock}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Đã bán</span>
                                    <strong>{selectedProduct.sold || 0}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Trạng thái</span>
                                    <strong>{getStatusText(selectedProduct.status)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingProduct && (
                <div className="staff-modal-backdrop">
                    <div className="staff-modal update-modal">
                        <div className="staff-modal-header">
                            <div>
                                <h4>Cập nhật sản phẩm</h4>
                                <p>Staff chỉ được cập nhật tồn kho và trạng thái.</p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeEditModal}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct}>
                            <div className="locked-product-box">
                                <img src={editingProduct.mainImageUrl} alt={editingProduct.name} />

                                <div>
                                    <strong>{editingProduct.name}</strong>
                                    <span>{fmt(editingProduct.price)}</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editStock}
                                    onChange={(e) => setEditStock(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                >
                                    <option value="active">Đang bán</option>
                                    <option value="inactive">Ngừng bán</option>
                                </select>
                            </div>

                            <div className="staff-warning">
                                Các thông tin như tên, giá, ảnh, danh mục không được
                                phép chỉnh sửa ở tài khoản Staff.
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="staff-btn cancel"
                                    onClick={closeEditModal}
                                >
                                    Hủy
                                </button>

                                <button type="submit" className="staff-btn save">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffProduct;