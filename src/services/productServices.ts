import axiosInstance from "./axios";
import Cookies from "js-cookie";

export const createProduct = () => {
  return axiosInstance.post(
    "/api/test",
    {},
    {
      headers: {
        "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
      },
    }
  );
};

export const getProducts = () => {
  return axiosInstance.get("/api/products");
};
