import { createUser, getUsers } from "./auth.service";
import { getRoles } from "../role/role.service";

export const loginRequest = async ({ email, password }) => {
  const users = await getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  return user;
};

export const registerRequest = async({ fullName, email, password }) => {
  const users = await getUsers();

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  // Get dynamic roleId for customer
  const roles = await getRoles();
  const customerRole = roles.find(r => r.name === "customer");
  
  if (!customerRole) {
    throw new Error("Hệ thống chưa khởi tạo role customer");
  }

  const userData = {
    fullName,
    email,
    password,
    roleId: customerRole.id,
    createdAt: new Date().toISOString(),
    avatar: "/profile.png"
  };

  const newUser = await createUser(userData);

  return newUser;
}