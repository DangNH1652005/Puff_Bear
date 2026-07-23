import { create } from "zustand";
import { loginRequest, registerRequest } from "../services/auth/auth.logic";
import { getUserById } from "../services/user/user.service";
import toast from "react-hot-toast";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  restoreSession: async () => {
    const storedUser = getStoredUser();

    if (!storedUser?.id) {
      localStorage.removeItem("user");
      set({
        user: null,
        loading: false,
      });
      return;
    }

    try {
      const freshUser = await getUserById(storedUser.id);

      if (!freshUser) {
        throw new Error("User not found");
      }

      // Người dùng đã sửa role trong localStorage
      if (storedUser.role !== freshUser.role) {
        localStorage.removeItem("user");

        toast.error("Bạn không được sửa role.");

        set({
          user: null,
          loading: false,
        });

        return;
      }

      localStorage.setItem("user", JSON.stringify(freshUser));

      set({
        user: freshUser,
        loading: false,
      });
    } catch {
      localStorage.removeItem("user");

      set({
        user: null,
        loading: false,
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const user = await loginRequest({ email, password });
      localStorage.setItem("user", JSON.stringify(user));
      set({
        user,
        loading: false,
      });

      return user;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (fullName, email, password) => {
    set({ loading: true });

    try {
      const user = await registerRequest({ fullName, email, password });
      localStorage.setItem("user", JSON.stringify(user));
      set({
        user,
        loading: false,
      });

      return user;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({
      user: null,
    });
  },
}));
