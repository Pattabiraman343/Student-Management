import axios from "axios";

// Hardcoded Render backend URL
const API_URL = "https://student-management-lc6d.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Attach token automatically
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
