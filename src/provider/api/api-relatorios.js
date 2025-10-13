import axios from "axios";

const apiRelatorios = axios.create({
  baseURL: import.meta.env.VITE_RELATORIOS_URL ?? "http://localhost:8081",
  withCredentials: true,
});

export default apiRelatorios;
