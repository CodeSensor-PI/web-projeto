
import React, { useEffect, useState } from "react";
import "../ModalCadastrarRelatorio/Modal.css";
import { ajustarDataParaPTBR } from "../../../../utils/ajustarData";
import { FaDownload } from "react-icons/fa";
import { getRelatorioPorPaciente } from "../../../../provider/api/relatorios/fetchs-relatorios";
import { deleteRelatorio } from "../../../../provider/api/relatorios/fetchs-relatorios";
import { IoTrashBinOutline } from "react-icons/io5";


const ModalRelatorios = ({ onClose, pacienteId }) => {
    const [relatorios, setRelatorios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        async function fetchRelatorios() {
            const data = await getRelatorioPorPaciente(pacienteId);
            setRelatorios(Array.isArray(data) ? data : []);
            setLoading(false);
        }
        fetchRelatorios();
    }, [pacienteId]);

    const ajustarDataParaPTBR = (dataString) => {
        const dataObj = new Date(dataString);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return { data: dataFormatada, hora: horaFormatada };
    };

    const handleDelete = async (id) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este relatório?");
        if (!confirmar) return;

        try {
            await deleteRelatorio(id);
            setRelatorios(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            alert("Erro ao excluir relatório. Tente novamente.");
        }
    };


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
                            {relatorios.map((rel) => {

                                const { data, hora } = ajustarDataParaPTBR(rel.data);

                                return (
                                    <li key={rel.id}
                                        className="flex justify-between"
                                        style={{ background: '#f3f4f6', borderRadius: 8, marginBottom: 12, padding: '1em' }}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <strong>Data:</strong> {data} <strong>Hora:</strong> {hora}
                                            </div>
                                            <div style={{ marginTop: 6 }}>
                                                <strong>Relatório:</strong> {rel.conteudo}
                                            </div>
                                        </div>
                                        <button
                                            className="btn_deletar"
                                            onClick={handleDelete}
                                        >
                                            <IoTrashBinOutline size={24} />
                                        </button>
                                    </li>
                                );
                            })}
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
