import instance from "../../libs/axios";

export const getAllCollections = async () => {
  const res = await instance.get("/collections");
  return res.data;
};

export const getCollectionById = async (collectionId) => {
  const res = await instance.get(`/collections/${collectionId}`);
  return res.data;
};
