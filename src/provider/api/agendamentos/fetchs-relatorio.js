import apiRelatorios from "../api-relatorios";

// Busca todos os relatórios de um paciente
export const getRelatoriosPorPaciente = async (pacienteId) => {
  try {
    const response = await apiRelatorios.get(
      `/relatorios/paciente/${pacienteId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatórios do paciente:", error);
    return [];
  }
};

export const getRelatorioPorSessao = async (idSessao) => {
  try {
    const response = await apiRelatorios.get(`/relatorios/sessao/${idSessao}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório da sessão:", error);
    return null;
  }
};
