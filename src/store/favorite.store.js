import { create } from "zustand";
import { getFavoritesByUserId, addFavorite, removeFavorite } from "../services/favorite/favorite.service";
import { getAllProducts, getProductById } from "../services/product/product.service";
import toast from "react-hot-toast";

export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  loading: false,
  initialized: false,

  fetchFavorites: async (userId) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const data = await getFavoritesByUserId(userId);
      const products = await getAllProducts();
      
      const favoritesWithProduct = data.map(fav => ({
        ...fav,
        product: fav.product || products.find(p => p.id === fav.productId)
      }));

      set({ favorites: favoritesWithProduct, loading: false, initialized: true });
    } catch (error) {
      console.error("Fetch favorites error:", error);
      set({ loading: false });
    }
  },

  toggleFavorite: async (userId, productId) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để lưu sản phẩm yêu thích");
      return;
    }

    const { favorites } = get();
    const existing = favorites.find(f => f.productId === productId);

    try {
      if (existing) {
        // Remove
        await removeFavorite(existing.id);
        set({ favorites: favorites.filter(f => f.id !== existing.id) });
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        // Add
        const newFavorite = await addFavorite({ userId, productId });
        const productDetail = await getProductById(productId);
        newFavorite.product = productDetail;
        
        set({ favorites: [...favorites, newFavorite] });
        toast.success("Đã thêm vào danh sách yêu thích 💖");
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  },

  isFavorite: (productId) => {
    return get().favorites.some(f => f.productId === productId);
  },

  clearFavorites: () => {
    set({ favorites: [], initialized: false });
  }
}));
