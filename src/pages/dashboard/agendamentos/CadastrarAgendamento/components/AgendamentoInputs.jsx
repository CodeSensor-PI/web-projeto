import React from "react";
import PlanoMensalCheckbox from './PlanoMensalCheckbox.jsx';


const AgendamentoInputs = ({
    diaSemana,
    handleDiaSemanaChange,
    diasDoMes,
    diaMesSelecionado,
    setDiaMesSelecionado,
    setPacienteSelecionado,
    pacienteSelecionado,
    horario,
    setHorario,
    handlePlanoMensal
}) => (
    <div className="container-inputs flex gap-2">
        {/* Dia da semana */}
        <div className="select-container">
            <label htmlFor="diaSemana" className="input-label">
                Dia da Semana
            </label>
            <select
                id="diaSemana"
                name="diaSemana"
                required
                className="select-field w-full"
                value={diaSemana}
                onChange={handleDiaSemanaChange}
            >
                <option value="" disabled>
                    Selecione um dia da semana
                </option>
                <option value={1}>Segunda-feira</option>
                <option value={2}>Terça-feira</option>
                <option value={3}>Quarta-feira</option>
                <option value={4}>Quinta-feira</option>
                <option value={5}>Sexta-feira</option>
            </select>
        </div>
        {/* Dia do mês */}
        <div className="select-container w-full">
            <label htmlFor="diaMes" className="input-label">
                Dia do Mês
            </label>
            <select
                id="diaMes"
                name="diaMes"
                required
                className="select-field w-full"
                value={diaMesSelecionado}
                onChange={(e) => {
                    setDiaMesSelecionado(e.target.value);
                    setPacienteSelecionado((prev) => ({
                        ...prev,
                        selectedDate: e.target.value,
                    }));
                }}
            >
                <option value="" disabled>
                    Selecione o dia do mês
                </option>
                {diasDoMes.map((dia, idx) => (
                    <option key={idx} value={dia}>
                        {dia}
                    </option>
                ))}
            </select>
        </div>
        {/* Horário */}
        <div className="select-container w-full">
            <label htmlFor="horario" className="input-label">
                Horário
            </label>
            <select
                id="horario"
                name="horario"
                required
                className="select-field w-full"
                value={pacienteSelecionado?.horario || horario}
                onChange={(e) =>
                    setPacienteSelecionado((prev) => ({
                        ...prev,
                        horario: e.target.value,
                    }))
                }
            >
                <option value="" disabled>
                    Selecione um horário
                </option>
                {Array.from({ length: 9 }, (_, i) => {
                    const hour = (8 + i).toString().padStart(2, "0");
                    if (hour === "12") return null;
                    return (
                        <option key={hour} value={`${hour}:00`}>
                            {`${hour}:00`}
                        </option>
                    );
                })}
            </select>

        </div>
        <PlanoMensalCheckbox
            checked={pacienteSelecionado?.planoMensal || false}
            onChange={handlePlanoMensal}
        />
    </div>
);

export default AgendamentoInputs;
