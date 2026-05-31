import instance from "../../libs/axios"

export const getCategoryById = async (cateId) => {
    const res = await instance.get(`/categories/${cateId}`);
    return res.data;
}