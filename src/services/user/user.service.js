import instance from "../../libs/axios";

// ─── GET ALL ──────────────────────────────────────────────────────────────────
export async function getUsers() {
  const res = await instance.get("/users");
  return res.data;
}

// ─── GET ONE ──────────────────────────────────────────────────────────────────
export async function getUserById(id) {
  const res = await instance.get(`/users/${id}`);
  return res.data;
}

// ─── KHOÁ / MỞ KHOÁ ──────────────────────────────────────────────────────────
export async function toggleUserActive(id, isActive) {
  const res = await instance.patch(`/users/${id}`, { isActive });
  return res.data;
}

// ─── LẤY ROLES ────────────────────────────────────────────────────────────────
export async function getRoles() {
  const res = await instance.get("/roles");
  return res.data;
}

// ─── LẤY ĐƠN HÀNG CỦA USER ───────────────────────────────────────────────────
export async function getUserOrders(userId) {
  const res = await instance.get("/orders", { params: { userId } });
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