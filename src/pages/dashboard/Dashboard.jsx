import React, { useEffect, useState } from "react";
import MenuLateralComponent from "./components/MenuLateral/MenuLateralComponent";
import KPIsComponent from "./components/KPIsComponent/KPIsComponent";
import AgendaDiaComponent from "./components/AgendaDiaComponent/AgendaDiaComponent";
import GraficoComponent from "./components/GraficoComponent/GraficoComponent";
import MainComponent from "./components/MainComponent/MainComponent";
import "./dashboard.css";
import {
  getKpiQtdSessaoCanceladas,
  getKpiPorcentPacienteInativos,
} from "../../provider/api/dashboard/fetchs-dashboard";
import {
  getSessoesSemana,
  getSessoesDia,
} from "../../provider/api/dashboard/axios-dashboard";

// Utilitário para cor das KPIs
function getKpiColor(tipo, valor) {
  const num = Number(valor);
  if (tipo === "cancelamentos") {
    if (num >= 30) return "RedAlertFy";
    if (num >= 10) return "YellowAlertFy";
    return "GreenAlertFy";
  }
  if (tipo === "inativos") {
    if (num >= 50) return "RedAlertFy";
    if (num >= 20) return "YellowAlertFy";
    return "GreenAlertFy";
  }
  if (tipo === "agendados" || tipo === "sessoes") {
    if (num < 5) return "RedAlertFy";
    if (num < 15) return "YellowAlertFy";
    return "GreenAlertFy";
  }
  return "RedAlertFy";
}

// Utilitário para formatar semana
function formatAnoSemana(anoSemana) {
  if (!anoSemana || anoSemana.length < 6) return anoSemana;
  return `${anoSemana.slice(0, 4)}/${anoSemana.slice(4)}`;
}

const Dashboard = () => {
  const [loadingKpi, setLoadingKpi] = useState(true);
  const [loadingDia, setLoadingDia] = useState(true);
  const [kpiData, setKpiData] = useState([]);
  const [showPacientes, setShowPacientes] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [qtdSessaoCancelada, setQtdSessaoCancelada] = useState(0);
  const [qtdPacientesInativos, setQtdPacientesInativos] = useState(0);
  const [error, setError] = useState(null);

  // Carrega KPIs de cancelamentos e inativos
  useEffect(() => {
    async function fetchDadosKpis() {
      try {
        const [canceladas, inativos] = await Promise.all([
          getKpiQtdSessaoCanceladas(),
          getKpiPorcentPacienteInativos(),
        ]);
        setQtdSessaoCancelada(canceladas.qtdCancelada ?? 0);
        setQtdPacientesInativos(inativos.porcentPacienteInativo ?? 0);
      } catch (err) {
        setError(err.message || "Erro ao buscar dados das KPIs");
        setQtdSessaoCancelada(0);
        setQtdPacientesInativos(0);
      }
    }
    fetchDadosKpis();
  }, []);

  // Carrega KPIs de agendados/sessões semanais
  useEffect(() => {
    async function fetchKpi() {
      setLoadingKpi(true);
      const getAnoSemana = (date) => {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const week = Math.ceil(
          ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7
        );
        return `${date.getFullYear()}${week.toString().padStart(2, "0")}`;
      };
      const now = new Date();
      const semanaAtual = getAnoSemana(now);
      const semanaAnterior = getAnoSemana(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      );
      try {
        const data = await getSessoesSemana([semanaAtual, semanaAnterior]);
        setKpiData(data);
      } catch (e) {
        setKpiData([]);
      }
      setLoadingKpi(false);
    }
    fetchKpi();
  }, []);

  // Carrega pacientes do dia
  useEffect(() => {
    async function fetchPacientesDia() {
      setLoadingDia(true);
      try {
        const data = await getSessoesDia();
        const pacientesFormatados = data.map((sessao) => ({
          id: sessao.idSessao,
          nome: sessao.nomePaciente,
          horario: sessao.hora?.slice(0, 5),
          status: sessao.status,
        }));
        setPacientes(pacientesFormatados);
      } catch (e) {
        setPacientes([]);
      }
      setLoadingDia(false);
    }
    fetchPacientesDia();
  }, []);

  // Monta array de KPIs extras
  const kpisExtras = [
    {
      id: 2,
      valor: `${qtdSessaoCancelada}%`,
      texto: "Cancelamentos na Semana",
      cor: getKpiColor("cancelamentos", qtdSessaoCancelada),
    },
    {
      id: 3,
      valor: `${qtdPacientesInativos}%`,
      texto: "Pacientes Inativos",
      cor: getKpiColor("inativos", qtdPacientesInativos),
    },
  ];

  // Valor e cor da KPI principal
  const kpiPrincipalValor = kpiData[0]
    ? showPacientes
      ? kpiData[0].pacientesAgendados
      : kpiData[0].totalSessoes
    : 0;
  const kpiPrincipalTexto = kpiData[0]
    ? showPacientes
      ? `Pacientes Agendados na Semana (${formatAnoSemana(
          kpiData[0].anoSemana
        )})`
      : `Total de Sessões na Semana (${formatAnoSemana(kpiData[0].anoSemana)})`
    : "Pacientes Agendados na Semana";
  const kpiPrincipalCor = getKpiColor(
    showPacientes ? "agendados" : "sessoes",
    kpiPrincipalValor
  );

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
      <MenuLateralComponent />
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
        <div className="pacientes-background">
          <div className="h-[20%] flex w-full justify-between gap-2">
            {/* KPI dinâmica - Pacientes Agendados na Semana */}
            <div className="flex-1 flex-col items-center">
              <KPIsComponent
                valor={loadingKpi ? "0" : kpiPrincipalValor}
                texto={kpiPrincipalTexto}
                cor={kpiPrincipalCor}
              />
            </div>
            {/* KPIs extras */}
            {kpisExtras.map((valor) => (
              <div key={valor.id} className="flex-1 flex flex-col items-center">
                <KPIsComponent
                  valor={valor.valor}
                  texto={valor.texto}
                  cor={valor.cor}
                />
              </div>
            ))}
          </div>
          <div className="second-section flex gap-2">
            <div className="agendas-section w-1/2 flex flex-col items-center">
              <h1 className="font-bold text-xl">
                Pacientes do Dia ({new Date().toLocaleDateString("pt-BR")})
              </h1>
              <div className="agendas-diario">
                {loadingDia ? (
                  <p>Carregando...</p>
                ) : pacientes.length === 0 ? (
                  <p>Nenhum paciente agendado para hoje.</p>
                ) : (
                  pacientes.map((paciente) => (
                    <AgendaDiaComponent
                      key={paciente.id}
                      nome={paciente.nome}
                      horario={paciente.horario}
                      status={paciente.status}
                      id={paciente.id}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="grafico-section w-1/2 flex flex-col items-center bg-amber-300">
              <h1 className="font-bold text-xl">Gráfico de Agendamentos</h1>
              {kpiData && kpiData.length > 0 ? (
                <GraficoComponent data={kpiData} />
              ) : (
                <p>Nenhum dado para exibir no gráfico.</p>
              )}
            </div>
          </div>
        </div>
      </MainComponent>
    </div>
  );
};

export default Dashboard;
