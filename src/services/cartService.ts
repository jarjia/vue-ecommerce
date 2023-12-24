import axiosInstance from "./axios";
import { AddCart, ChangeQuantityCart } from "./types";

export const createCartItem = (data: AddCart) => {
  return axiosInstance.post("/api/cart", data);
};

export const getCartItems = () => {
  return axiosInstance.get("/api/cart");
};

export const deleteCartItem = (cartId: number) => {
  return axiosInstance.delete(`/api/cart/${cartId}`);
};

export const deleteCartItems = () => {
  return axiosInstance.post("/api/cart/clear");
};

export const updateCartQuantity = (data: ChangeQuantityCart) => {
  return axiosInstance.put(`/api/cart/quantity/${data.cart_id}`, {
    quantity: data.quantity,
  });
};
