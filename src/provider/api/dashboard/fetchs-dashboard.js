import api from "../api/api";

// Busca KPI de % pacientes inativos
export const getKpiPorcentPacienteInativos = async () => {
  try {
    const response = await api.get("/pacientes/kpi/porcent-inativo", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar os dados da KPI de % pacientes inativos:",
      error
    );
    throw error;
  }
};

// Busca KPI de % sessões canceladas
export const getKpiQtdSessaoCanceladas = async () => {
  try {
    const response = await api.get("/sessoes/kpi/porcent-cancelada", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar os dados da KPI de % qtd sessoes canceladas:",
      error
    );
    throw error;
  }
};

// Busca dados do gráfico da dashboard
export const getDadosGrafico = async () => {
  try {
    const response = await api.get("/sessoes/dados-grafico", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os dados do gráfico da dashboard:", error);
    throw error;
  }
};
