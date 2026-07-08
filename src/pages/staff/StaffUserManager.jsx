import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getUsers, getUserStats } from "../../services/user/user.service";
import { role } from "../../constants/role.constant";
import { formatDate, getInitial } from "../../utils/format";
import UserModal from "../../components/admin/UserModal";
import "../../styles/admin/AdminUserManager.css";

const PER_PAGE = 8;

// Lấy class màu badge theo role
function getRoleBadgeClass(name) {
  if (name === role.ADMIN) return "au-role-admin";
  if (name === role.STAFF) return "au-role-staff";
  return "au-role-customer";
}

export default function StaffUserManager() {
  // ===== STATE =====
  const [users, setUsers]     = useState([]);
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [tab, setTab]       = useState("all");
  const [page, setPage]     = useState(1);

  // Modal: "" = đóng, "view" | "lock"
  const [modalType, setModalType]       = useState("");
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

  // ===== MỞ MODAL =====
  function openView(user) { setSelectedUser(user); setModalType("view"); }
  function openLock(user) { setSelectedUser(user); setModalType("lock"); }
  function closeModal()   { setModalType(""); }

  // ===== HELPER =====
  function getRoleName(user) {
    return user.role || role.CUSTOMER;
  }

  // ===== LỌC =====
  // Staff chỉ xem customer và staff khác — KHÔNG thấy admin
  const visibleUsers = users.filter((user) => getRoleName(user) !== role.ADMIN);

  const filteredUsers = visibleUsers.filter((user) => {
    const q = search.toLowerCase();
    const name = (user.fullName || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = user.phone || "";
    const matchSearch = name.includes(q) || email.includes(q) || phone.includes(q);

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

  // ===== RENDER =====
  return (
    <div className="au-page">

      {/* Tiêu đề (KHÔNG có nút thêm nhân viên) */}
      <div className="mb-4">
        <h4 className="au-title mb-0">Quản lý Người dùng</h4>
        <p className="au-sub text-muted mb-0">Xem thông tin và khoá tài khoản khách hàng</p>
      </div>

      {/* Thống kê: chỉ Staff và Customer */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-sm-6">
          <div className="au-stat-card">
            <span className="au-stat-emoji">🌷</span>
            <div className="au-stat-value">{stats.staff ?? "…"}</div>
            <div className="au-stat-label">Nhân viên</div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="au-stat-card">
            <span className="au-stat-emoji">🌼</span>
            <div className="au-stat-value">{stats.customer ?? "…"}</div>
            <div className="au-stat-label">Khách hàng</div>
          </div>
        </div>
      </div>

      {/* Tabs lọc (không có Admin) */}
      <div className="au-tabs mb-4">
        <button className={tab === "all" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("all"); setPage(1); }}>Tất cả</button>
        <button className={tab === "staff" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("staff"); setPage(1); }}>Nhân viên</button>
        <button className={tab === "customer" ? "au-tab-btn active" : "au-tab-btn"}
          onClick={() => { setTab("customer"); setPage(1); }}>Khách hàng</button>
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
                    const isLocked = user.status === "inactive";
                    // Staff CHỈ khoá được customer
                    const canLock = roleName === role.CUSTOMER;

                    return (
                      <tr key={user.id} className="au-table-row">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="au-avatar-fallback">{getInitial(user.fullName)}</div>
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
                          <span className={`au-badge-status ${isLocked ? "locked" : "active"}`}>
                            {isLocked ? "Đã khoá" : "Hoạt động"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {/* Xem chi tiết — mọi user */}
                            <button className="au-action-btn view" title="Xem chi tiết"
                              onClick={() => openView(user)}>
                              <i className="bi bi-eye"></i>
                            </button>

                            {/* Khoá — CHỈ customer */}
                            {canLock && (
                              <button
                                className={isLocked ? "au-action-btn unlock" : "au-action-btn lock"}
                                title={isLocked ? "Mở khoá" : "Khoá tài khoản"}
                                onClick={() => openLock(user)}>
                                <i className={isLocked ? "bi bi-unlock" : "bi bi-lock"}></i>
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

      {/* Modal — chỉ dùng view + lock */}
      <UserModal
        mode={modalType}
        user={selectedUser}
        onClose={closeModal}
        onSaved={loadData}
      />
    </div>
  );
}