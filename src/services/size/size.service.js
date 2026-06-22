import instance from "../../libs/axios";

export const getSizeById = async (sizeId) => {
  const res = await instance(`/sizes/${sizeId}`);
  return res.data;
};

export const getAllSizes = async () => {
  const res = await instance.get("/sizes");
  return res.data;
};

export const createSize = async (data) => {
  const res = await instance.post("/sizes", data);
  return res.data;
};

export const updateSize = async (id, data) => {
  const res = await instance.put(`/sizes/${id}`, data);
  return res.data;
};

export const deleteSize = async (id) => {
  const res = await instance.delete(`/sizes/${id}`);
  return res.data;
};

