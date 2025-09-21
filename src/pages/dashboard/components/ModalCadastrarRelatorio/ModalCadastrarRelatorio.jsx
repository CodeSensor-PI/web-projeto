import React, { useState, useEffect } from "react";
import "./Modal.css";
import { ajustarDataParaPTBR } from "../../../../utils/ajustarData";
import { getRelatorioPorSessao } from "../../../../provider/api/agendamentos/fetchs-relatorio";
import { postCriarRelatorio, putAtualizarRelatorio, deleteRelatorio } from "../../../../provider/api/relatorios/fetchs-relatorios";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaPen } from "react-icons/fa6";
import { confirmAction, responseMessage, errorMessage } from "../../../../utils/alert";


const ModalRelatorio = ({ onClose, onSave, paciente, idSessao, relatorioExistente }) => {
    const [relatorio, setRelatorio] = useState("");
    const [relatorioExistenteLocal, setRelatorioExistenteLocal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [textoEdicao, setTextoEdicao] = useState("");

    const handleSave = async () => {
        // Agora a coluna `data` deve refletir o momento de criação do relatório
        const now = new Date();
        const y = now.getFullYear();
        const mo = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const dataCriacao = `${y}-${mo}-${d}T${hh}:${mm}:${ss}`; // formato local YYYY-MM-DDTHH:mm:ss

        const relatorioCompleto = {
            conteudo: relatorio,
            data: dataCriacao,
            fkPaciente: paciente.id,
            fkSessao: idSessao
        };

        try {
            const resultado = await postCriarRelatorio(relatorioCompleto);
            onSave(resultado);
            setRelatorio("");
            responseMessage("Relatório criado com sucesso.");
            onClose();
        } catch (error) {
            console.error("Erro ao salvar relatório:", error);
            errorMessage("Não foi possível salvar o relatório. Tente novamente.");
        }
    };

    useEffect(() => {
        const buscarRelatorio = async () => {
            try {
                const resultado = await getRelatorioPorSessao(idSessao);
                if (resultado && resultado.conteudo) {
                    setRelatorioExistenteLocal(resultado);
                    setTextoEdicao(resultado.conteudo);
                    console.log("Relatório existente encontrado:", resultado);
                }
            } catch (error) {
                console.warn("Nenhum relatório encontrado para esta sessão.");
            }
        };

        if (idSessao) {
            buscarRelatorio();
        }
    }, [idSessao]);


    const handleDelete = async () => {
        if (!relatorioExistenteLocal?.id) return;
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
            await deleteRelatorio(relatorioExistenteLocal.id);
            setRelatorioExistenteLocal(null);
            responseMessage("Relatório excluído com sucesso.");
        } catch (error) {
            errorMessage("Erro ao excluir relatório. Tente novamente.");
        }
    };

    const handleToggleEdit = () => {
        if (relatorioExistenteLocal) {
            setTextoEdicao(relatorioExistenteLocal.conteudo || "");
        }
        setIsEditing((prev) => !prev);
    };

    const handleUpdate = async () => {
        if (!relatorioExistenteLocal?.id) return;
        if (!textoEdicao || textoEdicao.trim().length === 0) {
            errorMessage("O conteúdo do relatório não pode estar vazio.");
            return;
        }
        const result = await confirmAction({
            title: "Salvar alterações?",
            message: "Confirme para atualizar o relatório desta sessão.",
            confirmText: "Salvar",
            cancelText: "Cancelar",
            icon: "question",
            size: "medium",
        });
        if (!result.isConfirmed) return;
        try {
            const atualizado = await putAtualizarRelatorio(relatorioExistenteLocal.id, { conteudo: textoEdicao });
            // Atualiza o estado local com o retorno
            const novoRelatorio = { ...relatorioExistenteLocal, ...atualizado };
            // Caso o backend retorne apenas campos parciais, assegura o conteudo atualizado
            novoRelatorio.conteudo = atualizado?.conteudo ?? textoEdicao;
            setRelatorioExistenteLocal(novoRelatorio);
            setIsEditing(false);
            responseMessage("Relatório atualizado com sucesso.");
        } catch (error) {
            console.error("Erro ao atualizar relatório:", error);
            errorMessage("Não foi possível atualizar o relatório. Tente novamente.");
        }
    };



    // Função para fechar ao clicar fora do modal
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose}>&times;</button>
                <div style={{ marginBottom: '1em' }}>
                    <h1>Adicionar Relatório</h1>
                    {paciente && (
                        <div style={{ marginTop: '0.5em', marginBottom: '0.5em', background: '#f3f4f6', padding: '0.75em 1em', borderRadius: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div><strong>Paciente:</strong> {paciente.nome}</div>
                            <div><strong>Data:</strong> {ajustarDataParaPTBR(paciente.data)}</div>
                            <div><strong>Hora:</strong> {paciente.horario}</div>
                        </div>
                    )}
                </div>
                {relatorioExistenteLocal ? (
                    <div className="cardModal">
                        <div className="flex flex-col gap-2" style={{ flex: 1 }}>
                            <strong>Relatório já registrado para esta sessão:</strong>
                            {isEditing ? (
                                <>
                                    <textarea
                                        value={textoEdicao}
                                        onChange={(e) => setTextoEdicao(e.target.value)}
                                        rows={8}
                                        style={{ width: "100%", marginTop: "0.5em" }}
                                    />
                                    <div className="flex gap-2 mt-4">
                                        <button type="button" className="btn_primario" onClick={handleUpdate}>
                                            Salvar Alterações
                                        </button>
                                        <button type="button" className="btn_secundario" onClick={handleToggleEdit}>
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ marginTop: '0.5em', whiteSpace: 'pre-wrap' }}>{relatorioExistenteLocal.conteudo}</div>
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            {!isEditing && (
                                <button
                                    type="button"
                                    className="btn_editar"
                                    title="Editar relatório"
                                    onClick={handleToggleEdit}
                                >
                                    <FaPen size={18} />
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn_deletar"
                                onClick={handleDelete}
                            >
                                <IoTrashBinOutline size={24} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <textarea
                            value={relatorio}
                            onChange={e => setRelatorio(e.target.value)}
                            placeholder="Digite o relatório da sessão..."
                            rows={8}
                            style={{ width: "100%", marginTop: "1em" }}
                        />
                        <div className="flex gap-2 mt-4">
                            <button type="button" className="btn_primario" onClick={handleSave}>
                                Salvar Relatório
                            </button>
                            <button type="button" className="btn_secundario" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModalRelatorio;
