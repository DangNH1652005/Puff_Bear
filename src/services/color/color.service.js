import instance from "../../libs/axios";

export const getAllColors = async () => {
  const res = await instance.get("/colors");
  return res.data;
};

export const getColorById = async (colorId) => {
  const res = await instance.get(`/colors/${colorId}`);
  return res.data;
};
