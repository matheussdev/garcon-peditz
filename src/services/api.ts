import axios from "axios";
import { getToken } from "./auth";
// export const API_URL = "https://web-production-7c99.up.railway.app/"//productionc
export const API_URL = "https://web-production-5ff8.up.railway.app"
// export const API_URL = process.env.API_URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Content-Type": "application/json;charset=UTF-8",
  },
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    if (!config) {
      config = {};
    }
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
