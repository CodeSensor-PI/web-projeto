import axios from "axios";

export const getRelatorioPorSessao = async (idSessao) => {
  try {
    const response = await axios.get(`/relatorios/sessao/${idSessao}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório da sessão:", error);
    return null;
  }
};
