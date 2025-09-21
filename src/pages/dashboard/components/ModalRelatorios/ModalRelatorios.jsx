
import React, { useEffect, useState } from "react";
import "../ModalCadastrarRelatorio/Modal.css";
import { FaDownload } from "react-icons/fa";
import { getRelatorioPorPaciente, putAtualizarRelatorio, downloadRelatoriosPdf } from "../../../../provider/api/relatorios/fetchs-relatorios";
import { getAgendamentosPorId } from "../../../../provider/api/agendamentos/fetchs-agendamentos";
import { deleteRelatorio } from "../../../../provider/api/relatorios/fetchs-relatorios";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaPen } from "react-icons/fa6";
import { confirmAction, responseMessage, errorMessage } from "../../../../utils/alert";


const ModalRelatorios = ({ onClose, pacienteId }) => {
    const [relatorios, setRelatorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editandoId, setEditandoId] = useState(null);
    const [textoEdicao, setTextoEdicao] = useState("");
    const [exportando, setExportando] = useState(false);
    const [sessaoMap, setSessaoMap] = useState({});

    useEffect(() => {
        setLoading(true);
        async function fetchRelatorios() {
            const data = await getRelatorioPorPaciente(pacienteId);
            const lista = Array.isArray(data) ? data : [];
            setRelatorios(lista);

            // Coleta IDs de sessão para buscar datas/horas reais do agendamento
            const getSessaoId = (rel) => rel?.fkSessao ?? rel?.fk_sessao ?? rel?.sessaoId ?? rel?.idSessao ?? rel?.fk_sessao_id;
            const ids = Array.from(new Set(lista.map((r) => getSessaoId(r)).filter(Boolean)));
            if (ids.length > 0) {
                try {
                    const entries = await Promise.all(
                        ids.map(async (id) => {
                            try {
                                const sessao = await getAgendamentosPorId(id);
                                return [id, sessao];
                            } catch (e) {
                                console.warn('Falha ao buscar sessão', id, e);
                                return [id, null];
                            }
                        })
                    );
                    setSessaoMap(Object.fromEntries(entries));
                } catch (e) {
                    console.warn('Falha ao montar mapa de sessões', e);
                }
            }
            setLoading(false);
        }
        fetchRelatorios();
    }, [pacienteId]);

    const formatPTBR = (d) => ({
        data: d.toLocaleDateString('pt-BR'),
        hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    const parseDBDate = (valor) => {
        if (!valor) return null;
        const norm = typeof valor === 'string' ? valor.replace(' ', 'T') : valor;
        const dt = new Date(norm);
        return isNaN(dt.getTime()) ? null : dt;
    };

    const obterDataHoraSessao = (rel) => {
        const sessaoId = rel?.fkSessao ?? rel?.fk_sessao ?? rel?.sessaoId ?? rel?.idSessao ?? rel?.fk_sessao_id;
        const sessao = (sessaoId && sessaoMap[sessaoId]) || rel?.sessao || null;
        if (!sessao) return { data: '-', hora: '-' };
        const baseDate = parseDBDate(sessao.data) || parseDBDate(sessao.dataSessao) || parseDBDate(sessao.dataAgendamento);
        const horaStr = sessao.hora || sessao.horario || null;
        if (baseDate && horaStr) {
            const y = baseDate.getFullYear();
            const m = String(baseDate.getMonth() + 1).padStart(2, '0');
            const day = String(baseDate.getDate()).padStart(2, '0');
            const [hhRaw, mmRaw] = String(horaStr).split(':');
            const hh = String(hhRaw ?? '00').padStart(2, '0');
            const mm = String(mmRaw ?? '00').padStart(2, '0');
            const dt = new Date(`${y}-${m}-${day}T${hh}:${mm}:00`);
            return formatPTBR(dt);
        }
        if (baseDate) return formatPTBR(baseDate);
        return { data: '-', hora: '-' };
    };

    const obterDataHoraRelatorio = (rel) => {
        const dt = parseDBDate(rel?.data);
        return dt ? formatPTBR(dt) : { data: '-', hora: '-' };
    };

    const handleDelete = async (id) => {
        const result = await confirmAction({
            title: "Excluir relatório?",
            message: "Essa ação não pode ser desfeita.",
            confirmText: "Sim, excluir",
            cancelText: "Cancelar",
            icon: "warning",
            size: "small",
        });
        if (!result.isConfirmed) return;

        try {
            await deleteRelatorio(id);
            setRelatorios(prev => prev.filter(r => r.id !== id));
            responseMessage("Relatório excluído com sucesso.");
        } catch (error) {
            errorMessage("Erro ao excluir relatório. Tente novamente.");
        }
    };

    const iniciarEdicao = (rel) => {
        setEditandoId(rel.id);
        setTextoEdicao(rel.conteudo || "");
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        setTextoEdicao("");
    };

    const salvarEdicao = async (rel) => {
        if (!textoEdicao || textoEdicao.trim().length === 0) {
            errorMessage("O conteúdo do relatório não pode estar vazio.");
            return;
        }
        const result = await confirmAction({
            title: "Salvar alterações?",
            message: "Confirme para atualizar o relatório.",
            confirmText: "Salvar",
            cancelText: "Cancelar",
            icon: "question",
            size: "medium",
        });
        if (!result.isConfirmed) return;
        try {
            const atualizado = await putAtualizarRelatorio(rel.id, { conteudo: textoEdicao });
            setRelatorios(prev => prev.map(r => r.id === rel.id ? { ...r, conteudo: atualizado?.conteudo ?? textoEdicao } : r));
            setEditandoId(null);
            setTextoEdicao("");
            responseMessage("Relatório atualizado com sucesso.");
        } catch (error) {
            console.error("Erro ao atualizar relatório:", error);
            errorMessage("Não foi possível atualizar o relatório. Tente novamente.");
        }
    };

    const handleExport = async () => {
        try {
            setExportando(true);
            await downloadRelatoriosPdf(pacienteId);
            responseMessage("PDF gerado com sucesso. Verifique seus downloads.");
        } catch (error) {
            errorMessage("Não foi possível exportar o PDF. Tente novamente.");
        } finally {
            setExportando(false);
        }
    };


    return (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose}>&times;</button>
                <h2>Relatórios do Paciente</h2>
                {loading ? (
                    <div>Carregando relatórios...</div>
                ) : relatorios.length === 0 ? (
                    <div style={{ marginTop: '1em' }}>Nenhum relatório encontrado para este paciente.</div>
                ) : (
                    <>
                        <div className="modal-list">
                        <ul style={{ marginTop: '1em', padding: 0, listStyle: 'none' }}>
                            {relatorios.map((rel) => {

                                const s = obterDataHoraSessao(rel);
                                const r = obterDataHoraRelatorio(rel);

                                return (
                                    <li key={rel.id} className="cardModal">
                                        <div className="flex flex-col gap-2" style={{ flex: 1 }}>
                                            <div className="flex gap-2">
                                                <strong>Data do Agendamento:</strong> {s.data} <strong>Hora do agendamento:</strong> {s.hora}
                                            </div>
                                            {editandoId === rel.id ? (
                                                <>
                                                    <textarea
                                                        value={textoEdicao}
                                                        onChange={(e) => setTextoEdicao(e.target.value)}
                                                        rows={6}
                                                        style={{ width: '100%', marginTop: 6 }}
                                                    />
                                                    <div className="flex gap-2 mt-2">
                                                        <button type="button" className="btn_primario" onClick={() => salvarEdicao(rel)}>
                                                            Salvar Alterações
                                                        </button>
                                                        <button type="button" className="btn_secundario" onClick={cancelarEdicao}>
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
                                                    <div className="flex gap-2">
                                                        <strong>Data do Relatório:</strong> {r.data} <strong>Hora:</strong> {r.hora}
                                                    </div>
                                                    <strong>Relatório:</strong> {rel.conteudo}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            {editandoId !== rel.id && (
                                                <button type="button" className="btn_editar" title="Editar relatório" onClick={() => iniciarEdicao(rel)}>
                                                    <FaPen size={18} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="btn_deletar"
                                                onClick={() => handleDelete(rel.id)}
                                            >
                                                <IoTrashBinOutline size={24} />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        </div>
                        <button type="button" className="btn_primario flex" onClick={handleExport} disabled={exportando}>
                            <FaDownload />
                            {exportando ? "Exportando..." : "Exportar Relatórios"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModalRelatorios;
