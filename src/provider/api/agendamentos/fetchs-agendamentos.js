import api from "../api/api";

// Busca agendamento por ID
export const getAgendamentosPorId = async (id) => {
  try {
    const response = await api.get(`/sessoes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar agendamento:", error);
    throw error;
  }
};

// Busca todos os agendamentos
export const getAgendamentos = async () => {
  try {
    const response = await api.get("/sessoes");
    console.log("response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar agendamentos:", error);
    throw error;
  }
};

// Busca agendamentos por paciente
export const getAgendamentosPorPaciente = async (id) => {
  try {
    const response = await api.get(`/sessoes/pacientes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar agendamentos por paciente:", error);
    throw error;
  }
};

// Cria novo agendamento
export const postAgendamento = async (agendamento) => {
  try {
    const response = await api.post("/sessoes", agendamento);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error;
  }
};

// Atualiza agendamento existente
export const putAgendamento = async (id, agendamento) => {
  try {
    const response = await api.put(`/sessoes/${id}`, agendamento);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    throw error;
  }
};

/**
 * Busca agendamentos por status
 * @param {string} status - Ex: "PENDENTE", "CONFIRMADA", "CANCELADA", "AGUARDANDO", "CONCLUIDA"
 */
export const getAgendamentosPorStatus = async (status) => {
  try {
    const response = await api.get(`/sessoes/status?status=${status}`);
    console.log("response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos por status:", error);
    throw error;
  }
};

// Cancela agendamento
export const cancelAgendamento = async (id) => {
  try {
    const response = await api.put(`/sessoes/cancelar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    throw error;
  }
};
