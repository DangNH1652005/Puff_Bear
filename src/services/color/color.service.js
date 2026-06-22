import instance from "../../libs/axios";

export const getAllColors = async () => {
  const res = await instance.get("/colors");
  return res.data;
};

export const getColorById = async (colorId) => {
  const res = await instance.get(`/colors/${colorId}`);
  return res.data;
};

export const createColor = async (data) => {
  const res = await instance.post("/colors", data);
  return res.data;
};

export const updateColor = async (id, data) => {
  const res = await instance.put(`/colors/${id}`, data);
  return res.data;
};

export const deleteColor = async (id) => {
  const res = await instance.delete(`/colors/${id}`);
  return res.data;
};

export const createCategory = async (data) => {
  const res = await instance.post("/categories", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await instance.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await instance.delete(`/categories/${id}`);
  return res.data;
};
