import instance from "../../libs/axios"

export const createCheckout = async (data) => {
    const res = await instance.post("/checkouts", data);
    return res.data;
}


export const getCheckoutById = async (id) => {
    const res = await instance.get(`/checkouts/${id}`);
    return res.data
}