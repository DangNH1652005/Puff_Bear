import { role } from "../../constants/role.constant";
import instance from "../../libs/axios";

export async function getUsers() {
  const res = await instance.get("/users");
  return res.data;
}

export async function getUserById(id) {
  const res = await instance.get(`/users/${id}`);
  return res.data;
}

// ─── LẤY ĐƠN HÀNG CỦA USER ───────────────────────────────────────────────────
export async function getUserOrders(userId) {
  const res = await instance.get("/orders", { params: { userId } });
  return res.data;
}

// ─── STATS ────────────────────────────────────────────────────────────────────
export async function getUserStats() {
  const users = await getUsers();
  const countByRole = (role) =>
    users.filter((u) => u.role === role).length;
  return {
    total: users.length,
    admin: countByRole(role.ADMIN),
    staff: countByRole(role.STAFF),
    customer: countByRole(role.CUSTOMER),
  };
}

export const createUser = async (data) => {
  const res = await instance.post("/users", data)
  return res.data;
}

export const getUserByRole = async (role) => {
  const res = await instance.get("/users", {
    params: { role }
  })
  return res.data;
}

export const updateUser = async (userId, data) => {
  const res = await instance.patch(`/users/${userId}`, data);
  return res.data;
}


