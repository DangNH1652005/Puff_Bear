import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  getUsers,
  getRoles,
  toggleUserActive,
  getUserOrders,
  getUserStats,
} from "../../store/userStore";
import "./AdminUserManager.css";

const PER_PAGE = 8;

function formatMoney(n) {
  if (!n) return "0đ";
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
}

export default function AdminUserManager() {

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);

  // Modal
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [saving, setSaving] = useState(false);

  // load data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const usersData = await getUsers();
      const rolesData = await getRoles();
      const statsData = await getUserStats();
      setUsers(usersData);
      setRoles(rolesData);
      setStats(statsData);
    } catch (error) {
      toast.error("Không thể kết nối server. Hãy chạy: npm run server");
    } finally {
      setLoading(false);
    }
  }

  // get role
  function getRoleName(user) {
    const role = roles.find((r) => r.id === user.roleId);
    if (role) return role.name;
    return "customer";
  }

  // get role's color
  function getRoleBadgeClass(name) {
    if (name === "admin") return "au-role-admin";
    if (name === "staff") return "au-role-staff";
    return "au-role-customer";
  }
  // get index 0 of name for avatar fallback (if user haven't set avatar)
  function getInitial(name) {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  }

  // Modal xem chi tiết user, load luôn orders của user đó để hiển thị trong modal
  async function openViewModal(user) {
    setSelectedUser(user);
    setModalType("view");
    try {
      const orders = await getUserOrders(user.id);
      setUserOrders(orders);
    } catch {
      setUserOrders([]);
    }
  }

  function openLockModal(user) {
    setSelectedUser(user);
    setModalType("lock");
  }

  function closeModal() {
    setModalType("");
  }

  // lock or unlock user
  async function handleToggleLock() {
    setSaving(true);
    try {  
      const locked = selectedUser.isActive === false;
      await toggleUserActive(selectedUser.id, locked);

      if (locked) {
        toast.success("Đã mở khoá tài khoản!");
      } else {
        toast.success("Đã khoá tài khoản!");
      }

      await loadData();
      closeModal();
    } catch {
      toast.error("Lỗi server!");
    }
    setSaving(false);
  }

  // loc và filter users theo search + tab
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    const name = (user.fullName || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = user.phone || "";
    const matchSearch =
      name.includes(q) || email.includes(q) || phone.includes(q);

    let matchTab = true;
    if (tab === "locked") {
      matchTab = user.isActive === false;
    } else if (tab !== "all") {
      matchTab = getRoleName(user) === tab;
    }

    return matchSearch && matchTab;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));
  const pagedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // toltalSpent 
  let totalSpent = 0;
  userOrders.forEach((order) => {
    if (order.status === "delivered") {
      totalSpent += order.total || 0;
    }
  });

  // user is locked or not for showing in lock/unlock modal
  const selectedIsLocked = selectedUser && selectedUser.isActive === false;

  // render
  return (
    <div className="au-page">

      {/* Title */}
      <div className="mb-4">
        <h4 className="au-title mb-0">Quản lý Người dùng</h4>
        <p className="au-sub text-muted mb-0">
          Xem thông tin và quản lý trạng thái tài khoản
        </p>
      </div>

      {/* 4 statistical boxes */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="au-stat-card">
            <span className="au-stat-emoji">🧸</span>
            <div className="au-stat-value">{stats.total ?? "…"}</div>
            <div className="au-stat-label">Tổng người dùng</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="au-stat-card">
            <span className="au-stat-emoji">🌸</span>
            <div className="au-stat-value">{stats.admin ?? "…"}</div>
            <div className="au-stat-label">Admin</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="au-stat-card">
            <span className="au-stat-emoji">🌷</span>
            <div className="au-stat-value">{stats.staff ?? "…"}</div>
            <div className="au-stat-label">Staff</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="au-stat-card">
            <span className="au-stat-emoji">🌼</span>
            <div className="au-stat-value">{stats.customer ?? "…"}</div>
            <div className="au-stat-label">Customer</div>
          </div>
        </div>
      </div>

      {/* Tabs lọc theo role */}
      <div className="au-tabs mb-4">
        <button
          className={tab === "all" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("all"); setPage(1); }}>
          Tất cả
        </button>
        <button
          className={tab === "admin" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("admin"); setPage(1); }}>
          Admin
        </button>
        <button
          className={tab === "staff" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("staff"); setPage(1); }}>
          Staff
        </button>
        <button
          className={tab === "customer" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("customer"); setPage(1); }}>
          Customer
        </button>
        <button
          className={tab === "locked" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("locked"); setPage(1); }}>
          Đã khoá
        </button>
      </div>

      {/* search */}
      <div className="card au-filter-card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-center">
          <div className="au-search-box">
            <i className="bi bi-search"></i>
            <input
              placeholder="Tìm tên, email, SĐT..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <span className="ms-auto text-muted" style={{ fontSize: 13 }}>
            {filteredUsers.length} người dùng
          </span>
        </div>
      </div>

      {/* Bảng users */}
      <div className="card au-table-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "#f2a7bb" }}></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table au-table mb-0">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th style={{ width: 90 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  )}

                  {pagedUsers.map((user) => {
                    const roleName = getRoleName(user);
                    const isLocked = user.isActive === false;

                    return (
                      <tr key={user.id} className="au-table-row">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="au-avatar-fallback">
                              {getInitial(user.fullName)}
                            </div>
                            <div className="au-user-name">{user.fullName}</div>
                          </div>
                        </td>
                        <td className="au-cell-muted">{user.email}</td>
                        <td className="au-cell-muted">{user.phone || "—"}</td>
                        <td>
                          <span className={"au-badge-role " + getRoleBadgeClass(roleName)}>
                            {roleName}
                          </span>
                        </td>
                        <td className="au-cell-muted">{formatDate(user.createdAt)}</td>
                        <td>
                          {isLocked ? (
                            <span className="au-badge-status locked">Đã khoá</span>
                          ) : (
                            <span className="au-badge-status active">Hoạt động</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {/* Nút xem chi tiết */}
                            <button
                              className="au-action-btn view"
                              title="Xem chi tiết"
                              onClick={() => openViewModal(user)}>
                              <i className="bi bi-eye"></i>
                            </button>

                            {/* Nút khoá / mở khoá */}
                            <button
                              className={isLocked ? "au-action-btn unlock" : "au-action-btn lock"}
                              title={isLocked ? "Mở khoá" : "Khoá tài khoản"}
                              onClick={() => openLockModal(user)}>
                              <i className={isLocked ? "bi bi-unlock" : "bi bi-lock"}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted" style={{ fontSize: 13 }}>
              Trang {page} / {totalPages}
            </span>
            <ul className="pagination pagination-sm mb-0">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n} className={n === page ? "page-item active" : "page-item"}>
                  <button className="page-link" onClick={() => setPage(n)}>{n}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* chi tiet */}
      <Modal
        show={modalType === "view"}
        onHide={closeModal}
        centered
        size="lg"
        contentClassName="au-modal">
        <Modal.Header closeButton className="au-modal-header">
          <Modal.Title>
            <i className="bi bi-person-circle me-2"></i>Chi tiết người dùng
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedUser && (
            <div className="row g-3">
              {/* Cột trái: avatar + tên */}
              <div className="col-md-4 text-center">
                <div className="au-view-avatar-fallback">
                  {getInitial(selectedUser.fullName)}
                </div>
                <h6 className="fw-bold mt-3 mb-1">{selectedUser.fullName}</h6>
                <span className={"au-badge-role " + getRoleBadgeClass(getRoleName(selectedUser))}>
                  {getRoleName(selectedUser)}
                </span>
              </div>

              
              <div className="col-md-8">
                <div className="au-detail-box mb-3">
                  <div className="au-detail-box-title">
                    <i className="bi bi-info-circle me-2"></i>Thông tin
                  </div>
                  <div className="au-detail-row">
                    <span>Email:</span><strong>{selectedUser.email}</strong>
                  </div>
                  <div className="au-detail-row">
                    <span>SĐT:</span><strong>{selectedUser.phone || "—"}</strong>
                  </div>
                  <div className="au-detail-row">
                    <span>Địa chỉ:</span><strong>{selectedUser.address || "—"}</strong>
                  </div>
                  <div className="au-detail-row">
                    <span>Ngày tạo:</span><strong>{formatDate(selectedUser.createdAt)}</strong>
                  </div>
                </div>

                <div className="au-detail-box">
                  <div className="au-detail-box-title">
                    <i className="bi bi-bag me-2"></i>
                    Đơn hàng ({userOrders.length})
                    <span className="au-total-spent">
                      Tổng chi tiêu: {formatMoney(totalSpent)}
                    </span>
                  </div>

                  {userOrders.length === 0 ? (
                    <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                      Chưa có đơn hàng nào
                    </p>
                  ) : (
                    userOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="au-order-row">
                        <span className="au-order-id">#{order.id}</span>
                        <span className="au-order-date">{formatDate(order.createdAt)}</span>
                        <span className="au-order-total">{formatMoney(order.total)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className="btn au-btn-cancel" onClick={closeModal}>Đóng</button>
        </Modal.Footer>
      </Modal>

      {/* lock/unlock */}
      <Modal
        show={modalType === "lock"}
        onHide={closeModal}
        centered
        contentClassName="au-modal">
        <Modal.Header closeButton className="au-modal-header">
          <Modal.Title>
            {selectedIsLocked ? (
              <><i className="bi bi-unlock me-2"></i>Mở khoá tài khoản</>
            ) : (
              <><i className="bi bi-lock me-2"></i>Khoá tài khoản</>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedUser && (
            <div className="text-center py-3">
              <div className={selectedIsLocked ? "au-lock-icon unlock mb-3" : "au-lock-icon mb-3"}>
                <i className={selectedIsLocked ? "bi bi-unlock-fill" : "bi bi-lock-fill"}></i>
              </div>
              <h6>
                {selectedIsLocked ? "Mở khoá tài khoản này?" : "Khoá tài khoản này?"}
              </h6>
              <p className="text-muted mb-0">
                <strong>{selectedUser.fullName}</strong>{" "}
                {selectedIsLocked
                  ? "sẽ đăng nhập lại được bình thường."
                  : "sẽ không thể đăng nhập cho đến khi được mở khoá."}
              </p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className="btn au-btn-cancel" onClick={closeModal} disabled={saving}>
            Đóng
          </button>
          <button className="btn au-btn-save" onClick={handleToggleLock} disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm me-1"></span>}
            {selectedIsLocked ? "Mở khoá" : "Khoá tài khoản"}
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}