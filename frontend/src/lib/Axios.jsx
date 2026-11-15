import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://protofilopanel.onrender.com/api'),
  withCredentials: false,
  timeout: 15000,
});
