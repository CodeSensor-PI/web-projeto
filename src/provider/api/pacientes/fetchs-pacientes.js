import api from "../api/api";

// Lista paginada de pacientes
export const getPacientes = async (page = 1, size = 10) => {
  try {
    // Backend (Spring) normalmente usa paginação base 0; mapeamos UI (1-based) -> API (0-based)
    const pageApi = Math.max(0, parseInt(page, 10) - 1 || 0);
    const response = await api.get(`/pacientes?page=${pageApi}&size=${size}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar pacientes:", error);
    throw error;
  }
};

// Alias semântico caso queira diferenciar na chamada
export const getPacientesPaginado = getPacientes;

export const getPacientesPorId = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao encontrar paciente:", error);
    throw error;
  }
};

// Busca por nome (novo endpoint dedicado: /pacientes/busca?nome=)
export const getPacientesLista = async (pesquisar) => {
  try {
    const response = await api.get(
      `/pacientes/busca?nome=${encodeURIComponent(pesquisar)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pacientes por nome:", error);
    throw error;
  }
};

export const postPaciente = async (paciente) => {
  try {
    const response = await api.post("/pacientes", paciente, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    throw error;
  }
};

export const putPaciente = async (id, paciente) => {
  try {
    const response = await api.put(`/pacientes/${id}`, paciente, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw error;
  }
};

// Busca endereço por CEP (mantém axios pois é externo)
export const getEnderecoPorCep = async (cep) => {
  try {
    const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (response.data.erro) {
      throw new Error("CEP não encontrado.");
    }
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar o endereço:", error.message);
    throw error;
  }
};

export const putDesativarPaciente = async (id, paciente) => {
  try {
    const response = await api.put(`/pacientes/${id}/desativar`, paciente, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao desativar paciente:", error);
    throw error;
  }
};

export const putAtualizarSenhaPaciente = async (id, senha) => {
  try {
    const response = await api.put(`/pacientes/${id}/senha`, senha, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
};

export const putEndereco = async (id, endereco) => {
  try {
    const response = await api.put(`/enderecos/${id}`, endereco, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar endereço:", error);
    throw error;
  }
};

/**
 * @param {string | number} idPaciente
 * @returns {Promise}
 */
export const buscarTelefonePorIdPaciente = async (idPaciente) => {
  try {
    const response = await api.get(`/telefones/pacientes/${idPaciente}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar telefone por ID do paciente:",
      error?.message,
      error?.response
    );
    throw error;
  }
};
