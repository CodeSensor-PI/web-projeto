import React, { useState, useEffect } from "react";
import "./Modal.css";
import { ajustarDataParaPTBR } from "../../../../utils/ajustarData";
import { getRelatorioPorSessao } from "../../../../provider/api/agendamentos/fetchs-relatorio";
import { postCriarRelatorio } from "../../../../provider/api/relatorios/fetchs-relatorios";
import { deleteRelatorio } from "../../../../provider/api/relatorios/fetchs-relatorios";
import { FaTrashCan } from "react-icons/fa6";
import { IoTrashBinOutline } from "react-icons/io5";


const ModalRelatorio = ({ onClose, onSave, paciente, idSessao, relatorioExistente }) => {
    const [relatorio, setRelatorio] = useState("");
    const [relatorioExistenteLocal, setRelatorioExistenteLocal] = useState(null);

    const handleSave = async () => {
        const relatorioCompleto = {
            conteudo: relatorio,
            data: "2025-09-14T18:45:00", // ou use new Date().toISOString() se quiser a data atual
            fkPaciente: paciente.id,
            fkSessao: idSessao
        };

        try {
            const resultado = await postCriarRelatorio(relatorioCompleto);
            console.log("Relatório criado com sucesso:", resultado);
            onSave(resultado); // atualiza o estado no componente pai, se necessário
            setRelatorio("");
            onClose(); // fecha o modal
        } catch (error) {
            console.error("Erro ao salvar relatório:", error);
            alert("Não foi possível salvar o relatório. Tente novamente.");
        }
    };

    useEffect(() => {
        const buscarRelatorio = async () => {
            try {
                const resultado = await getRelatorioPorSessao(idSessao);
                if (resultado && resultado.conteudo) {
                    setRelatorioExistenteLocal(resultado);
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
        const confirmar = window.confirm("Tem certeza que deseja excluir este relatório?");
        if (!confirmar || !relatorioExistenteLocal.id) console.log(relatorioExistente.id);

        try {
            await deleteRelatorio(relatorioExistenteLocal.id);
            setRelatorioExistenteLocal(null); // limpa o estado
            alert("Relatório excluído com sucesso.");
        } catch (error) {
            alert("Erro ao excluir relatório. Tente novamente.");
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
                <button className="modal-close" onClick={onClose}>&times;</button>
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
                    <div className="flex gap-2 justify-between" style={{ background: '#e0e7ff', color: '#3730a3', padding: '1em', borderRadius: '8px', marginBottom: '1em' }}>
                        <div className="flex flex-col gap-2">
                            <strong>Relatório já registrado para esta sessão:</strong>
                            <div style={{ marginTop: '0.5em' }}>{relatorioExistenteLocal.conteudo}</div>
                        </div>
                        <button
                            className="btn_deletar"
                            onClick={handleDelete}
                        >
                            <IoTrashBinOutline size={24} />
                        </button>
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
                            <button className="btn_primario" onClick={handleSave}>
                                Salvar Relatório
                            </button>
                            <button className="btn_secundario" onClick={onClose}>
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
