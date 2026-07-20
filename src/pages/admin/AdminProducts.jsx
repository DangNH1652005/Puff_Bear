import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from "../../services/product/product.service";
import "../../styles/admin/AdminProducts.css";
import { getAllCategories } from "../../services/category/category.service";
import { getAllSizes } from "../../services/size/size.service";
import { getAllColors } from "../../services/color/color.service";
import { productStatus } from "../../constants/productStatus.constant";

import ProductStats from "../../components/admin/products/ProductStats";
import ProductFilter from "../../components/admin/products/ProductFilter";
import ProductTable from "../../components/admin/products/ProductTable";
import ProductModals from "../../components/admin/products/ProductModals";

const EMPTY_FORM = {
  name: "",
  price: "",
  stock: "",
  categoryId: "",
  status: productStatus.ACTIVE,
  mainImageUrl: "",
  imageUrl: [],
  description: "",
  sizeId: [],
  colorId: [],
};

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "đ";
const PER_PAGE = 8;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
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
      const [prods, st, catsRes, sizesRes, colorsRes] =
        await Promise.all([
          getProducts(),
          getProductStats(),
          getAllCategories(),
          getAllSizes(),
          getAllColors(),
        ]);
      setProducts(prods);
      setStats(st);
      setCategories(catsRes);
      setSizes(sizesRes);
      setColors(colorsRes);
    } catch {
      showToast(
        "❌ Không thể kết nối server. Hãy chạy: npm run server",
        "danger"
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
    setForm({
      ...EMPTY_FORM,
      ...p,
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      sizeId: p.sizeId || [],
      colorId: p.colorId || [],
      name: p.name || "",
      description: p.description || "",
      mainImageUrl: p.mainImageUrl || "",
    });
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

  // 2. Validate Realtime
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 1. Hàm validate mở rộng
  const validate = () => {
    const e = {};

    // Tên sản phẩm
    const name = form.name || "";
    if (!name.trim()) {
      e.name = "Tên sản phẩm không được để trống";
    } else if (name.trim().length < 3) {
      e.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
    } else if (name.length > 100) {
      e.name = "Tên sản phẩm tối đa 100 ký tự";
    }

    // Giá
    if (form.price === "") {
      e.price = "Vui lòng nhập giá";
    } else if (isNaN(form.price)) {
      e.price = "Giá phải là số";
    } else if (Number(form.price) <= 0) {
      e.price = "Giá phải lớn hơn 0";
    } else if (Number(form.price) > 100000000) {
      e.price = "Giá không được vượt quá 100.000.000 VNĐ";
    }

    // Tồn kho
    if (form.stock === "") {
      e.stock = "Vui lòng nhập tồn kho";
    } else if (isNaN(form.stock)) {
      e.stock = "Tồn kho phải là số";
    } else if (Number(form.stock) < 0) {
      e.stock = "Tồn kho không được âm";
    } else if (!Number.isInteger(Number(form.stock))) {
      e.stock = "Tồn kho phải là số nguyên";
    } else if (Number(form.stock) > 1000) {
      e.stock = "Tồn kho tối đa là 1000";
    }

    // Thể loại
    if (!form.categoryId) {
      e.categoryId = "Vui lòng chọn thể loại";
    }

    // URL ảnh
    const mainImageUrl = form.mainImageUrl || "";
    if (!mainImageUrl.trim()) {
      e.mainImageUrl = "Vui lòng nhập URL hình ảnh";
    } else {
      const urlRegex = /^https?:\/\/.+/i;
      if (!urlRegex.test(mainImageUrl)) {
        e.mainImageUrl = "URL không hợp lệ";
      }
    }

    // Mô tả
    const description = form.description || "";
    if (!description.trim()) {
      e.description = "Vui lòng nhập mô tả";
    } else if (description.length < 10) {
      e.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    // Size
    if (!form.sizeId || form.sizeId.length === 0) {
      e.sizeId = "Chọn ít nhất 1 kích thước";
    }

    // Color
    if (!form.colorId || form.colorId.length === 0) {
      e.colorId = "Chọn ít nhất 1 màu";
    }

    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);

    // Clean up empty lines from imageUrl
    const finalForm = {
      ...form,
      imageUrl: (form.imageUrl || []).filter(u => u.trim() !== "")
    };

    try {
      if (modalMode === "add") {
        await addProduct(finalForm);
        showToast("✅ Thêm sản phẩm thành công!");
      } else {
        await updateProduct(selected.id, finalForm);
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
    return c ? c.type : "—";
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
      if (sortBy === "price") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "stock") return (a.stock || 0) - (b.stock || 0);
      if (sortBy === "sold") return (b.sold || 0) - (a.sold || 0);
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

      <ProductStats stats={stats} />

      <ProductFilter
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        filterCat={filterCat}
        setFilterCat={setFilterCat}
        categories={categories}
        filterSt={filterSt}
        setFilterSt={setFilterSt}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filteredLength={filtered.length}
      />

      <ProductTable
        paged={paged}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        PER_PAGE={PER_PAGE}
        loading={loading}
        openView={openView}
        openEdit={openEdit}
        openDel={openDel}
        catName={catName}
      />

      <ProductModals
        modalMode={modalMode}
        closeModal={closeModal}
        selected={selected}
        catName={catName}
        sizes={sizes}
        colors={colors}
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        saving={saving}
        categories={categories}
      />
    </div>
  );
}