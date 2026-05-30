import { createUser, getUsers } from "./auth.service";

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

  const userData = {
    fullName,
    email,
    password,
    roleId: 3, // default: customer
    createdAt: new Date().toISOString(),
    avatar: "/profile.png"
  };

  const newUser = await createUser(userData);

  return newUser;
}