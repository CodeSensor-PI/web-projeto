import api from "./api";

/**
 * Função para alterar a senha do usuário.
 * @param {string} id
 * @param {string} senhaAtual
 * @param {string} novaSenha
 * @returns {Promise}
 */

export const alterarSenha = async (id, senhaAtual, novaSenha) => {
  try {
    const response = await api.put(`/psicologos/${id}/alterar-senha`, {
      senha: senhaAtual,
      novaSenha,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar a senha:", error);
    throw error;
  }
};
