import { useEffect, useState } from "react";
import MainComponent from "../../components/MainComponent/MainComponent";
import MenuLateralComponent from "../../components/MenuLateral/MenuLateralComponent";
import "./EditarAgendamento.css";
import { FaFileArrowUp, FaTrashCan } from "react-icons/fa6";
import { FaFile, FaRegSave, FaSave } from "react-icons/fa";
import {
  confirmCancelEdit,
  errorMessage,
  responseMessage,
} from "../../../../utils/alert.js";
import { useParams } from "react-router-dom";
import {
  cancelAgendamento,
  getAgendamentosPorId,
} from "../../../../provider/api/agendamentos/fetchs-agendamentos.js";
import { putAgendamento } from "../../../../provider/api/agendamentos/fetchs-agendamentos.js";
import UserSearch from "../../components/UserSearch/UserSearch";
import ModalRelatorio from "../../components/ModalCadastrarRelatorio/ModalCadastrarRelatorio.jsx";
import { getRelatorioPorSessao } from "../../../../provider/api/agendamentos/fetchs-relatorio";
import {
  formatDateToBackend,
  formatDateToFrontend,
} from "../../../../utils/agendamentoUtils";

const EditarAgendamento = () => {
  const [paciente, setPaciente] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [diasDoMes, setDiasDoMes] = useState({});
  const [agendamento, setAgendamento] = useState({});
  const [diaSemana, setDiaSemana] = useState(0);
  const [novoHorario, setNovoHorario] = useState("");
  const [novoPacienteSelecionado, setNovoPacienteSelecionado] = useState(null);
  const [showModalRelatorio, setShowModalRelatorio] = useState(false);
  const [relatorioExistente, setRelatorioExistente] = useState(null);
  const [loadingRelatorio, setLoadingRelatorio] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const response = await getAgendamentosPorId(id);
        console.log("Agendamento carregado:", response);

        if (response && response.id) {
          setAgendamento(response);
          let horaPadronizada = response.hora;

          if (
            horaPadronizada &&
            horaPadronizada.length === 8 &&
            horaPadronizada.split(":").length === 3
          ) {
            const [h, m] = horaPadronizada.split(":");
            horaPadronizada = h.padStart(2, "0") + ":" + m.padStart(2, "0");
          } else if (horaPadronizada && !horaPadronizada.includes(":")) {
            horaPadronizada = horaPadronizada.padStart(2, "0") + ":00";
          } else if (
            horaPadronizada &&
            horaPadronizada.match(/^\d{1,2}:\d{1,2}$/)
          ) {
            const [h, m] = horaPadronizada.split(":");
            horaPadronizada = h.padStart(2, "0") + ":" + m.padStart(2, "0");
          }
          setPaciente({
            id: response.fkPaciente.id,
            nome: response.fkPaciente.nome,
            cpf: response.fkPaciente.cpf,
            email: response.fkPaciente.email,
            status: response.fkPaciente.status,
            fkPlano: response.fkPaciente.fkPlano,
            data: response.data,
            horario: horaPadronizada,
            diaSemana: new Date(response.data).getDay(),
            statusSessao: response.statusSessao,
          });
          setNovoHorario(horaPadronizada);
          // Buscar relatório existente para a sessão
          setLoadingRelatorio(true);
          const relatorio = await getRelatorioPorSessao(response.id);
          if (relatorio && relatorio.conteudo) {
            setRelatorioExistente(relatorio.conteudo);
          } else {
            setRelatorioExistente(null);
          }
          setLoadingRelatorio(false);
        } else {
          console.error("Nenhum agendamento encontrado para o ID:", id);
        }
      } catch (error) {
        console.error("Erro ao carregar agendamento:", error);
      }
    };

    fetchAgendamento();
  }, [id]);

  useEffect(() => {
    if (paciente && paciente.data) {
      const diaSemanaCalculado = new Date(
        Date.UTC(
          parseInt(paciente.data.split("-")[0], 10),
          parseInt(paciente.data.split("-")[1], 10) - 1,
          parseInt(paciente.data.split("-")[2], 10)
        )
      ).getUTCDay();
      setDiaSemana(diaSemanaCalculado);

      const diasDoMesAtualizados = Array.from({ length: 4 }, (_, i) => {
        const data = new Date();
        data.setDate(
          data.getDate() +
            i * 7 +
            ((diaSemanaCalculado - data.getDay() + 7) % 7)
        );
        return data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      });

      setDiasDoMes({ diaMes: diasDoMesAtualizados });
    }
  }, [paciente]);

  const handleAtualizarAgendamento = async (e) => {
    e.preventDefault();
    if (agendamento.statusSessao === "CANCELADA" && !novoPacienteSelecionado) {
      errorMessage("Selecione um novo paciente para reativar o agendamento.");
      return;
    }
    const pacienteParaSalvar =
      agendamento.statusSessao === "CANCELADA" && novoPacienteSelecionado
        ? novoPacienteSelecionado
        : paciente;
    const dataParaSalvar = paciente.data;
    const diaSemanaParaSalvar = paciente.diaSemana;

    const requestBody = {
      id: agendamento.id,
      fkPaciente: {
        id: pacienteParaSalvar.id,
        nome: pacienteParaSalvar.nome,
        cpf: pacienteParaSalvar.cpf,
        email: pacienteParaSalvar.email,
        status: pacienteParaSalvar.status,
        fkPlano: {
          id: pacienteParaSalvar.fkPlano?.id,
          categoria: pacienteParaSalvar.fkPlano?.categoria,
          preco: pacienteParaSalvar.fkPlano?.preco,
        },
      },
      data:
        typeof dataParaSalvar === "string" && dataParaSalvar.includes("/")
          ? formatDateToBackend(dataParaSalvar)
          : dataParaSalvar,
      hora: novoHorario,
      tipo: agendamento.tipo,
      statusSessao:
        agendamento.statusSessao === "CANCELADA"
          ? "PENDENTE"
          : pacienteParaSalvar.statusSessao,
      anotacao: agendamento.anotacao,
      createdAt: agendamento.createdAt,
    };

    try {
      await putAgendamento(agendamento.id, requestBody);
      responseMessage("Agendamento atualizado com sucesso!", "small");
      setTimeout(() => {
        window.location = "/dashboard/agendamentos";
      }, 1200);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      errorMessage("Erro ao atualizar agendamento.");
    }
  };

  const handleDiaSemanaChange = (e) => {
    const selectedDiaSemana = parseInt(e.target.value, 10);
    setDiaSemana(selectedDiaSemana);

    const diasDoMesAtualizados = Array.from({ length: 4 }, (_, i) => {
      const data = new Date();
      data.setDate(
        data.getDate() + i * 7 + ((selectedDiaSemana - data.getDay() + 7) % 7)
      );
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    });

    setDiasDoMes({ diaMes: diasDoMesAtualizados });
    setPaciente({
      ...paciente,
      diaSemana: selectedDiaSemana,
      data: formatDateToBackend(diasDoMesAtualizados[0]),
    });
  };

  useEffect(() => {
    console.log("Paciente Data:", paciente.data);
    console.log("Dia da Semana Calculado:", diaSemana);
  }, [paciente, diaSemana]);

  useEffect(() => {
    if (paciente && paciente.horario) {
      setNovoHorario(paciente.horario);
    }
  }, [paciente.horario]);

  const cancelarAgendamento = async (id) => {
    const result = await confirmCancelEdit(
      "Cancelar edição?",
      "Tem certeza que deseja cancelar a sessão?",
      "medium"
    );
    if (result.isConfirmed) {
      try {
        await cancelAgendamento(id, { statusSessao: "CANCELADA" });
        responseMessage("Agendamento cancelado com sucesso!");
        setTimeout(() => {
          window.location.href = "/dashboard/agendamentos";
        }, 1200);
      } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        errorMessage("Erro ao cancelar agendamento.");
      }
    }
  };

  console.log("Horário selecionado:", paciente.horario);

  return (
    <>
      <MenuLateralComponent />
      <MainComponent
        title={"Editar Agendamento"}
        headerContent={
          <div className="flex gap-2 justify-between w-full">
            <button
              className="btn_agendamento"
              onClick={() => (window.location.href = "/dashboard/agendamentos")}
            >
              {"< Voltar"}
            </button>
            {agendamento.statusSessao !== "CANCELADA" &&
              agendamento.statusSessao !== "CONCLUIDA" && (
                <button
                  className="btn_agendamento rounded-full flex gap-2 m-0"
                  type="button"
                  onClick={() => cancelarAgendamento(agendamento.id)}
                >
                  <FaTrashCan className="" size={20} />
                  Cancelar Agendamento
                </button>
              )}
          </div>
        }
      >
        <form
          className="form-editar-agendamento"
          noValidate
          onSubmit={handleAtualizarAgendamento}
        >
          <section className="container-editar-agendamento">
            {paciente && (
              <div className="paciente-info-editar">
                <p>
                  <strong>Paciente Selecionado:</strong>{" "}
                  {novoPacienteSelecionado
                    ? novoPacienteSelecionado.nome
                    : paciente.nome}
                </p>
                <p>
                  <strong>Horário Marcado:</strong> {paciente.horario}
                </p>
                <p>
                  <strong>Data Marcada:</strong>{" "}
                  {formatDateToFrontend(agendamento.data)}
                </p>
                <div className="pendente-container">
                  <span
                    className={`status ${
                      agendamento.statusSessao === "PENDENTE"
                        ? "status-sessao-pendente"
                        : agendamento.statusSessao === "CONFIRMADA"
                        ? "status-sessao-ok"
                        : agendamento.statusSessao === "CANCELADA"
                        ? "status-cancelado"
                        : agendamento.statusSessao === "CONCLUIDA"
                        ? "status-concluida"
                        : ""
                    }`}
                  >
                    {agendamento.statusSessao}
                  </span>
                </div>
              </div>
            )}

            <div className="container-sessao-editar">
              <div className="container-inputs-editar flex gap-2">
                {agendamento.statusSessao === "CANCELADA" && (
                  <div className="w-full justify-center flex flex-col">
                    <UserSearch
                      onUserSelect={setNovoPacienteSelecionado}
                      useIcon={false}
                      labelTitle="Novo Paciente"
                    />
                  </div>
                )}

                <div className="select-container w-full">
                  <label htmlFor="diaSemana" className="input-label">
                    Novo Dia da Semana:
                  </label>
                  <select
                    id="diaSemana"
                    name="diaSemana"
                    required
                    disabled={agendamento.statusSessao === "CONCLUIDA"}
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
                  <label htmlFor="data" className="input-label">
                    Nova Data:
                  </label>
                  <select
                    id="data"
                    name="data"
                    required
                    disabled={agendamento.statusSessao === "CONCLUIDA"}
                    className="select-field w-full"
                    value={
                      paciente?.data ? formatDateToFrontend(paciente.data) : ""
                    }
                    onChange={(e) =>
                      setPaciente({
                        ...paciente,
                        data: formatDateToBackend(e.target.value),
                      })
                    }
                  >
                    <option value="" disabled>
                      Selecione uma data
                    </option>
                    {paciente &&
                      diasDoMes.diaMes &&
                      diasDoMes.diaMes.map((data, index) => (
                        <option key={index} value={data}>
                          {data}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div className="select-container w-full">
                  <label htmlFor="horario" className="input-label">
                    Novo Horário:
                  </label>
                  <select
                    id="horario"
                    name="horario"
                    required
                    disabled={agendamento.statusSessao === "CONCLUIDA"}
                    className="select-field w-full"
                    value={novoHorario}
                    onChange={(e) => setNovoHorario(e.target.value)}
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

                {agendamento.statusSessao !== "CANCELADA" &&
                  agendamento.statusSessao !== "CONFIRMADA" &&
                  agendamento.statusSessao !== "CONCLUIDA" && (
                    <div className="checkbox-container">
                      <input
                        name="confirmar_checkbox"
                        type="checkbox"
                        disabled={agendamento.statusSessao === "CONCLUIDA"}
                        checked={paciente.statusSessao === "CONFIRMADA"}
                        onChange={(e) =>
                          setPaciente({
                            ...paciente,
                            statusSessao: e.target.checked
                              ? "CONFIRMADA"
                              : "PENDENTE",
                          })
                        }
                      />
                      <label htmlFor="confirmar_checkbox">
                        Confirmar Agendamento
                      </label>
                    </div>
                  )}
                {agendamento.statusSessao === "CONFIRMADA" && (
                  <div className="checkbox-container">
                    <input
                      name="confirmar_checkbox"
                      type="checkbox"
                      disabled={agendamento.statusSessao === "CONCLUIDA"}
                      checked={paciente.statusSessao === "CONCLUIDA"}
                      onChange={(e) =>
                        setPaciente({
                          ...paciente,
                          statusSessao: e.target.checked
                            ? "CONCLUIDA"
                            : "CONFIRMADA",
                        })
                      }
                    />
                    <label htmlFor="confirmar_checkbox">
                      Concluir Agendamento
                    </label>
                  </div>
                )}
              </div>
            </div>
          </section>
          <div className="flex gap-2">
            {agendamento.statusSessao !== "CONCLUIDA" && (
              <button
                type="submit"
                className="btn_primario rounded-full flex gap-2"
              >
                <FaRegSave className="" size={20} />
                Salvar Alterações
              </button>
            )}
            {agendamento.statusSessao == "CONCLUIDA" && (
              <>
                <button
                  type="button"
                  className="btn_primario rounded-full flex gap-2"
                  onClick={() => setShowModalRelatorio(true)}
                  disabled={loadingRelatorio}
                >
                  <FaFileArrowUp className="" size={20} />
                  {loadingRelatorio
                    ? "Carregando..."
                    : relatorioExistente
                      ? "Visualizar Relatório"
                      : "Registrar Relatório"}
                </button>
                {showModalRelatorio && (
                  <ModalRelatorio
                    paciente={paciente}
                    idSessao={agendamento.id}
                    relatorioExistente={relatorioExistente}
                    onClose={() => setShowModalRelatorio(false)}
                    onSave={(relatorioCompleto) => {
                      // Ao salvar, atualiza o estado para refletir que já existe relatório
                      // Isso troca o label do botão para "Visualizar Relatório"
                      setRelatorioExistente(relatorioCompleto?.conteudo ?? true);
                      setShowModalRelatorio(false);
                    }}
                  />
                )}
              </>
            )}
            <button
              className="btn_secundario rounded-full"
              onClick={() => (window.location.href = "/dashboard/agendamentos")}
              type="button"
            >
              {agendamento.statusSessao === "CONCLUIDA" ? "Voltar" : "Cancelar"}
            </button>
          </div>
        </form>
      </MainComponent>
    </>
  );
};

export default EditarAgendamento;
