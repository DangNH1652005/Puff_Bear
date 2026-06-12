import api from "../services/api";

// ─── GET ALL ──────────────────────────────────────────────────────────────────
export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

// ─── GET ONE ──────────────────────────────────────────────────────────────────
export async function getUserById(id) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

// ─── KHOÁ / MỞ KHOÁ ──────────────────────────────────────────────────────────
export async function toggleUserActive(id, isActive) {
  const res = await api.patch(`/users/${id}`, { isActive });
  return res.data;
}

// ─── LẤY ROLES ────────────────────────────────────────────────────────────────
export async function getRoles() {
  const res = await api.get("/roles");
  return res.data;
}

// ─── LẤY ĐƠN HÀNG CỦA USER ───────────────────────────────────────────────────
export async function getUserOrders(userId) {
  const res = await api.get("/orders", { params: { userId } });
  return res.data;
}

// ─── STATS ────────────────────────────────────────────────────────────────────
export async function getUserStats() {
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);

  const roleNameById = {};
  roles.forEach((r) => { roleNameById[r.id] = r.name; });

  const countByRole = (name) =>
    users.filter((u) => roleNameById[u.roleId] === name).length;

  return {
    total:    users.length,
    admin:    countByRole("admin"),
    staff:    countByRole("staff"),
    customer: countByRole("customer"),
    locked:   users.filter((u) => u.isActive === false).length,
  };
}