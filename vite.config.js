import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/pacientes": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/pacientes/, "/pacientes"),
      },
      "/psicologos": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        withCredentials: true,
        rewrite: (path) => path.replace(/^\/psicologos/, "/psicologos"),
      },
      "/planos": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/planos/, "/planos"),
      },
      "/psicologos/login": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/psicologos\/login/, "/psicologos/login"),
      },
      "/sessoes": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sessoes/, "/sessoes"),
      },
      "/preferencias": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/preferencias/, "/preferencias"),
      },
      "/enderecos": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/enderecos/, "/enderecos"),
      },
      "/telefones": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/telefones/, "/telefones"),
      },
      "/relatorios": {
        target: "http://localhost:8081/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/relatorios/, "/relatorios"),
      },
      "/auth": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, "/auth"),
      },
      "/password-reset": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/password-reset/, "/password-reset"),
      }
    },
  },
});
