import api from "../api";

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
        const response = await api.put(`/sessoes/cancelar/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        throw error;
    }
}


/**
 * @param {Object} params
 * @param {string} params.segunda
 * @param {number} [params.page]
 * @param {number} [params.size=40]
 */
export const paginacaoGetAgendamentos = async ({ segunda, page, size = 40 }) => {
    try {
        if (!segunda) throw new Error('Parâmetro "segunda" (YYYY-MM-DD) é obrigatório');
        const params = new URLSearchParams();
        params.append('segunda', segunda);
        if (typeof size === 'number' && size > 0) params.append('size', String(size));
        if (typeof page === 'number') {
            const pageApi = Math.max(0, parseInt(page, 10) - 1 || 0);
            params.append('page', String(pageApi));
        }

        const response = await api.get(`/sessoes/semana?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar agendamentos com paginação semanal:', error);
        throw error;
    }
};
