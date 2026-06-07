import instance from "../../libs/axios";

export const getRoles = async () => {
    try {
        const res = await instance.get("/roles");
        return res.data;
    } catch (error) {
        return error;
    }
};

export const createRole = async (data) => {
    try {
        const res = await instance.post("/roles", data);
        return res.data;
    } catch (error) {
        return error;
    }
};
