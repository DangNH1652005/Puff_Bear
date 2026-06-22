import { create } from "zustand";
import { createColor, deleteColor, getAllColors, updateColor } from "../services/color/color.service";

export const useColorStore = create((set) => ({
  colors: [],
  color: null,
  loading: false,
  error: null,

  fetchColors: async () => {
    try {
      set({ loading: true, error: null });

      const data = await getAllColors();

      set({
        colors: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
    }
  },
  addColor: async (colorData) => {
    try {
      set({ loading: true, error: null });

      const newColor = await createColor(colorData);

      set((state) => ({
        colors: [...state.colors, newColor],
        loading: false,
      }));

      return newColor;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });

      throw error;
    }
  },

  editColor: async (id, colorData) => {
    try {
      set({ loading: true, error: null });

      const updatedColor = await updateColor(id, colorData);

      set((state) => ({
        colors: state.colors.map((color) =>
          color.id === id ? updatedColor : color
        ),
        loading: false,
      }));

      return updatedColor;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });

      throw error;
    }
  },

  removeColor: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteColor(id);

      set((state) => ({
        colors: state.colors.filter((color) => color.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });

      throw error;
    }
  },
}));
