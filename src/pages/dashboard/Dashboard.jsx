import React from "react";
import MenuLateralComponent from "./components/MenuLateral/MenuLateralComponent";

import KPIsComponent from "./components/KPIsComponent/KPIsComponent";
import AgendaDiaComponent from "./components/AgendaDiaComponent/AgendaDiaComponent";
import "./dashboard.css";
import GraficoComponent from "./components/GraficoComponent/GraficoComponent";
import MainComponent from "./components/MainComponent/MainComponent";

const Dashboard = () => {
  const [loading, setLoading] = React.useState(true);
  const [agendamentos, setAgendamentos] = React.useState([]);

  const valores = [
    {
      id: 1,
      valor: 10,
      texto: "Pacientes Agendados na Semana",
      alertColor: "--GreenAlertFy",
    },
    {
      id: 2,
      valor: 10,
      texto: "Cancelamentos na Semana",
      alertColor: "--YellowAlertFy",
    },
    {
      id: 3,
      valor: 10,
      texto: "% de Pacientes inativos",
      alertColor: "--RedAlertFy",
    },
  ];

  const pacientes = [
    {
      id: 1,
      nome: "Usuario Da Silva",
      horario: "14:30",
      status: "Confirmado",
    },
    {
      id: 2,
      nome: "Usuario De Souza",
      horario: "15:30",
      status: "Pendente",
    },
    {
      id: 3,
      nome: "Usuario Siqueira",
      horario: "16:30",
      status: "Cancelado",
    },
  ];

  const ultimaAtualizacao = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="dashboard flex">
      <MenuLateralComponent></MenuLateralComponent>
      <MainComponent
        title="Dashboard"
        headerContent={
          <div className="flex w-full gap-2 items-center justify-between">
            <p className="font-bold">
              Olá, {localStorage.getItem("nomeUsuario")}
            </p>
            <p>
              Última atualização: <b>{ultimaAtualizacao}</b>
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between gap-2">
            {valores.map((valor, index) => {
              return (
                <KPIsComponent
                  key={index}
                  valor={valor.valor}
                  texto={valor.texto}
                  alertColor={valor.alertColor}
                />
              );
            })}
          </div>
          <div className="second-section flex gap-2">
            <div className="agendas-section w-1/2 flex flex-col items-center">
              <h1 className="font-bold text-xl">Pacientes do Dia (01/01)</h1>
              <div className="agendas-diario">
                {pacientes.map((paciente, index) => {
                  return (
                    <AgendaDiaComponent
                      key={index}
                      nome={paciente.nome}
                      horario={paciente.horario}
                      status={paciente.status}
                    ></AgendaDiaComponent>
                  );
                })}
              </div>
            </div>
            <div className="grafico-section w-1/2 flex flex-col items-center bg-amber-300">
              <h1 className="font-bold text-xl">Gráfico de Agendamentos</h1>
              <GraficoComponent></GraficoComponent>
            </div>
          </div>
        </div>
      </MainComponent>
    </div>
  );
};

export default Dashboard;
