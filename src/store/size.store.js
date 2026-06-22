import { createSize, deleteSize, getAllSizes, updateSize } from "../services/size/size.service";
import { create } from "zustand";

export const useSizeStore = create((set) => ({
  sizes: [],
  loading: false,
  error: null,

  fetchSizes: async () => {
    try {
      set({ loading: true });

      const data = await getAllSizes();

      set({
        sizes: data,
        loading: false,
      });

    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
    }
  },


  addSize: async (data) => {
    const newSize = await createSize(data);

    set((state) => ({
      sizes: [
        ...state.sizes,
        newSize
      ]
    }));
  },


  editSize: async (id, data) => {

    const updatedSize = await updateSize(id, data);

    set((state) => ({
      sizes: state.sizes.map((size) =>
        size.id === id
          ? updatedSize
          : size
      )
    }));

  },


  removeSize: async (id) => {

    await deleteSize(id);

    set((state) => ({
      sizes: state.sizes.filter(
        size => size.id !== id
      )
    }));

  }
}))
