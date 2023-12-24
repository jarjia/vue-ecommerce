import axiosInstance from "./axios";
import Cookies from "js-cookie";
import { CreateProduct, Filters } from "./types";

export const createProduct = (data: CreateProduct) => {
  return axiosInstance.post("/api/product", data, {
    headers: {
      "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = (filters: Filters) => {
  return axiosInstance.get("/api/products", {
    params: filters,
  });
};

export const getUserProducts = (filters: Filters) => {
  return axiosInstance.get("/api/products/user", {
    params: filters,
  });
};

export const getProduct = (productId: number) => {
  return axiosInstance.get(`/api/products/${productId}`);
};

export const editProduct = (props: {
  productId: number;
  data: CreateProduct;
}) => {
  return axiosInstance.post(`/api/products/${props.productId}`, props.data, {
    params: { _method: "PATCH" },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const destroyProduct = (productId: number) => {
  return axiosInstance.delete(`/api/products/${productId}`);
};
