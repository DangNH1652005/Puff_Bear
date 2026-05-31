import instance from "../../libs/axios";

export const getProductById = async (proId) => {
  try {
    const res = await instance.get(`/products/${proId}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
