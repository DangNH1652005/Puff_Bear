import axios from "../../libs/axios";

export const getProducts = async () => {
  const res = await axios.get("/products");
  return res.data;
};

export const getCollections = async () => {
  const res = await axios.get("/collections");
  return res.data;
};

export const getColors = async () => {
  const res = await axios.get("/colors");
  return res.data;
};

export const getSizes = async () => {
  const res = await axios.get("/sizes");
  return res.data;
};