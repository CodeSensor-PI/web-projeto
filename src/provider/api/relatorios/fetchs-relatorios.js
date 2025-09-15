import axios from 'axios';

// GET Buscar Todos Relatorios
export const getRelatorios = async () => {
    try {
        const response = await axios.get('/relatorios');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar todos os relatórios:', error);
        throw error;
    }
};

// GET Buscar Relatorio por sessao
export const getRelatorioPorSessao = async (sessaoId) => {
    try {
        const response = await axios.get(`/relatorios/sessao/${sessaoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar relatório por sessão:', error);
        throw error;
    }
};

// GET Buscar Relatorio por Paciente
export const getRelatorioPorPaciente = async (pacienteId) => {
    try {
        const response = await axios.get(`/relatorios/paciente/${pacienteId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar relatório por paciente:', error);
        throw error;
    }
};

// PUT Atualizar Relatório
export const putAtualizarRelatorio = async (id, relatorio) => {
    try {
        const response = await axios.put(`/relatorios/${id}`, relatorio);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar relatório:', error);
        throw error;
    }
};

// POST Criar Relatório
export const postCriarRelatorio = async (relatorio) => {
    try {
        const response = await axios.post('/relatorios', relatorio);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar relatório:', error);
        throw error;
    }
};

// DELETE Apagar Relatório
export const deleteRelatorio = async (id) => {
    try {
        const response = await axios.delete(`/relatorios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao apagar relatório:', error);
        throw error;
    }
};

// DELETE Apagar Relatório Por Sessão
export const deleteRelatorioPorSessao = async (sessaoId) => {
    try {
        const response = await axios.delete(`/relatorios/sessao/${sessaoId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao apagar relatório por sessão:', error);
        throw error;
    }
};