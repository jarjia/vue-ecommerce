import axiosInstance from "./axios";
import axios from "axios";
import Cookies from "js-cookie";

export const getCountries = () => {
  return axiosInstance.get("/api/countries", {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getCities = (country: string) => {
  return axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
    country,
  });
};

export const createUser = (userData: {}) => {
  return axiosInstance.post(
    "/api/register",
    {
      userData,
    },
    {
      headers: {
        "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
      },
    }
  );
};

export const getCrsfToken = () => {
  return axiosInstance.get("/sanctum/csrf-cookie");
};

export const postLoginUser = (loginCredentials: any) => {
  return axiosInstance.post("/api/login", loginCredentials, {
    headers: {
      "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
    },
  });
};

export const getUserData = () => {
  return axiosInstance.get("/api/user", {
    headers: {
      "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
    },
  });
};

export const logOutUser = () => {
  return axiosInstance.get("/api/logout", {
    headers: {
      "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
    },
  });
};

export const postVerify = (data: any) => {
  return axiosInstance.post("/api/verify", data);
};

export const postSendVerify = (data: any) => {
  return axiosInstance.post("/api/send-verify", data);
};
