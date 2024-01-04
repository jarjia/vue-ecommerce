import axiosInstance from "./axios";
import Cookies from "js-cookie";
import { AddCart, ChangeQuantityCart } from "./types";

export const createCartItem = (data: AddCart) => {
  return axiosInstance.post("/api/cart", data, {
    headers: {
      "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
    },
  });
};

export const getCartItems = () => {
  return axiosInstance.get("/api/cart");
};

export const getCartCount = () => {
  return axiosInstance.get("/api/cart/count");
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
