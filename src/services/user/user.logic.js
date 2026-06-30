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

    // FIX HERE: Return gracefully instead of throwing an error
    if (admins.length > 0) {
      return {
        success: true,
        message: "Admin already exists. Skipping initialization.",
        data: admins[0],
      };
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
    // Only log actual errors (e.g., Network failure, Database down)
    console.error("System error during admin initialization:", error);
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
