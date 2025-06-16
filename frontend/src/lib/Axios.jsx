import axios from "axios";
const url = "http://localhost:5000"; // Change this to your backend URL
export const axiosInstance = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});


// https://protofilopanel.onrender.com