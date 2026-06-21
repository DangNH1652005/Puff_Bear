import instance from "../../libs/axios"

export const getCategoryById = async (cateId) => {
  const res = await instance.get(`/categories/${cateId}`);
  return res.data;
}

export const getAllCategories = async () => {
  const res = await instance.get('/categories')
  return res.data;
}
