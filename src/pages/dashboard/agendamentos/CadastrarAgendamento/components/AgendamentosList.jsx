import React from "react";

const AgendamentosList = ({ agendamentos }) => (
  <div className="agendamentos-container">
    <h3>Últimos Agendamentos</h3>
    <div className="agendamentos-list">
      {agendamentos.length > 0 ? (
        agendamentos.map((agendamento, index) => (
          <div key={index} className="agendamento-item">
            <p>
              <strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Horário:</strong> {agendamento.hora}
            </p>
            <p className="status-p">
              <strong>Status:</strong> {agendamento.statusSessao}
            </p>
          </div>
        ))
      ) : (
        <p>Nenhum agendamento encontrado para este paciente.</p>
      )}
    </div>
  </div>
);

export default AgendamentosList;
