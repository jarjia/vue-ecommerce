import axiosInstance from "./axios";
import axios from "axios";

export const getCountries = () => {
  return axiosInstance.get("/api/countries");
};

export const getCities = (country: string) => {
  return axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
    country,
  });
};

export const createUser = (userData: {}) => {
  return axiosInstance.post("/api/register", {
    userData,
  });
};

export const getCrsfToken = () => {
  return axiosInstance.get("/sanctum/csrf-cookie");
};

export const postLoginUser = (loginCredentials: any) => {
  return axiosInstance.post("/api/login", loginCredentials);
};

export const getUserData = () => {
  return axiosInstance.get("/api/user");
};

export const logOutUser = () => {
  return axiosInstance.get("/api/logout");
};

export const postVerify = (data: any) => {
  return axiosInstance.post("/api/verify", data);
};

export const postSendVerify = (data: any) => {
  return axiosInstance.post("/api/send-verify", data);
};

export const postTest = () => {
  return axiosInstance.post("/api/post");
};
