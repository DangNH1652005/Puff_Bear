import toast from "react-hot-toast";
import { create } from "zustand";
import {
  getUserByIdLogic,
  updateProfileLogic,
} from "../services/user/user.logic";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (userId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const data = await getUserByIdLogic(userId);

      set({
        user: data,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });

      throw error;
    }
  },

  setUser: (user) => set({ user }),

  clearUser: () =>
    set({
      user: null,
      error: null,
      loading: false,
    }),
    
  // Action to set the initial user or update existing user data
  updateUser: async (userId, payload) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await updateProfileLogic({ id: userId, payload });
      console.log(payload);
      set({
        user: updatedUser,
        loading: false,
      });
      return updatedUser;
    } catch (error) {
      const message = error?.message ?? "Cập nhật hồ sơ thất bại";
      toast.error(message);
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },
}));
