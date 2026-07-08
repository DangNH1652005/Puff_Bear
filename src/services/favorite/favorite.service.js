import instance from "../../libs/axios";

export const getFavoritesByUserId = async (userId) => {
  const response = await instance.get(`/favorites?userId=${userId}`);
  return response.data;
};

export const addFavorite = async (payload) => {
  const response = await instance.post("/favorites", payload);
  return response.data;
};

export const removeFavorite = async (favoriteId) => {
  const response = await instance.delete(`/favorites/${favoriteId}`);
  return response.data;
};
