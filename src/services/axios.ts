import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: "https://api-your.ecommerce.jarji-abuashvili.link",
  withCredentials: true,
});

instance.defaults.withCredentials = true;

export default instance;
