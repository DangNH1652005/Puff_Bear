import instance from "../../libs/axios";

export const getSizeById = async (sizeId) => {
  const res = await instance(`/sizes/${sizeId}`);
  return res.data;
};

export const getAllSizes = async () => {
  const res = await instance.get("/sizes");
  return res.data;
};

