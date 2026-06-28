import { role } from "../../constants/role.constant";
import {
  createUser,
  getUserById,
  getUserByRole,
  updateUser,
} from "./user.service";

export const checkAndCreateAdmin = async () => {
  try {
    const admins = await getUserByRole(role.ADMIN);

    if (admins.length > 0) {
      throw new Error("Admin already exists");
    }

    const userData = {
      fullName: "Admin",
      email: "admin@gmail.com",
      password: "123456",
      role: role.ADMIN,
      avatar: "/profile.png",
      address: "Thai Binh",
      phone: "04952864395",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const admin = await createUser(userData);

    return {
      success: true,
      message: "Admin account created successfully",
      data: admin,
    };
  } catch (error) {
    throw new Error("Error in checkAndCreateAdmin: " + error);
  }
};

export const updateProfileLogic = async (data) => {
  try {
    const { id, payload } = data;

    const user = await getUserById(id);

    if (!user) {
      throw new Error("Can not find user by id " + id);
    }

    const newData = {
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = await updateUser(id, newData);

    return updatedUser;
  } catch (error) {
    throw new Error("Error in updateProfileLogic: " + error.message);
  }
};

export const getUserByIdLogic = async (userId) => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      throw new Error("Can not find user");
    }
    return user;
  } catch (error) {
    throw new Error("Error in getUserByIdLogic: " + error);
  }
};
