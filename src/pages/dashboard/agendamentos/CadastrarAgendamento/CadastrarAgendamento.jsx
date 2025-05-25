import React, { use, useEffect } from "react";
import "./CadastrarAgendamento.css";
import { useParams, useSearchParams } from "react-router-dom";
import MenuLateralComponent from "../../components/MenuLateral/MenuLateralComponent";
import InputField from "../../components/InputField/InputField";
import { FaSearch, FaUser } from "react-icons/fa";
import { errorMessage, responseMessage } from "../../../../utils/alert.js";
import axios from "axios";
import MainComponent from "../../components/MainComponent/MainComponent.jsx";
import Checkbox from "../../components/Checkbox/Checkbox.jsx";
import {
  getPacientesPorId,
  getPacientes,
} from "../../../../provider/api/pacientes/fetchs-pacientes.js";
import {
  getAgendamentosPorPaciente,
  postAgendamento,
} from "../../../../provider/api/agendamentos/fetchs-agendamentos"; // Importa a função de adicionar agendamento
import { getPreferenciasPorId } from "../../../../provider/api/preferencias/fetchs-preferencias.js";

const CadastrarAgendamento = ({ paciente }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [pacientes, setPacientes] = React.useState([]);
  const [agendamentos, setAgendamentos] = React.useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = React.useState();
  const [query, setQuery] = React.useState(paciente ? paciente.nome : "");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [statusPlanoMensal, setStatusPlanoMensal] = React.useState(false);
  const [proximosDias, setProximosDias] = React.useState([]);
  const [horario, setHorario] = React.useState("10:00");
  const [preferencias, setPreferencias] = React.useState([]);
  const [diaSemana, setDiaSemana] = React.useState("");
  const [diasDoMes, setDiasDoMes] = React.useState([]);
  const [diaMesSelecionado, setDiaMesSelecionado] = React.useState("");

  useEffect(() => {
    const fetchPreferencias = async () => {
      try {
        if (pacienteSelecionado && pacienteSelecionado.id) {
          // Verifica se há um paciente selecionado
          const response = await getPreferenciasPorId(pacienteSelecionado.id); // Chama a função do provider
          setPreferencias(response); // Atualiza o estado com as preferências
          console.log("Preferências carregadas:", response);
        }
      } catch (err) {
        console.error("Erro ao buscar preferências:", err);
        errorMessage("Erro ao carregar as preferências.", "small");
      }
    };

    fetchPreferencias();
  }, [pacienteSelecionado]); // Executa apenas quando o pacienteSelecionado mudar

  useEffect(() => {
    const queryTimeSlot = searchParams.get("timeSlot");
    const queryDay = searchParams.get("day");

    // Atualiza apenas se os valores forem diferentes
    if (queryTimeSlot && queryTimeSlot !== horario) {
      setHorario(queryTimeSlot);
    }

    if (queryDay && pacienteSelecionado?.selectedDate !== queryDay) {
      setPacienteSelecionado((prev) => ({
        ...prev,
        selectedDate: queryDay,
      }));
    }
  }, [searchParams]); // Removido pacienteSelecionado para evitar loops

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
            tipo: pacienteResponse.tipo || "AVULSO", // Define um valor padrão para o tipo
          };
          setPacienteSelecionado(updatedPaciente);
          setQuery(pacienteResponse.nome);
          console.log(pacienteResponse);
        } catch (error) {
          console.error("Erro ao buscar paciente:", error);
        }
      };

      fetchPaciente();
    }
  }, [id]);

  const getProximosDias = (diaSemana) => {
    const hoje = new Date();
    const dias = [];
    diaSemana = diaSemana || hoje.getDay();
    const inicio = 7; // Começa a contar a partir de uma semana a partir de hoje
    const qtdDias = 4;

    for (let i = 0; i < qtdDias; i++) {
      const proximoDia = new Date(hoje);
      const diferenca = ((diaSemana - hoje.getDay() + 7) % 7) + inicio + i * 7;
      proximoDia.setDate(hoje.getDate() + diferenca);
      dias.push(
        proximoDia.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    }
    setProximosDias(dias);
    return dias;
  };

  const getNomeDiaSemana = (diaSemana) => {
    const dias = {
      DOMINGO: "Domingo",
      SEGUNDA: "Segunda-feira",
      TERCA: "Terça-feira",
      QUARTA: "Quarta-feira",
      QUINTA: "Quinta-feira",
      SEXTA: "Sexta-feira",
      SABADO: "Sábado",
    };

    return dias[diaSemana] || "Indefinido"; // Retorna "Indefinido" se o valor não for encontrado
  };

  useEffect(() => {
    const fetchAgendamentosPorPaciente = async () => {
      try {
        if (pacienteSelecionado && pacienteSelecionado.id) {
          const response = await getAgendamentosPorPaciente(
            pacienteSelecionado.id
          );
          setAgendamentos(response); // Atualiza o estado com os agendamentos
          console.log("Agendamentos carregados:", response);
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos por paciente:", error);
        errorMessage("Erro ao carregar os agendamentos.", "small");
      }
    };

    fetchAgendamentosPorPaciente();
  }, [pacienteSelecionado]);

  // useEffect(() => {
  //     console.log("Proximos dias: ", proximosDias);
  // }, [proximosDias]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await getPacientes(); // Chama a função de busca de pacientes
        setPacientes(data); // Atualiza o estado com os pacientes retornados
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchPacientes();
  }, []);

  const handlePacienteSearch = (query) => {
    setQuery(query);

    if (!query.trim()) {
      setPacienteSelecionado(null);
      setAgendamentos([]);
      setShowSuggestions(false);
      return;
    }

    const filteredPacientes = pacientes.filter((paciente) =>
      paciente.nome.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredPacientes.length === 1) {
      const selectedPaciente = filteredPacientes[0];
      setPacienteSelecionado((prev) => ({
        ...selectedPaciente,
        diaMes: getProximosDias(selectedPaciente.diaSemana),
        selectedDate: prev?.selectedDate || selectedPaciente.selectedDate || "",
        horario: prev?.horario || selectedPaciente.horario || horario,
        anotacao: prev?.anotacao || selectedPaciente.anotacao || "mensagem",
        tipo: selectedPaciente.tipo || "AVULSO",
      }));

      const filteredAgendamentos = agendamentos.filter(
        (agendamento) => agendamento.idPaciente === selectedPaciente.id
      );
      setAgendamentos(filteredAgendamentos);
    } else {
      setPacienteSelecionado(null);
      setAgendamentos([]);
    }

    setPacientes(filteredPacientes);
    setShowSuggestions(true);
  };

  const handleSelectPaciente = (paciente) => {
    setQuery(paciente);
    handlePacienteSearch(paciente);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handlePlanoMensal = (e) => {
    const isChecked = e.target.checked;
    setStatusPlanoMensal(isChecked);
    setPacienteSelecionado((prevPaciente) => ({
      ...prevPaciente,
      tipo: isChecked ? "PLANO" : "AVULSO",
    }));
  };

  React.useEffect(() => {
    setPacienteSelecionado((prevPaciente) => ({
      ...prevPaciente,
      planoMensal: statusPlanoMensal,
    }));
  }, [statusPlanoMensal]);

  const formatDateToBackend = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; // Converte para o formato yyyy-MM-dd
  };

  function formatHoraToBackend(hora) {
    if (!hora) return "00:00:00";
    if (/^\d{2}:\d{2}:\d{2}$/.test(hora)) return hora;
    if (/^\d{2}:\d{2}$/.test(hora)) return `${hora}:00`;
    return "00:00:00";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pacienteSelecionado) {
      errorMessage("Por favor, escolha um paciente para continuar.", "small");
      return;
    }

    if (!pacienteSelecionado.selectedDate) {
      errorMessage("Por favor, escolha uma data para continuar.", "small");
      return;
    }

    if (!pacienteSelecionado.horario) {
      errorMessage("Por favor, escolha um horário para continuar.", "small");
      return;
    }

    if (!pacienteSelecionado.tipo) {
      errorMessage("Por favor, escolha o tipo de sessão.", "small");
      return;
    }

    try {
      if (statusPlanoMensal) {
        // Cria quatro sessões, uma por semana no mesmo dia da semana
        const promises = Array.from({ length: 4 }).map((_, index) => {
          const diaAtual = new Date(pacienteSelecionado.selectedDate);
          diaAtual.setDate(diaAtual.getDate() + index * 7); // Adiciona 7 dias para cada semana

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
            data: formatDateToBackend(pacienteSelecionado.selectedDate), // yyyy-MM-dd
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
        // Cria apenas um agendamento para a data selecionada
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
          data: formatDateToBackend(pacienteSelecionado.selectedDate), // yyyy-MM-dd
          hora: formatHoraToBackend(pacienteSelecionado.horario || horario), // <-- string!
          tipo: pacienteSelecionado.tipo || "AVULSO",
          statusSessao: "PENDENTE",
          anotacao: "teste",
        };

        await postAgendamento(novoAgendamento);
        responseMessage("Agendamento cadastrado com sucesso!", "small");
      }
      // Só redireciona se não houve erro
      setTimeout(() => {
        window.location = "/dashboard/agendamentos";
      }, 1200);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        errorMessage(
          "Já existe um agendamento para este horário e data.",
          "small"
        );
      } else {
        errorMessage("Erro ao cadastrar agendamento.", "small");
      }
      // Não redireciona em caso de erro!
    }
  };

  React.useEffect(() => {
    if (paciente) {
      setPacienteSelecionado(paciente);
      setQuery(paciente.nome);
    }
  }, [paciente]);

  React.useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get("/api/pacientes");
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        errorMessage("Erro ao carregar a lista de pacientes.", "small");
      }
    };

    fetchPacientes();
  }, []);

  const handleDiaSemanaChange = (e) => {
    const selected = parseInt(e.target.value, 10);
    setDiaSemana(selected);
    const dias = getProximosDiasDoMes(selected);
    setDiasDoMes(dias);
    setDiaMesSelecionado(dias[0]); // seleciona o primeiro dia do mês disponível
    setPacienteSelecionado((prev) => ({
      ...prev,
      diaSemana: selected,
      selectedDate: dias[0],
    }));
  };

  React.useEffect(() => {
    if (pacienteSelecionado && pacienteSelecionado.diaSemana !== undefined) {
      setDiaSemana(pacienteSelecionado.diaSemana);
      const dias = getProximosDiasDoMes(pacienteSelecionado.diaSemana);
      setDiasDoMes(dias);
      // Só atualiza se o selectedDate for diferente do primeiro dia sugerido
      if (pacienteSelecionado.selectedDate !== dias[0]) {
        setPacienteSelecionado((prev) => ({
          ...prev,
          selectedDate: dias[0],
        }));
      }
    }
  }, [pacienteSelecionado]);

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
          <div className="w-[80%]">
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
              width={"w-[100%]"}
              icon={<FaUser />}
            />
            {showSuggestions && pacientes.length > 0 && (
              <ul className="suggestions-list">
                {pacientes.map((paciente, index) => (
                  <li
                    key={index}
                    onMouseDown={() => handleSelectPaciente(paciente.nome)}
                    className="suggestion-item"
                  >
                    {paciente.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="div-escolher-paciente">
            {!pacienteSelecionado ||
            query === "" ||
            pacienteSelecionado.nome !== query ? (
              <p className="mensagem-escolha-paciente">
                Selecione um paciente para continuar.
              </p>
            ) : (
              <div className="paciente-info">
                <p>
                  <strong>Paciente:</strong> {pacienteSelecionado.nome}
                </p>
                <p>
                  <strong>Horário para Consultas:</strong>{" "}
                  {preferencias.horario || "Indefinido"}
                </p>
                <p>
                  <strong>Dia para Consultas:</strong>{" "}
                  {getNomeDiaSemana(preferencias.diaSemana)}
                </p>
              </div>
            )}
          </div>

          <div className="container-sessao">
            {!pacienteSelecionado ||
            query === "" ||
            pacienteSelecionado.nome !== query ? (
              <p className="mensagem-escolha-paciente">
                Nenhum paciente selecionado. Por favor, escolha um paciente para
                continuar.
              </p>
            ) : (
              <>
                <div className="container-inputs flex gap-2">
                  <div className="select-container w-full">
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
                        return (
                          <option key={hour} value={`${hour}:00`}>
                            {`${hour}:00`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <Checkbox
                    labelTitle="Plano mensal ativo?"
                    onChange={handlePlanoMensal}
                    checked={statusPlanoMensal}
                  />
                </div>

                <div className="agendamentos-container">
                  <h3>Últimos Agendamentos</h3>
                  <div className="agendamentos-list">
                    {agendamentos.length > 0 ? (
                      agendamentos.map((agendamento, index) => (
                        <div key={index} className="agendamento-item">
                          <p>
                            <strong>Data:</strong>{" "}
                            {new Date(agendamento.data).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                          <p>
                            <strong>Horário:</strong> {agendamento.hora}
                          </p>
                          <p>
                            <strong>Status:</strong> {agendamento.statusSessao}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Nenhum agendamento encontrado para este paciente.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn_primario rounded-full">
              Salvar Alterações
            </button>
            <button
              className="btn_secundario rounded-full"
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

function getProximosDiasDoMes(selectedDiaSemana) {
  const hoje = new Date();
  const dias = [];
  const qtdDias = 4;
  // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  for (let i = 0; i < qtdDias; i++) {
    const data = new Date(hoje);
    // Calcula o próximo dia da semana desejado
    const diff = ((selectedDiaSemana - data.getDay() + 7) % 7) + i * 7;
    data.setDate(data.getDate() + diff);
    dias.push(
      data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );
  }
  return dias;
}
