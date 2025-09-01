import React, { useState, useEffect } from "react";
import "./Modal.css";
import { ajustarDataParaPTBR } from "../../../../utils/ajustarData";
import { getRelatorioPorSessao } from "../../../../provider/api/agendamentos/fetchs-relatorio";

const ModalRelatorio = ({ onClose, onSave, paciente, idSessao, relatorioExistente }) => {
    const [relatorio, setRelatorio] = useState("");

    const handleSave = () => {
        const relatorioCompleto = {
            paciente: {
                id: paciente.id,
                nome: paciente.nome,
                cpf: paciente.cpf,
                email: paciente.email,
                status: paciente.status,
                plano: paciente.fkPlano,
            },
            agenda: {
                data: paciente.data,
                horario: paciente.horario,
                // adicione outros campos relevantes da agenda se necessário
            },
            relatorio: relatorio
        };
        onSave(relatorioCompleto);
        setRelatorio("");
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
                {relatorioExistente ? (
                    <div style={{ background: '#e0e7ff', color: '#3730a3', padding: '1em', borderRadius: '8px', marginBottom: '1em' }}>
                        <strong>Relatório já registrado para esta sessão:</strong>
                        <div style={{ marginTop: '0.5em' }}>{relatorioExistente}</div>
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
