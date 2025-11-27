import api from "../api";

export const postLogin = async (login) => {
  try {
    const response = await api.post("/login", login, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const postLogout = async () => {
  try {
    const response = await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};
