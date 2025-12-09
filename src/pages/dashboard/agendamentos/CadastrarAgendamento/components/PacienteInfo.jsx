import React from "react";

const PacienteInfo = ({ paciente, preferencias }) => {
  if (!paciente) return null;
  return (
    <div className="paciente-info">
      <p>
        <strong>Paciente:</strong> {paciente.nome}
      </p>
      <p>
        <strong>Dia para Consultas:</strong> {preferencias?.diaSemana || "Indefinido"}
      </p>
      <p>
        <strong>Horário para Consultas:</strong> {preferencias?.horario || "Indefinido"}
      </p>
    </div>
  );
};

export default PacienteInfo;
