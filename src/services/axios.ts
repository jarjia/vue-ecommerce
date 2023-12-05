import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "X-Xsrf-Token": Cookies.get("XSRF-TOKEN"),
  },
});

instance.defaults.withCredentials = true;

export default instance;
