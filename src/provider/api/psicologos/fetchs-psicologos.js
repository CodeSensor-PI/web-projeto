import api from "../api";

export const getPsicologos = async () => {
  try {
    const response = await api.get("/psicologos", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar psicólogos:", error);
    throw error;
  }
};

export const getPsicologosPorId = async (id) => {
  try {
    const response = await api.get(`/psicologos/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar psicólogo:", error);
    throw error;
  }
};

export const postPsicologo = async (psicologo) => {
  try {
    const response = await api.post("/psicologos", psicologo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar psicólogo:", error);
    throw error;
  }
};

export const putPsicologo = async (id, psicologo) => {
  try {
    const response = await api.put(`/psicologos/${id}`, psicologo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar psicólogo:", error);
    throw error;
  }
};

export const putAtualizarSenhaPsicologo = async (id, senha) => {
  try {
    const response = await api.put(`/psicologos/${id}/senha`, senha, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar senha do psicólogo:", error);
    throw error;
  }
};
