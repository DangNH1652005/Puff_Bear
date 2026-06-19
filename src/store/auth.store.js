import { create } from "zustand";
import { loginRequest, registerRequest } from "../services/auth/auth.logic";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,

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
