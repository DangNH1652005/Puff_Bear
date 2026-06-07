import { create } from "zustand";
import { getCartItemsByUserId } from "../services/cart/cart.service";
import { getProductById } from "../services/product/product.service";
import { getColorById } from "../services/color/color.service"
import { getSizeById } from "../services/size/size.service";

export const useCartStore = create((set, get) => ({
  cartItems: [],
  totalPriceCart: 0,
  loading: false,

  fetchCart: async (userId) => {
    if (!userId) {
      return;
    }
    set({ loading: true });
    try {
      const rawItems = await getCartItemsByUserId(userId);
      if (!(rawItems instanceof Error)) {
        const itemsWithProduct = await Promise.all(
          rawItems.map(async (item) => {
            try {
              const [product, color, size] = await Promise.all([
                getProductById(item.productId),
                getColorById(item.colorId),
                getSizeById(item.sizeId),
              ]);
              return {
                ...item,
                product,
                color,
                size,
              };
            } catch (err) {
              console.error(error);
              return item;
            }
          }),
        );

        const totalPriceCart = itemsWithProduct.reduce(
          (sum, item) => sum + (item.totalPrice || 0),
          0,
        );
        set({ cartItems: itemsWithProduct, totalPriceCart });
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      set({ loading: false });
    }
  },

  clearCart: () => set({ cartItems: [] }),
}));
