import axios from "axios";

const apiRelatorios = axios.create({
  baseURL: import.meta.env.VITE_RELATORIOS_URL,
  withCredentials: true,
});

export default apiRelatorios;
