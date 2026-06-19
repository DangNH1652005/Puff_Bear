import instance from "../../libs/axios";

export const getUsers = async () => {
  const res = await instance.get("/users");
  return res.data;
};

export const createUser = async (data) => {
  const res = await instance.post("/users", data);
  return res.data;
}

// export const getRoleById = async (roleId) => {
//  const res = await instance.get(`/roles/${roleId}`);
//  return res.data;
// }
