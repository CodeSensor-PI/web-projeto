 
import PacienteInfo from "./components/PacienteInfo";
import AgendamentosList from "./components/AgendamentosList";
import AgendamentoInputs from "./components/AgendamentoInputs";
import React, { useEffect, useState, useCallback } from "react";
import "./CadastrarAgendamento.css";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import MenuLateralComponent from "../../components/MenuLateral/MenuLateralComponent";
import { errorMessage, responseMessage } from "../../../../utils/alert.js";
import MainComponent from "../../components/MainComponent/MainComponent.jsx";
import { getPacientesPorId } from "../../../../provider/api/pacientes/fetchs-pacientes.js";
import {
  getAgendamentosPorPaciente,
  postAgendamento,
} from "../../../../provider/api/agendamentos/fetchs-agendamentos";
import { getPreferenciasPorId } from "../../../../provider/api/preferencias/fetchs-preferencias.js";
import UserSearch from "../../components/UserSearch/UserSearch.jsx";
import {
  getProximosDias,
  getProximosDiasDoMes,
  getNomeDiaSemana,
  formatDateToBackend,
  formatHoraToBackend,
  montarPacienteComPadrao,
} from "../../../../utils/agendamentoUtils";
import SaveButton from "../../components/SaveButton/SaveButton";

// Componente principal de cadastro de agendamento
const CadastrarAgendamento = ({ paciente }) => {
  // Estados principais
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [agendamentos, setAgendamentos] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState();
  const [query, setQuery] = useState(paciente ? paciente.nome : "");
  const [horario, setHorario] = useState();
  const [preferencias, setPreferencias] = useState([]);
  const [diaSemana, setDiaSemana] = useState("");
  const [diasDoMes, setDiasDoMes] = useState([]);
  const [diaMesSelecionado, setDiaMesSelecionado] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Busca preferências do paciente selecionado
  useEffect(() => {
    const fetchPreferencias = async () => {
      try {
        if (pacienteSelecionado && pacienteSelecionado.id) {
          const response = await getPreferenciasPorId(pacienteSelecionado.id);
          setPreferencias(response);
        }
      } catch (err) {
        errorMessage("Paciente não possui preferências.", "small");
      }
    };
    fetchPreferencias();
  }, [pacienteSelecionado]);

  // Busca dados do paciente pelo id da URL
  useEffect(() => {
    if (id) {
      const fetchPaciente = async () => {
        try {
          const pacienteResponse = await getPacientesPorId(id);
          const diasCalculados = getProximosDias(pacienteResponse.diaSemana);
          const updatedPaciente = {
            ...pacienteResponse,
            diaMes: diasCalculados,
            horario: pacienteResponse.horario || "00:00",
            selectedDate: pacienteResponse.selectedDate || "00/00",
            planoMensal: pacienteResponse.planoMensal || false,
            statusAgendamento: pacienteResponse.statusAgendamento || "Pendente",
            tipo: pacienteResponse.tipo || "AVULSO",
          };
          setPacienteSelecionado(updatedPaciente);
          setQuery(pacienteResponse.nome);
        } catch (error) {
          console.error("Erro ao buscar paciente:", error);
        }
      };
      fetchPaciente();
    }
  }, [id]);

  // Busca agendamentos do paciente selecionado
  useEffect(() => {
    const fetchAgendamentosPorPaciente = async () => {
      try {
        if (pacienteSelecionado && pacienteSelecionado.id) {
          const response = await getAgendamentosPorPaciente(
            pacienteSelecionado.id
          );
          setAgendamentos(response);
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos por paciente:", error);
        errorMessage("Erro ao carregar os agendamentos.", "small");
      }
    };
    fetchAgendamentosPorPaciente();
  }, [pacienteSelecionado]);

  // Manipula seleção do plano mensal agora está em handlePlanoMensal (useCallback) e não há mais statusPlanoMensal

  // Submissão do formulário de agendamento
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !pacienteSelecionado ||
      !pacienteSelecionado.id ||
      !pacienteSelecionado.selectedDate ||
      !pacienteSelecionado.horario ||
      !pacienteSelecionado.tipo ||
      !diaSemana ||
      !diaMesSelecionado
    ) {
      errorMessage(
        "Por favor, preencha todos os campos obrigatórios para continuar.",
        "small"
      );
      return;
    }

    const [dia, mes, ano] = (
      pacienteSelecionado.selectedDate || diaMesSelecionado
    ).split("/");

    const horarioSelecionado =
      pacienteSelecionado.horario || horario || "08:00";
    const [hour, minute, second] = horarioSelecionado.split(":");

    const dataAgendamento = new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
      Number(hour),
      Number(minute),
      Number(second || "0")
    );

    const agora = new Date();

    if (dataAgendamento < agora) {
      errorMessage(
        "Não é possível agendar para um horário que já passou.",
        "small"
      );
      return;
    }

    try {
  if (pacienteSelecionado.planoMensal) {
        const promises = Array.from({ length: 4 }).map((_, index) => {
          const [day, month, year] = (
            pacienteSelecionado.selectedDate || ""
          ).split("/");
          const baseDate = new Date(`${year}-${month}-${day}T00:00:00`);
          baseDate.setDate(baseDate.getDate() + index * 7);
          const dataFormatada = baseDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const novoAgendamento = {
            fkPaciente: {
              id: pacienteSelecionado.id,
              nome: pacienteSelecionado.nome,
              cpf: pacienteSelecionado.cpf || "000.000.000-00",
              email: pacienteSelecionado.email,
              status: "ATIVO",
              fkPlano: {
                id: pacienteSelecionado.fkPlano?.id || 0,
                categoria: pacienteSelecionado.fkPlano?.categoria || "Básico",
                preco: pacienteSelecionado.fkPlano?.preco || 0,
              },
            },
            data: formatDateToBackend(dataFormatada),
            hora: formatHoraToBackend(pacienteSelecionado.horario || horario),
            tipo: pacienteSelecionado.tipo || "AVULSO",
            statusSessao: "PENDENTE",
            anotacao: "teste",
          };
          return postAgendamento(novoAgendamento);
        });
        await Promise.all(promises);
        responseMessage("Agendamentos cadastrados com sucesso!", "small");
      } else {
        const novoAgendamento = {
          fkPaciente: {
            id: pacienteSelecionado.id,
            nome: pacienteSelecionado.nome,
            cpf: pacienteSelecionado.cpf || "000.000.000-00",
            email: pacienteSelecionado.email,
            status: "ATIVO",
            fkPlano: {
              id: pacienteSelecionado.fkPlano?.id || 0,
              categoria: pacienteSelecionado.fkPlano?.categoria || "Básico",
              preco: pacienteSelecionado.fkPlano?.preco || 0,
            },
          },
          data: formatDateToBackend(pacienteSelecionado.selectedDate),
          hora: formatHoraToBackend(pacienteSelecionado.horario || horario),
          tipo: pacienteSelecionado.tipo || "AVULSO",
          statusSessao: "PENDENTE",
          anotacao: "teste",
        };
        await postAgendamento(novoAgendamento);
        responseMessage("Agendamento cadastrado com sucesso!", "small");
      }
      setTimeout(() => {
        window.location = "/dashboard/agendamentos";
      }, 1200);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        errorMessage("Já existe um agendamento neste dia e horário.", "small");
      } else {
        errorMessage("Erro ao cadastrar agendamento.", "small");
      }
      console.error("Erro ao cadastrar agendamento:", error);
    }
  };

   // Função para manipular o checkbox do plano mensal
  const handlePlanoMensal = (e) => {
    const isChecked = e.target.checked;
    setPacienteSelecionado((prevPaciente) => ({
      ...prevPaciente,
      tipo: isChecked ? "PLANO" : "AVULSO",
      planoMensal: isChecked,
    }));
  };

  // Atualiza paciente selecionado ao receber novo paciente via props
  useEffect(() => {
    if (paciente) {
      setPacienteSelecionado(paciente);
      setQuery(paciente.nome);
    }
  }, [paciente]);

  // Manipula mudança do dia da semana
  const handleDiaSemanaChange = (e) => {
    const selected = parseInt(e.target.value, 10);
    setDiaSemana(selected);
    const dias = getProximosDiasDoMes(selected);
    setDiasDoMes(dias);
    setDiaMesSelecionado(dias[0]);
    setPacienteSelecionado((prev) => ({
      ...prev,
      diaSemana: selected,
      selectedDate: dias[0],
    }));
  };

  // Atualiza dias do mês e selectedDate conforme paciente selecionado
  React.useEffect(() => {
    if (pacienteSelecionado && pacienteSelecionado.diaSemana !== undefined) {
      setDiaSemana(pacienteSelecionado.diaSemana);
      const dias = getProximosDiasDoMes(pacienteSelecionado.diaSemana);
      setDiasDoMes(dias);
      setPacienteSelecionado((prev) => {
        if (!prev.selectedDate || !dias.includes(prev.selectedDate)) {
          return {
            ...prev,
            selectedDate: dias[0],
          };
        }
        return prev;
      });
    }
  }, [pacienteSelecionado]);

  // Lê parâmetros da URL para preencher campos automaticamente
  useEffect(() => {
    const timeSlotParam = searchParams.get("timeSlot");
    const dayParam = searchParams.get("day");

    if (dayParam) {
      setDiaMesSelecionado(dayParam);
      const [dia, mes, ano] = dayParam.split("/");
      const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
      const jsDiaSemana = data.getDay();
      const diaSemanaSelect =
        jsDiaSemana >= 1 && jsDiaSemana <= 5 ? jsDiaSemana : 1;

      setDiaSemana(diaSemanaSelect);
      setPacienteSelecionado((prev) =>
        prev
          ? {
            ...prev,
            selectedDate: dayParam,
            diaSemana: diaSemanaSelect,
          }
          : prev
      );
    }
    if (timeSlotParam) {
      setHorario(timeSlotParam);
      setPacienteSelecionado((prev) =>
        prev ? { ...prev, horario: timeSlotParam } : prev
      );
    }
  }, [searchParams]);

  // Validação do formulário
  const isFormValid =
    pacienteSelecionado &&
    pacienteSelecionado.id &&
    (pacienteSelecionado.selectedDate || diaMesSelecionado) &&
    (pacienteSelecionado.horario || horario) &&
    pacienteSelecionado.tipo &&
    diaSemana &&
    diaMesSelecionado;

  // Renderização do formulário e componentes
  return (
    <>
      <MenuLateralComponent />

      <MainComponent
        title="Cadastrar Agendamento"
        headerContent={
          <div className="flex w-full justify-start">
            <button
              className="btn_agendamento"
              onClick={() => (window.location.href = "/dashboard/agendamentos")}
            >
              {"< Voltar"}
            </button>
          </div>
        }
      >
        <form
          className="form-cadastrar-agendamento"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Seção de seleção de paciente */}
          <div className="w-[80%] div-escolher-paciente">
            {!pacienteSelecionado || !pacienteSelecionado.id ? (
              <div className=" w-[50%] div-input-escolher-paciente">
                <UserSearch
                  onUserSelect={(p) =>
                    setPacienteSelecionado(
                      p
                        ? montarPacienteComPadrao(p, {
                            horario: pacienteSelecionado?.horario || horario,
                            selectedDate:
                              pacienteSelecionado?.selectedDate ||
                              diaMesSelecionado,
                            diaSemana: pacienteSelecionado?.diaSemana || diaSemana,
                          })
                        : undefined
                    )
                  }
                />
              </div>
            ) : (
              <>
                <div className=" w-[30%] div-input-escolher-paciente">
                  <UserSearch
                    onUserSelect={(p) =>
                      setPacienteSelecionado(
                        p
                          ? montarPacienteComPadrao(p, {
                              horario: pacienteSelecionado?.horario || horario,
                              selectedDate:
                                pacienteSelecionado?.selectedDate ||
                                diaMesSelecionado,
                              diaSemana: pacienteSelecionado?.diaSemana || diaSemana,
                            })
                          : undefined
                      )
                    }
                  />
                </div>
                <PacienteInfo paciente={pacienteSelecionado} preferencias={preferencias} />
              </>
            )}
          </div>

          {/* Seção de inputs do agendamento */}
          <div className="container-sessao">
            {!pacienteSelecionado || !pacienteSelecionado.id ? (
              <p className="mensagem-escolha-paciente">
                Nenhum paciente selecionado. Por favor, escolha um paciente para continuar.
              </p>
            ) : (
              <>
                <AgendamentoInputs
                  diaSemana={diaSemana}
                  handleDiaSemanaChange={handleDiaSemanaChange}
                  diasDoMes={diasDoMes}
                  diaMesSelecionado={diaMesSelecionado}
                  setDiaMesSelecionado={setDiaMesSelecionado}
                  setPacienteSelecionado={setPacienteSelecionado}
                  pacienteSelecionado={pacienteSelecionado}
                  horario={horario}
                  setHorario={setHorario}
                  handlePlanoMensal={handlePlanoMensal}
                />
                <AgendamentosList agendamentos={agendamentos} />
              </>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <SaveButton
              icon="📄"
              textContent="Salvar Alterações"
              disabled={!isFormValid}
              onClick={handleSubmit}
            />
            <button
              className="btn_secundario rounded-full h-10 mt-auto"
              onClick={() => (window.location.href = "/dashboard/agendamentos")}
              type="button"
            >
              Cancelar
            </button>
          </div>
        </form>
      </MainComponent>
    </>
  );
};

export default CadastrarAgendamento;
