import axiosInstance from "./axios";

export const getOrders = () => {
  return axiosInstance.get("/api/orders");
};

export const cancelOrder = (order: number) => {
  return axiosInstance.delete(`/api/orders/${order}`);
};
