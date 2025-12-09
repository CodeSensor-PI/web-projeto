import api from './api.js';

/**
 * Solicita recuperação de senha - envia email com código
 * @param {string} email - Email do usuário
 * @param {string} tipoUsuario - Tipo do usuário: 'paciente' ou 'psicologo'
 * @returns {Promise}
 */
export const solicitarRecuperacaoSenha = async (email, tipoUsuario = 'psicologo') => {
  try {
    const endpoint = tipoUsuario === 'paciente' 
      ? `/password-reset/paciente/request?email=${encodeURIComponent(email)}`
      : `/password-reset/psicologo/request?email=${encodeURIComponent(email)}`;
      
    const response = await api.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erro ao solicitar recuperação de senha:", error);
    throw error;
  }
};

/**
 * Valida código de recuperação de senha no backend
 * @param {string} email - Email do usuário
 * @param {string} codigo - Código de 6 dígitos
 * @param {string} tipoUsuario - Tipo do usuário: 'paciente' ou 'psicologo'
 * @returns {Promise}
 */
export const validarCodigoRecuperacao = async (email, codigo, tipoUsuario = 'psicologo') => {
  try {
    // Validação básica do formato do código
    if (!codigo || codigo.length !== 6 || !/^\d{6}$/.test(codigo)) {
      throw new Error("Código deve ter exatamente 6 dígitos numéricos");
    }
    
    const endpoint = tipoUsuario === 'paciente'
      ? `/password-reset/paciente/validate?codigo=${encodeURIComponent(codigo)}`
      : `/password-reset/psicologo/validate?codigo=${encodeURIComponent(codigo)}`;
    
    // Validação real no backend
    const response = await api.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erro ao validar código:", error);
    
    // Tratar erros específicos do backend
    if (error.response && error.response.status === 400) {
      throw new Error("Código inválido ou expirado");
    }
    
    throw error;
  }
};

/**
 * Redefine a senha do usuário
 * @param {string} codigo - Código de validação
 * @param {string} novaSenha - Nova senha
 * @param {string} tipoUsuario - Tipo do usuário: 'paciente' ou 'psicologo'
 * @returns {Promise}
 */
export const redefinirSenha = async (codigo, novaSenha, tipoUsuario = 'psicologo') => {
  try {
    const endpoint = tipoUsuario === 'paciente'
      ? `/password-reset/paciente/confirm?codigo=${encodeURIComponent(codigo)}&novaSenha=${encodeURIComponent(novaSenha)}`
      : `/password-reset/psicologo/confirm?codigo=${encodeURIComponent(codigo)}&novaSenha=${encodeURIComponent(novaSenha)}`;
      
    const response = await api.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    throw error;
  }
};