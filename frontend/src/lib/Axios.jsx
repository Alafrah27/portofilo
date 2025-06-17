import axios from "axios";
const url = "https://protofilopanel.onrender.com"; // Change this to your backend URL
export const axiosInstance = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});
