import instance from "../../libs/axios";

export const createCartItem = async (cartItem) => {
    try {
        const res = await instance.post('/cartItems', cartItem);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getCartItemsByUserId = async (userId) => {
    try {
        const res = await instance.get(`/cartItems?userId=${userId}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const deleteCartItemById = async (cartItemId) => {
  try {
    const res = await instance.delete(`/cartItems/${cartItemId}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
