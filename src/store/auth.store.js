import { create } from "zustand";
import { loginRequest, registerRequest } from "../services/auth/auth.logic";
import { getRoleById } from "../services/auth/auth.service";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  role: JSON.parse(localStorage.getItem("role")) || null,

  login: async (email, password) => {
    set({ loading: true });

    try {
      const user = await loginRequest({ email, password });
      const role = await getRoleById(user.roleId);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", JSON.stringify(role));

      set({
        user,
        loading: false,
        role,
      });

      return { user, role };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (fullName, email, password) => {
    set({ loading: true });

    try {
      const user = await registerRequest({
        fullName,
        email,
        password,
      });

      const role = await getRoleById(user.roleId);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", JSON.stringify(role));
      set({
        user,
        role,
        loading: false,
      });

      return { user, role };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    set({
      user: null,
      role: null,
    });
  },
}));
