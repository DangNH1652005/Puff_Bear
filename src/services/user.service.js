import instance from "../libs/axios"

export const getAllUsers = async () => {
    const res = await instance.get("/users");
    console.log(res);
    return res.data;
}