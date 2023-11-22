import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

instance.defaults.withCredentials = true;

export default instance;
