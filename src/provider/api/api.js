import axios from "axios";

const api = axios.create({
  baseURL:
    window?.env?.VITE_API_URL ??
    import.meta.env.VITE_API_URL ??
    "http://localhost:8080",
  withCredentials: true,
});

export default api;
