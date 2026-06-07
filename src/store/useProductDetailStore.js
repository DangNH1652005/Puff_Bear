import { create } from "zustand";
import { getProductById } from "../services/product/product.service";

export const useProductDetailStore = create((set, get) => ({
  product: null,
  loading: false,
  error: null,
  selection: { size: null, color: null, quantity: 1 },

  fetchProduct: async (id) => {
    const state = get();
    // Nếu đang lấy product hoặc đã có đúng product này rồi thì bỏ qua
    if (state.loading || (state.product && state.product.id === id)) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await getProductById(id);
      if (!data) {
        set({ error: "Không tìm thấy sản phẩm.", loading: false });
        return;
      }
      set({ product: data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Đã có lỗi xảy ra khi tải sản phẩm.", loading: false });
    }
  },

  setSelection: (selectionUpdate) => {
    set((state) => ({
      selection: {
        ...state.selection,
        ...selectionUpdate,
      },
    }));
  },
  
  clearStore: () => set({ product: null, loading: false, error: null, selection: { size: null, color: null, quantity: 1 } })
}));
