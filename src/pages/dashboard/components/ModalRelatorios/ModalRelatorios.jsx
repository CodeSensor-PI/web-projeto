
import React, { useEffect, useState } from "react";
import "../ModalCadastrarRelatorio/Modal.css";
import { ajustarDataParaPTBR } from "../../../../utils/ajustarData";
import { FaDownload } from "react-icons/fa";
import { getRelatoriosPorPaciente } from "../../../../provider/api/agendamentos/fetchs-relatorio";

const ModalRelatorios = ({ onClose, pacienteId }) => {
    const [relatorios, setRelatorios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        async function fetchRelatorios() {
            const data = await getRelatoriosPorPaciente(pacienteId);
            setRelatorios(Array.isArray(data) ? data : []);
            setLoading(false);
        }
        fetchRelatorios();
    }, [pacienteId]);

    return (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>Relatórios do Paciente</h2>
                {loading ? (
                    <div>Carregando relatórios...</div>
                ) : relatorios.length === 0 ? (
                    <div style={{ marginTop: '1em' }}>Nenhum relatório encontrado para este paciente.</div>
                ) : (
                    <>
                        <ul style={{ marginTop: '1em', padding: 0, listStyle: 'none' }}>
                            {relatorios.map(rel => (
                                <li key={rel.id} style={{ background: '#f3f4f6', borderRadius: 8, marginBottom: 12, padding: '1em' }}>
                                    <div><strong>Data:</strong> {ajustarDataParaPTBR(rel.data)} <strong>Hora:</strong> {rel.horario}</div>
                                    <div style={{ marginTop: 6 }}><strong>Relatório:</strong> {rel.mensagem}</div>
                                </li>
                            ))}
                        </ul>
                        <button className="btn_primario flex">
                            <FaDownload />
                            Exportar Relatórios
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModalRelatorios;
