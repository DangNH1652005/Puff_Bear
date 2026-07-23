import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { createUser, updateUser, getUserOrders, deleteUser } from "../../services/user/user.service";
import { role } from "../../constants/role.constant";
import { ORDER_STATUS } from "../../constants/orderStatus.constant";
import { formatMoney, formatDate, getInitial } from "../../utils/format";

// Form rỗng khi thêm staff mới
const EMPTY_FORM = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  role: "staff",
};



export default function UserModal({
  mode,        // "view" | "add" | "edit" | "lock" | ""
  user,        // user đang chọn (null nếu thêm mới)
  users,       // danh sách người dùng để kiểm tra trùng lặp
  onClose,
  onSaved,     // gọi lại loadData() ở cha sau khi lưu
}) {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [orders, setOrders]     = useState([]);

  // Khi mở modal: đổ dữ liệu tuỳ theo chế độ
  useEffect(() => {
    if (mode === "edit" && user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        password: user.password || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "customer",
      });
    } else if (mode === "add") {
      setForm(EMPTY_FORM);
    }
    setErrors({});

    // Nếu xem chi tiết thì tải đơn hàng của user
    if (mode === "view" && user) {
      getUserOrders(user.id)
        .then((data) => setOrders(data))
        .catch(() => setOrders([]));
    }
  }, [mode, user]);

  // Cập nhật ô input
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  }

  // Kiểm tra dữ liệu
  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    
    // Kiểm tra email
    if (!form.email.trim()) {
      e.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@gmail\.com$/.test(form.email)) {
      e.email = "Email phải có định dạng ...@gmail.com";
    } else {
      const isDuplicateEmail = (users || []).some(
        (u) => u.email === form.email && u.id !== user?.id
      );
      if (isDuplicateEmail) {
        e.email = "Email này đã tồn tại trong hệ thống";
      }
    }

    // Password chỉ bắt buộc khi thêm mới
    if (mode === "add" && !form.password.trim()) {
      e.password = "Vui lòng nhập mật khẩu";
    }

    // Kiểm tra số điện thoại
    if (!form.phone.trim()) {
      e.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10}$/.test(form.phone)) {
      e.phone = "Số điện thoại phải gồm đúng 10 chữ số (không chứa ký tự)";
    } else {
      const isDuplicatePhone = (users || []).some(
        (u) => u.phone === form.phone && u.id !== user?.id
      );
      if (isDuplicatePhone) {
        e.phone = "Số điện thoại này đã tồn tại trong hệ thống";
      }
    }

    return e;
  }

  // Lưu (thêm staff hoặc sửa user)
  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      if (mode === "add") {
        // Thêm staff mới
        await createUser({
          ...form,
          avatar: "/profile.png",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success("Thêm nhân viên thành công!");
      } else {
        // Sửa thông tin user
        await updateUser(user.id, {
          ...form,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Cập nhật thành công!");
      }
      await onSaved();
      onClose();
    } catch {
      toast.error("Lỗi server!");
    }
    setSaving(false);
  }

  // Khoá / mở khoá tài khoản
  async function handleToggleLock() {
    setSaving(true);
    try {
      const dangBiKhoa = user.status === "inactive";
      const newStatus = dangBiKhoa ? "active" : "inactive";
      await updateUser(user.id, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      toast.success(dangBiKhoa ? "Đã mở khoá tài khoản!" : "Đã khoá tài khoản!");
      await onSaved();
      onClose();
    } catch {
      toast.error("Lỗi server!");
    }
    setSaving(false);
  }

  // Xoá tài khoản
  async function handleDelete() {
    setSaving(true);
    try {
      await deleteUser(user.id);
      toast.success("Đã xoá tài khoản thành công!");
      await onSaved();
      onClose();
    } catch {
      toast.error("Lỗi server hoặc tài khoản đang có dữ liệu liên kết!");
    }
    setSaving(false);
  }

  // Tổng chi tiêu (chỉ tính đơn đã giao)
  let totalSpent = 0;
  orders.forEach((o) => {
    if (o.status === ORDER_STATUS.DELIVERED) totalSpent += o.total || 0;
  });

  const isForm = mode === "add" || mode === "edit";
  const isLocked = user && user.status === "inactive";

  return (
    <Modal show={!!mode} onHide={onClose} centered
      size={mode === "view" ? "lg" : undefined} contentClassName="au-modal">

      {/* Header */}
      <Modal.Header closeButton className="au-modal-header">
        <Modal.Title>
          {mode === "view" && <><i className="bi bi-person-circle me-2"></i>Chi tiết người dùng</>}
          {mode === "add"  && <><i className="bi bi-person-plus me-2"></i>Thêm nhân viên</>}
          {mode === "edit" && <><i className="bi bi-pencil-square me-2"></i>Chỉnh sửa tài khoản</>}
          {mode === "lock" && (isLocked
            ? <><i className="bi bi-unlock me-2"></i>Mở khoá tài khoản</>
            : <><i className="bi bi-lock me-2"></i>Khoá tài khoản</>)}
          {mode === "delete" && <><i className="bi bi-trash me-2"></i>Xoá tài khoản</>}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* XEM CHI TIẾT */}
        {mode === "view" && user && (
          <div className="row g-3">
            <div className="col-md-4 text-center">
              {user.avatar ? (
                <div className="au-view-avatar">
                  <img src={user.avatar} alt="avatar" />
                </div>
              ) : (
                <div className="au-view-avatar-fallback">{getInitial(user.fullName)}</div>
              )}
              <h6 className="fw-bold mt-3 mb-1">{user.fullName}</h6>
              <span className={`au-badge-role au-role-${user.role}`}>{user.role}</span>
              <div className="mt-2">
                <span className={`au-badge-status ${isLocked ? "locked" : "active"}`}>
                  {isLocked ? "Đã khoá" : "Hoạt động"}
                </span>
              </div>
            </div>
            <div className="col-md-8">
              <div className="au-detail-box mb-3">
                <div className="au-detail-box-title"><i className="bi bi-info-circle me-2"></i>Thông tin</div>
                <div className="au-detail-row"><span>Email:</span><strong>{user.email}</strong></div>
                <div className="au-detail-row"><span>SĐT:</span><strong>{user.phone || "—"}</strong></div>
                <div className="au-detail-row"><span>Địa chỉ:</span><strong>{user.address || "—"}</strong></div>
                <div className="au-detail-row"><span>Ngày tạo:</span><strong>{formatDate(user.createdAt)}</strong></div>
              </div>
              <div className="au-detail-box">
                <div className="au-detail-box-title">
                  <i className="bi bi-bag me-2"></i>Đơn hàng ({orders.length})
                  <span className="au-total-spent">Tổng chi tiêu: {formatMoney(totalSpent)}</span>
                </div>
                {orders.length === 0 ? (
                  <p className="text-muted mb-0" style={{ fontSize: 13 }}>Chưa có đơn hàng nào</p>
                ) : (
                  orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="au-order-row">
                      <span className="au-order-id">#{o.id}</span>
                      <span className="au-order-date">{formatDate(o.createdAt)}</span>
                      <span className="au-order-total">{formatMoney(o.total)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* THÊM / SỬA */}
        {isForm && (
          <div className="row g-3">
            <div className="col-12">
              <label className="au-label">Họ tên *</label>
              <input
                className={`form-control au-input ${errors.fullName ? "is-invalid" : ""}`}
                name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="VD: Nguyễn Văn A"
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

            <div className="col-md-6">
              <label className="au-label">Email *</label>
              <input
                className={`form-control au-input ${errors.email ? "is-invalid" : ""}`}
                name="email" value={form.email} onChange={handleChange}
                placeholder="email@gmail.com"
                disabled={mode === "edit"}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="au-label">Mật khẩu {mode === "add" ? "*" : ""}</label>
              <input
                className={`form-control au-input ${errors.password ? "is-invalid" : ""}`}
                name="password" value={form.password} onChange={handleChange}
                placeholder="••••••"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="col-md-6">
              <label className="au-label">Số điện thoại *</label>
              <input
                className={`form-control au-input ${errors.phone ? "is-invalid" : ""}`}
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="0900000000"
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="col-md-6">
              <label className="au-label">Vai trò *</label>
              <select
                className="form-select au-input"
                name="role" value={form.role} onChange={handleChange}
              >
                <option value={role.STAFF}>Staff</option>
                <option value={role.ADMIN}>Admin</option>
                {mode === "edit" && <option value={role.CUSTOMER}>Customer</option>}
              </select>
            </div>

            <div className="col-12">
              <label className="au-label">Địa chỉ</label>
              <input
                className="form-control au-input"
                name="address" value={form.address} onChange={handleChange}
                placeholder="Hà Nội"
              />
            </div>
          </div>
        )}

        {/* KHOÁ / MỞ KHOÁ */}
        {mode === "lock" && user && (
          <div className="text-center py-3">
            <div className={`au-lock-icon mb-3 ${isLocked ? "unlock" : ""}`}>
              <i className={`bi ${isLocked ? "bi-unlock-fill" : "bi-lock-fill"}`}></i>
            </div>
            <h6>{isLocked ? "Mở khoá tài khoản này?" : "Khoá tài khoản này?"}</h6>
            <p className="text-muted mb-0">
              <strong>{user.fullName}</strong>{" "}
              {isLocked
                ? "sẽ đăng nhập lại được bình thường."
                : "sẽ không thể đăng nhập cho đến khi được mở khoá."}
            </p>
          </div>
        )}

        {/* XOÁ TÀI KHOẢN */}
        {mode === "delete" && user && (
          <div className="text-center py-3">
            <div className="au-lock-icon mb-3" style={{ color: "#dc3545", backgroundColor: "#f8d7da" }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h6>Bạn có chắc chắn muốn xoá tài khoản này?</h6>
            <p className="text-danger mb-0">
              <strong>{user.fullName}</strong>{" "}
              sẽ bị xoá vĩnh viễn khỏi hệ thống. Hành động này không thể hoàn tác!
            </p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button className="btn au-btn-cancel" onClick={onClose} disabled={saving}>Đóng</button>

        {isForm && (
          <button className="btn au-btn-save" onClick={handleSubmit} disabled={saving}>
            {saving
              ? <span className="spinner-border spinner-border-sm me-1"></span>
              : <i className={`bi ${mode === "add" ? "bi-person-plus" : "bi-check-lg"} me-1`}></i>}
            {mode === "add" ? "Thêm nhân viên" : "Lưu thay đổi"}
          </button>
        )}

        {mode === "lock" && (
          <button className="btn au-btn-save" onClick={handleToggleLock} disabled={saving}>
            {saving
              ? <span className="spinner-border spinner-border-sm me-1"></span>
              : <i className={`bi ${isLocked ? "bi-unlock" : "bi-lock"} me-1`}></i>}
            {isLocked ? "Mở khoá" : "Khoá tài khoản"}
          </button>
        )}

        {mode === "delete" && (
          <button className="btn btn-danger au-btn-save" onClick={handleDelete} disabled={saving} style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}>
            {saving
              ? <span className="spinner-border spinner-border-sm me-1"></span>
              : <i className="bi bi-trash me-1"></i>}
            Xác nhận xoá
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}