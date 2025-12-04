import React from 'react';
import { FaPen, FaPlus, FaAddressCard } from 'react-icons/fa';
import './CardPaciente.css';

const CardPaciente = ({ paciente, onVisualizar, onAgendar }) => {
    const imgSrc = paciente?.imagemUrl || paciente?.imagem_url || paciente?.img || "https://ui-avatars.com/api/?name=" + encodeURIComponent(paciente?.nome || "Usuario") + "&size=200&background=667eea&color=fff&bold=true";
    return (
        <div className="paciente-card">
            <div className="flex gap-2">
                <img src={imgSrc} alt="" />
                <div className="div-info">
                    <h3>
                        <b>Nome: </b>
                        {paciente.nome}
                    </h3>

                    <div className="div-buttons flex gap-2">
                        <button
                            className="btn_secundario flex rounded-full"
                            onClick={() => onVisualizar(paciente.id)}
                        >
                            <FaAddressCard />
                            Visualizar
                        </button>
                        <button
                            className="btn_primario flex rounded-full"
                            onClick={() => onAgendar(paciente.id)}
                        >
                            <FaPlus className="icon" />
                            Agendar
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default CardPaciente;