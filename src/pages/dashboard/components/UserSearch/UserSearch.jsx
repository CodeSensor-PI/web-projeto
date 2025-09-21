import React, { useState, useEffect } from "react";
import InputField from "../InputField/InputField";
import { FaUser } from "react-icons/fa";
import { errorMessage } from "../../../../utils/alert";
import axios from "axios";
import { getPacientes, getPacientesLista } from "../../../../provider/api/pacientes/fetchs-pacientes";

const UserSearch = ({
    onUserSelect,
    labelTitle = "Escolha o Paciente",
    placeholder = "Nome do Paciente",
    width = "w-[100%]",
    className = "styled-input",
    useIcon = true,
    ...rest
}) => {
    const [todosPacientes, setTodosPacientes] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                // Pré-carrega uma primeira página com 50 itens para sugestões iniciais
                const data = await getPacientes(1, 50);
                const lista = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
                setTodosPacientes(lista);
                setPacientes(lista);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchPacientes();
    }, []);

    const handlePacienteSearch = async (query) => {
        setQuery(query);

        const listaPacientes = Array.isArray(todosPacientes) ? todosPacientes : [];

        if (!query.trim()) {
            setPacientes(listaPacientes);
            setShowSuggestions(false);
            onUserSelect(null);
            return;
        }

        try {
            const serverList = await getPacientesLista(query.trim());
            const arr = Array.isArray(serverList) ? serverList : [];
            setPacientes(arr);
        } catch (e) {
            setPacientes([]);
        }
        setShowSuggestions(true);
        onUserSelect(null); // <-- só seleciona ao clicar!
    };

    const handleSelectPaciente = (paciente) => {
        setQuery(paciente.nome);
        setShowSuggestions(false);
        onUserSelect(paciente);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <div className={`${width} relative`}>
            <InputField
                type="text"
                id="paciente"
                name="paciente"
                placeholder="Nome do Paciente"
                labelTitle="Escolha o Paciente"
                onChange={(e) => handlePacienteSearch(e.target.value)}
                value={query}
                onBlur={handleBlur}
                required
                className="styled-input"
                containerWidth={"w-[100%]"}
                width={"w-[100%]"}
                icon={useIcon && <FaUser />}
            />
            {showSuggestions && pacientes.length > 0 && (
                <ul className="suggestions-list w-full">
                    {pacientes.map((paciente, index) => (
                        <li
                            key={index}
                            onMouseDown={() => handleSelectPaciente(paciente)} // Passe o objeto inteiro!
                            className="suggestion-item"
                        >
                            {paciente.nome}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default UserSearch;