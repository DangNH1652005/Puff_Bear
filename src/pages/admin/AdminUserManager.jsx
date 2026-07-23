import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getUsers, getUserStats } from "../../services/user/user.service";
import { role } from "../../constants/role.constant";
import { formatDate, getInitial } from "../../utils/format";
import UserModal from "../../components/admin/UserModal";
import { useAuthStore } from "../../store/auth.store";
import "../../styles/admin/AdminUserManager.css";

const PER_PAGE = 8;



export default function AdminUserManager() {
  const currentUser = useAuthStore((state) => state.user);

  // ===== STATE =====
  const [users, setUsers]     = useState([]);
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [tab, setTab]       = useState("all");
  const [page, setPage]     = useState(1);

  // Modal: "" = đóng, "view" | "add" | "edit" | "lock"
  const [modalType, setModalType]     = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // ===== LOAD DATA =====
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const usersData = await getUsers();
      const statsData = await getUserStats();
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      toast.error("Không thể kết nối server. Hãy chạy: npm run server");
    } finally {
      setLoading(false);
    }
  }

  // Mở modal
  function openView(user) { setSelectedUser(user); setModalType("view"); }
  function openAdd()      { setSelectedUser(null); setModalType("add"); }
  function openEdit(user) { setSelectedUser(user); setModalType("edit"); }
  function openLock(user) { setSelectedUser(user); setModalType("lock"); }
  function openDelete(user){ setSelectedUser(user); setModalType("delete"); }
  function closeModal()   { setModalType(""); }

  // Helper
  function getRoleName(user) {
    return user.role || role.CUSTOMER;
  }

  // Lọc
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    const name = (user.fullName || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = user.phone || "";
    const matchSearch = name.includes(q) || email.includes(q) || phone.includes(q);

    // Tab locked lọc tài khoản bị khoá, còn lại lọc theo role
    let matchTab = true;
    if (tab === "locked") {
      matchTab = user.status === "inactive";
    } else if (tab !== "all") {
      matchTab = getRoleName(user) === tab;
    }
    return matchSearch && matchTab;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));
  const pagedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Render
  return (
    <div className="au-page">

      {/* Tiêu đề + nút thêm staff */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="au-title mb-0">Quản lý Người dùng</h4>
          <p className="au-sub text-muted mb-0">Xem thông tin và quản lý trạng thái tài khoản</p>
        </div>
        <button className="btn au-btn-add" onClick={openAdd}>
          <i className="bi bi-person-plus me-2"></i>Thêm nhân viên
        </button>
      </div>

      {/* 4 ô thống kê */}
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

      {/* Tabs lọc */}
      <div className="au-tabs mb-4">
        <button className={tab === "all" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("all"); setPage(1); }}>Tất cả</button>
        <button className={tab === "admin" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("admin"); setPage(1); }}>Admin</button>
        <button className={tab === "staff" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("staff"); setPage(1); }}>Staff</button>
        <button className={tab === "customer" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("customer"); setPage(1); }}>Customer</button>
        <button className={tab === "locked" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("locked"); setPage(1); }}>Đã khoá</button>
      </div>

      {/* Tìm kiếm */}
      <div className="card au-filter-card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-center">
          <div className="au-search-box">
            <i className="bi bi-search"></i>
            <input placeholder="Tìm tên, email, SĐT..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <span className="ms-auto text-muted" style={{ fontSize: 13 }}>
            {filteredUsers.length} người dùng
          </span>
        </div>
      </div>

      {/* Bảng */}
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
                    <th style={{ width: 120 }}>Thao tác</th>
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
                    const isLocked = user.status === "inactive";
                    // Admin không cho khoá / sửa chính admin khác
                    const isAdmin = roleName === role.ADMIN;
                    const isMe = user.id === currentUser?.id;

                    return (
                      <tr key={user.id} className="au-table-row">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {user.avatar ? (
                              <img src={user.avatar} alt="avatar" className="au-avatar" />
                            ) : (
                              <div className="au-avatar-fallback">{getInitial(user.fullName)}</div>
                            )}
                            <div className="au-user-name">{user.fullName}</div>
                          </div>
                        </td>
                        <td className="au-cell-muted">{user.email}</td>
                        <td className="au-cell-muted">{user.phone || "—"}</td>
                        <td>
                          <span className={`au-badge-role au-role-${roleName}`}>
                            {roleName}
                          </span>
                        </td>
                        <td className="au-cell-muted">{formatDate(user.createdAt)}</td>
                        <td>
                          <span className={`au-badge-status ${isLocked ? "locked" : "active"}`}>
                            {isLocked ? "Đã khoá" : "Hoạt động"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {/* Xem chi tiết */}
                            <button className="au-action-btn view" title="Xem chi tiết"
                              onClick={() => openView(user)}>
                              <i className="bi bi-eye"></i>
                            </button>

                            {/* Sửa + Khoá: không áp dụng cho admin */}
                            {!isAdmin && (
                              <>
                                <button className="au-action-btn edit" title="Chỉnh sửa"
                                  onClick={() => openEdit(user)}>
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className={isLocked ? "au-action-btn unlock" : "au-action-btn lock"}
                                  title={isLocked ? "Mở khoá" : "Khoá tài khoản"}
                                  onClick={() => openLock(user)}>
                                  <i className={isLocked ? "bi bi-unlock" : "bi bi-lock"}></i>
                                </button>
                              </>
                            )}

                            {/* Xoá: áp dụng cho tất cả, trừ chính mình */}
                            {!isMe && (
                              <button className="au-action-btn delete" title="Xoá vĩnh viễn"
                                onClick={() => openDelete(user)} style={{ color: '#dc3545', backgroundColor: '#f8d7da', borderColor: '#f5c2c7' }}>
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
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
            <span className="text-muted" style={{ fontSize: 13 }}>Trang {page} / {totalPages}</span>
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

      {/* Modal (component riêng) */}
      <UserModal
        mode={modalType}
        user={selectedUser}
        users={users}
        onClose={closeModal}
        onSaved={loadData}
      />
    </div>
  );
}