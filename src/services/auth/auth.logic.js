import { role } from "../../constants/role.constant";
import { createUser, getUsers } from "../user/user.service";

export const loginRequest = async ({ email, password }) => {
  const users = await getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const registerRequest = async ({ fullName, email, password }) => {
  const users = await getUsers();

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const userData = {
    fullName,
    email,
    password,
    avatar: "/profile.png",
    role: role.CUSTOMER,
    address: "",
    phone: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const newUser = await createUser(userData);

  return newUser;
}
