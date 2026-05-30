import { create } from "zustand";
import { loginRequest, registerRequest } from "../services/auth/auth.logic";
import { getRoleById } from "../services/auth/auth.service";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  role: null,

  login: async (email, password) => {
    set({ loading: true });

    try {
      const user = await loginRequest({ email, password });
      const role = await getRoleById(user.roleId);

      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        loading: false,
        role,
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
      const user = await registerRequest({
        fullName,
        email,
        password,
      });

      const role = await getRoleById(user.roleId);

      localStorage.setItem("user", JSON.stringify(user));
      set({
        user,
        role,
        loading: false,
      });

      return user;
    } catch (error) {
      set({ loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({
      user: null,
      role: null,
    });
  },
}));
