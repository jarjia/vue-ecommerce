import axiosInstance from "./axios";

export const checkout = (amount: number) => {
  return axiosInstance.post("/api/checkout", {
    amount: amount * 100,
  });
};

export const checkoutProducts = () => {
  return axiosInstance.post("/api/cart/checkout");
};
