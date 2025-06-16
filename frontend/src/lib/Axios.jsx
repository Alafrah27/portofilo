import axios from "axios";
const url = "https://protofilopanel.onrender.com";
export const axiosInstance = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});
