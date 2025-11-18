import apiRelatorios from "../api-relatorios";
import { dedupeRequest, buildKeyFromUrl } from '../../../utils/requestDedupe';

// GET Buscar Todos Relatorios
export const getRelatorios = async () => {
  try {
    const response = await apiRelatorios.get("/relatorios");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todos os relatórios:", error);
    throw error;
  }
};

// GET Buscar Relatorio por sessao
export const getRelatorioPorSessao = async (sessaoId) => {
  try {
    const response = await apiRelatorios.get(`/relatorios/sessao/${sessaoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório por sessão:", error);
    throw error;
  }
};

// GET Buscar Relatorio por Paciente
export const getRelatorioPorPaciente = async (pacienteId) => {
  try {
    const response = await apiRelatorios.get(
      `/relatorios/paciente/${pacienteId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório por paciente:", error);
    throw error;
  }
};

// GET Buscar Relatórios por Paciente (Paginado)
// Chama o endpoint esperado: /relatorios/paciente/{pacienteId}/pagina?page={page}&size={size}
// Retorna o objeto de página do backend (ex: { content: [...], totalPages, totalElements, number, size })
export const getRelatoriosPorPacientePagina = async (pacienteId, page = 0, size = 10) => {
    try {
        const url = `/relatorios/paciente/${pacienteId}/pagina`;
        const params = { page, size };

        const data = await dedupeRequest(buildKeyFromUrl(url, params), async () => {
            return axios.get(url, { params }).then(r => r.data);
        });

        return data;
    } catch (error) {
        console.error('Erro ao buscar relatórios paginados por paciente:', error);
        throw error;
    }
};

// PUT Atualizar Relatório
export const putAtualizarRelatorio = async (id, relatorio) => {
  try {
    const response = await apiRelatorios.put(`/relatorios/${id}`, relatorio);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar relatório:", error);
    throw error;
  }
};

// POST Criar Relatório
export const postCriarRelatorio = async (relatorio) => {
  try {
    const response = await apiRelatorios.post("/relatorios", relatorio);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar relatório:", error);
    throw error;
  }
};

// DELETE Apagar Relatório
export const deleteRelatorio = async (id) => {
  try {
    const response = await apiRelatorios.delete(`/relatorios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao apagar relatório:", error);
    throw error;
  }
};

// DELETE Apagar Relatório Por Sessão
export const deleteRelatorioPorSessao = async (sessaoId) => {
  try {
    const response = await apiRelatorios.delete(
      `/relatorios/sessao/${sessaoId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao apagar relatório por sessão:", error);
    throw error;
  }
};

// Extrai o filename do header Content-Disposition, se existir
function parseFileNameFromContentDisposition(disposition) {
  if (!disposition) return null;
  const match = /filename\*=UTF-8''([^;]+)|filename\s*=\s*"?([^";]+)"?/i.exec(
    disposition
  );
  return decodeURIComponent(match?.[1] || match?.[2] || "").trim() || null;
}

// GET Exportar Relatórios em PDF por Paciente (serviço em 8081)
export const exportRelatoriosPdf = async (pacienteId) => {
  try {
    // Use caminho relativo para passar pelo proxy do Vite e evitar CORS em dev
    const response = await apiRelatorios.get(
      `/relatorios/exportar-pdf/${pacienteId}`,
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        },
      }
    );

    const contentType = response.headers?.["content-type"] || "";
    const contentDisposition = response.headers?.["content-disposition"];

    // Se o backend retornou JSON (mesmo com status 200), converter e lançar erro informativo
    if (contentType.includes("application/json")) {
      const text = new TextDecoder("utf-8").decode(response.data);
      try {
        const json = JSON.parse(text);
        throw new Error(json?.message || "Falha ao gerar PDF");
      } catch (e) {
        // Não era JSON válido; lança texto bruto
        throw new Error(text || "Falha ao gerar PDF (payload inválido)");
      }
    }

    if (!response.data || response.data.byteLength === 0) {
      throw new Error("PDF vazio retornado pelo servidor");
    }

    const fileName =
      parseFileNameFromContentDisposition(contentDisposition) ||
      `relatorios-paciente-${pacienteId}.pdf`;
    // Força comportamento de download usando application/octet-stream
    const blob = new Blob([response.data], {
      type: "application/octet-stream",
    });

    return { blob, fileName };
  } catch (error) {
    console.error("Erro ao exportar relatórios em PDF:", error);
    throw error;
  }
};

// Helper para baixar o PDF diretamente no navegador
export const downloadRelatoriosPdf = async (pacienteId, overrideFileName) => {
  try {
    const { blob, fileName } = await exportRelatoriosPdf(pacienteId);

    // Fallback para IE/Edge Legacy
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, overrideFileName || fileName);
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", overrideFileName || fileName);
    link.target = "_self";
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Atraso curto para garantir que o download foi iniciado antes de revogar a URL
    setTimeout(() => window.URL.revokeObjectURL(url), 2000);
  } catch (error) {
    console.error("Erro ao baixar PDF de relatórios:", error);
    // Repassa erro para camada superior notificar o usuário
    throw error;
  }
};
