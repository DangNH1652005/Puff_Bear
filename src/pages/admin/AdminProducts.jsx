import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from "../../services/product/product.service";
import instance from "../../libs/axios";
import "../../styles/admin/AdminProducts.css";

const EMPTY_FORM = {
  name: "",
  price: "",
  stock: "",
  categoryId: 1,
  status: "active",
  image: "",
  description: "",
  sizeIds: [],
  colorIds: [],
  collectionId: "",
};

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "đ";
const PER_PAGE = 8;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterSt, setFilterSt] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const [prods, st, catsRes, sizesRes, colorsRes, collectionsRes] =
        await Promise.all([
          getProducts(),
          getProductStats(),
          instance.get("/categories"),
          instance.get("/sizes"),
          instance.get("/colors"),
          instance.get("/collections"),
        ]);
      setProducts(prods);
      setStats(st);
      setCategories(catsRes.data);
      setSizes(sizesRes.data);
      setColors(colorsRes.data);
      setCollections(collectionsRes.data);
    } catch {
      showToast(
        "❌ Không thể kết nối server. Hãy chạy: npm run server",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Modal open/close
  useEffect(() => {
    const el = document.getElementById("productModal");
    if (!el) return;
    if (modalMode) {
      el.classList.add("show");
      el.style.display = "block";
      document.body.classList.add("modal-open");
      if (!document.getElementById("modal-backdrop")) {
        const bd = document.createElement("div");
        bd.id = "modal-backdrop";
        bd.className = "modal-backdrop fade show";
        document.body.appendChild(bd);
      }
    } else {
      el.classList.remove("show");
      el.style.display = "none";
      document.body.classList.remove("modal-open");
      document.getElementById("modal-backdrop")?.remove();
    }
  }, [modalMode]);

  const closeModal = () => {
    setModalMode(null);
    setSaving(false);
  };
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSelected(null);
    setModalMode("add");
  };
  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), stock: String(p.stock) });
    setErrors({});
    setSelected(p);
    setModalMode("edit");
  };
  const openView = (p) => {
    setSelected(p);
    setModalMode("view");
  };
  const openDel = (p) => {
    setSelected(p);
    setModalMode("delete");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên sản phẩm";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "Giá phải là số dương";
    if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0)
      e.stock = "Tồn kho không hợp lệ";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      if (modalMode === "add") {
        await addProduct(form);
        showToast("✅ Thêm sản phẩm thành công!");
      } else {
        await updateProduct(selected.id, form);
        showToast("✏️ Cập nhật thành công!");
      }
      await reload();
      closeModal();
    } catch {
      showToast("❌ Lỗi server!", "danger");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteProduct(selected.id);
      showToast("🗑️ Đã xoá sản phẩm!", "danger");
      await reload();
      closeModal();
    } catch {
      showToast("❌ Lỗi server!", "danger");
      setSaving(false);
    }
  };

  const catName = (p) => {
    const c = categories.find((c) => String(c.id) === String(p.categoryId));
    return c ? c.name : "—";
  };

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) &&
        (filterCat === "all" || String(p.categoryId) === String(filterCat)) &&
        (filterSt === "all" || p.status === filterSt)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "stock") return a.stock - b.stock;
      if (sortBy === "sold") return b.sold - a.sold;
      return a.id - b.id;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="ap-page">
      {toast && (
        <div
          className={`ap-toast alert alert-${toast.type === "danger" ? "danger" : "success"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="ap-title mb-0">Quản lý Sản phẩm</h4>
          <p className="ap-sub text-muted mb-0">
            Thêm, chỉnh sửa, xoá sản phẩm trong cửa hàng
          </p>
        </div>
        <button className="btn ap-btn-add" onClick={openAdd}>
          <i className="bi bi-plus-lg me-2"></i>Thêm sản phẩm
        </button>
      </div>

      <div className="row g-3 mb-4">
        {[
          {
            label: "Tổng sản phẩm",
            value: stats.total ?? "…",
            icon: "🧸",
            color: "blue",
          },
          {
            label: "Đang bán",
            value: stats.active ?? "…",
            icon: "🌸",
            color: "green",
          },
          {
            label: "Sắp hết hàng",
            value: stats.lowStock ?? "…",
            icon: "🌼",
            color: "orange",
          },
          {
            label: "Doanh thu ước tính",
            value: stats.revenue !== undefined ? fmt(stats.revenue) : "…",
            icon: "🌷",
            color: "pink",
          },
        ].map((c) => (
          <div className="col-md-3 col-sm-6" key={c.label}>
            <div className={`ap-stat-card ap-stat-${c.color}`}>
              <div>
                <span className="ap-stat-emoji">{c.icon}</span>
                <div className="ap-stat-value">{c.value}</div>
                <div className="ap-stat-label">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card ap-filter-card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-center">
          <div className="ap-search-box">
            <i className="bi bi-search"></i>
            <input
              placeholder="Tìm tên sản phẩm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="form-select ap-filter-select"
            value={filterCat}
            onChange={(e) => {
              setFilterCat(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="form-select ap-filter-select"
            value={filterSt}
            onChange={(e) => {
              setFilterSt(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>
          <select
            className="form-select ap-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Mặc định</option>
            <option value="price">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="stock">Tồn kho thấp</option>
            <option value="sold">Bán nhiều nhất</option>
          </select>
          <span className="ms-auto text-muted" style={{ fontSize: 13 }}>
            {filtered.length} sản phẩm
          </span>
        </div>
      </div>

      <div className="card ap-table-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "var(--pink,#f06292)" }}
              ></div>
              <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                Đang tải dữ liệu...
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table ap-table mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá bán</th>
                    <th>Tồn kho</th>
                    <th>Đã bán</th>
                    <th>Trạng thái</th>
                    <th style={{ width: 110 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>Không
                        tìm thấy sản phẩm nào
                      </td>
                    </tr>
                  )}
                  {paged.map((p, idx) => (
                    <tr key={p.id} className="ap-table-row">
                      <td className="text-muted" style={{ fontSize: 13 }}>
                        {(page - 1) * PER_PAGE + idx + 1}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={p.image || "https://via.placeholder.com/40"}
                            alt={p.name}
                            className="ap-product-img"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                          <div>
                            <div className="ap-product-name">{p.name}</div>
                            <div className="ap-product-desc">
                              {p.description?.slice(0, 38)}…
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`ap-badge-cat ap-badge-cat-${p.categoryId}`}
                        >
                          {catName(p)}
                        </span>
                      </td>
                      <td className="fw-semibold">{fmt(p.price)}</td>
                      <td>
                        <span
                          className={
                            p.stock < 15 ? "text-danger fw-semibold" : ""
                          }
                        >
                          {p.stock}
                          {p.stock < 15 && (
                            <i className="bi bi-exclamation-triangle ms-1 text-danger"></i>
                          )}
                        </span>
                      </td>
                      <td>{p.sold}</td>
                      <td>
                        <span
                          className={`ap-badge-status ${p.status === "active" ? "active" : "inactive"}`}
                        >
                          {p.status === "active" ? "Đang bán" : "Ngừng bán"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="ap-action-btn view"
                            title="Xem"
                            onClick={() => openView(p)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="ap-action-btn edit"
                            title="Sửa"
                            onClick={() => openEdit(p)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="ap-action-btn del"
                            title="Xoá"
                            onClick={() => openDel(p)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted" style={{ fontSize: 13 }}>
              Trang {page} / {totalPages}
            </span>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  ‹
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <li
                  key={n}
                  className={`page-item ${n === page ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(n)}>
                    {n}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  ›
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Modal */}
      <div className="modal fade" id="productModal" tabIndex="-1">
        <div
          className={`modal-dialog ${modalMode === "view" ? "modal-lg" : ""} modal-dialog-centered`}
        >
          <div className="modal-content ap-modal">
            <div className="modal-header ap-modal-header">
              <h5 className="modal-title">
                {modalMode === "add" && (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>Thêm sản phẩm
                  </>
                )}
                {modalMode === "edit" && (
                  <>
                    <i className="bi bi-pencil-square me-2"></i>Chỉnh sửa sản
                    phẩm
                  </>
                )}
                {modalMode === "view" && (
                  <>
                    <i className="bi bi-eye me-2"></i>Chi tiết sản phẩm
                  </>
                )}
                {modalMode === "delete" && (
                  <>
                    <i className="bi bi-trash me-2"></i>Xoá sản phẩm
                  </>
                )}
              </h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              {modalMode === "delete" && (
                <div className="text-center py-3">
                  <div className="ap-delete-icon mb-3">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  </div>
                  <h6>Bạn có chắc muốn xoá?</h6>
                  <p className="text-muted mb-0">
                    Sản phẩm <strong>"{selected?.name}"</strong> sẽ bị xoá vĩnh
                    viễn.
                  </p>
                </div>
              )}
              {modalMode === "view" && selected && (
                <div className="row g-3">
                  <div className="col-md-4 text-center">
                    <img
                      src={selected.image || "https://via.placeholder.com/200"}
                      alt={selected.name}
                      className="ap-view-img"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200";
                      }}
                    />
                    <span
                      className={`ap-badge-status ${selected.status === "active" ? "active" : "inactive"} d-inline-block mt-2`}
                    >
                      {selected.status === "active" ? "Đang bán" : "Ngừng bán"}
                    </span>
                  </div>
                  <div className="col-md-8">
                    <h5 className="fw-bold mb-1">{selected.name}</h5>
                    <span className="ap-badge-cat mb-3 d-inline-block">
                      {catName(selected)}
                    </span>
                    <p className="text-muted">{selected.description}</p>
                    <div className="row g-2 mt-1">
                      {[
                        { label: "Giá bán", value: fmt(selected.price) },
                        { label: "Tồn kho", value: selected.stock },
                        { label: "Đã bán", value: selected.sold },
                        {
                          label: "Doanh thu ước tính",
                          value: fmt(selected.price * selected.sold),
                        },
                      ].map((r) => (
                        <div className="col-6" key={r.label}>
                          <div className="ap-view-stat">
                            <div className="ap-view-stat-val">{r.value}</div>
                            <div className="ap-view-stat-label">{r.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {(modalMode === "add" || modalMode === "edit") && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="ap-label">Tên sản phẩm *</label>
                    <input
                      className={`form-control ap-input ${errors.name ? "is-invalid" : ""}`}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="VD: Gấu Teddy Brown Size L"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="ap-label">Giá bán (VNĐ) *</label>
                    <input
                      className={`form-control ap-input ${errors.price ? "is-invalid" : ""}`}
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="450000"
                    />
                    {errors.price && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="ap-label">Tồn kho *</label>
                    <input
                      className={`form-control ap-input ${errors.stock ? "is-invalid" : ""}`}
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="50"
                    />
                    {errors.stock && (
                      <div className="invalid-feedback">{errors.stock}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="ap-label">Danh mục</label>
                    <select
                      className="form-select ap-input"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="ap-label">Trạng thái</label>
                    <select
                      className="form-select ap-input"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="active">Đang bán</option>
                      <option value="inactive">Ngừng bán</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="ap-label">URL hình ảnh</label>
                    <input
                      className="form-control ap-input"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                    {form.image && (
                      <img
                        src={form.image}
                        alt="preview"
                        className="ap-img-preview mt-2"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div className="col-12">
                    <label className="ap-label">Mô tả</label>
                    <textarea
                      className="form-control ap-input"
                      name="description"
                      rows={3}
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Mô tả ngắn..."
                    />
                  </div>
                  {/* Sizes */}
                  <div className="col-12">
                    <label className="ap-label">Kích thước</label>
                    <div className="ap-checkbox-group">
                      {sizes.map((s) => (
                        <label
                          key={s.id}
                          className={`ap-checkbox-item ${form.sizeIds.includes(s.id) ? "checked" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={form.sizeIds.includes(s.id)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...form.sizeIds, s.id]
                                : form.sizeIds.filter((x) => x !== s.id);
                              setForm((f) => ({ ...f, sizeIds: updated }));
                            }}
                          />
                          {s.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="col-12">
                    <label className="ap-label">Màu sắc</label>
                    <div className="ap-checkbox-group">
                      {colors.map((c) => (
                        <label
                          key={c.id}
                          className={`ap-checkbox-item ${form.colorIds.includes(c.id) ? "checked" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={form.colorIds.includes(c.id)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...form.colorIds, c.id]
                                : form.colorIds.filter((x) => x !== c.id);
                              setForm((f) => ({ ...f, colorIds: updated }));
                            }}
                          />
                          {c.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Collection */}
                  <div className="col-12">
                    <label className="ap-label">Bộ sưu tập</label>
                    <select
                      className="form-select ap-input"
                      name="collectionId"
                      value={form.collectionId}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn bộ sưu tập --</option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn ap-btn-cancel"
                onClick={closeModal}
                disabled={saving}
              >
                Đóng
              </button>
              {(modalMode === "add" || modalMode === "edit") && (
                <button
                  className="btn ap-btn-save"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="spinner-border spinner-border-sm me-1"></span>
                  ) : (
                    <i
                      className={`bi ${modalMode === "add" ? "bi-plus-lg" : "bi-check-lg"} me-1`}
                    ></i>
                  )}
                  {modalMode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
                </button>
              )}
              {modalMode === "delete" && (
                <button
                  className="btn ap-btn-delete"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="spinner-border spinner-border-sm me-1"></span>
                  ) : (
                    <i className="bi bi-trash me-1"></i>
                  )}
                  Xác nhận xoá
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
