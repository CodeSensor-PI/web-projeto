import React, { useEffect, useState } from 'react'
import MainComponent from '../../components/MainComponent/MainComponent'
import MenuLateralComponent from '../../components/MenuLateral/MenuLateralComponent'
import './EditarAgendamento.css'
import InputField from '../../components/InputField/InputField'
import { FaDeleteLeft, FaTrashCan } from 'react-icons/fa6'
import { FaRegSave, FaSave } from 'react-icons/fa'
import { errorMessage, responseMessage } from '../../../../utils/alert.js'
import { useParams } from 'react-router-dom'
import { getAgendamentosPorId } from '../../../../provider/api/agendamentos/fetchs-agendamentos.js'
import { putAgendamento } from '../../../../provider/api/agendamentos/fetchs-agendamentos.js';

const EditarAgendamento = () => {

  const [paciente, setPaciente] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [diasDoMes, setDiasDoMes] = useState({});
  const [agendamento, setAgendamento] = useState({});
  const [diaSemana, setDiaSemana] = useState(0);
  const [novoHorario, setNovoHorario] = useState(''); // novo estado para o select

  const { id } = useParams();


  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const response = await getAgendamentosPorId(id); // Busca o agendamento pelo ID
        console.log("Agendamento carregado:", response);

        if (response && response.id) {
          setAgendamento(response);
          let horaPadronizada = response.hora;
          // Garante formato HH:00
          if (horaPadronizada && horaPadronizada.length === 8 && horaPadronizada.split(':').length === 3) {
            // Exemplo: "11:00:00" => "11:00"
            const [h, m] = horaPadronizada.split(':');
            horaPadronizada = h.padStart(2, '0') + ':' + m.padStart(2, '0');
          } else if (horaPadronizada && !horaPadronizada.includes(':')) {
            horaPadronizada = horaPadronizada.padStart(2, '0') + ':00';
          } else if (horaPadronizada && horaPadronizada.match(/^\d{1,2}:\d{1,2}$/)) {
            const [h, m] = horaPadronizada.split(':');
            horaPadronizada = h.padStart(2, '0') + ':' + m.padStart(2, '0');
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
          setNovoHorario(horaPadronizada); // <-- garante que o select também recebe o valor correto
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
      const diaSemanaCalculado = new Date(Date.UTC(
        parseInt(paciente.data.split('-')[0], 10),
        parseInt(paciente.data.split('-')[1], 10) - 1,
        parseInt(paciente.data.split('-')[2], 10)
      )).getUTCDay();
      setDiaSemana(diaSemanaCalculado);

      const diasDoMesAtualizados = Array.from({ length: 4 }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() + i * 7 + ((diaSemanaCalculado - data.getDay() + 7) % 7));
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      });

      setDiasDoMes({ diaMes: diasDoMesAtualizados });
    }
  }, [paciente]);

  const getNomeDiaSemana = (diaSemana) => {
    const dias = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
    ];

    return dias[diaSemana] || "Desconhecido";
  };

  const formatDateToBackend = (date) => {
    if (!date || typeof date !== 'string') {
      console.error("Data inválida para formatDateToBackend:", date);
      return "0000-00-00";
    }

    const [day, month, year] = date.split('/');
    if (!day || !month || !year) {
      console.error("Formato de data inválido para formatDateToBackend:", date);
      return "0000-00-00";
    }

    return `${year}-${month}-${day}`;
  };

  function formatDateToFrontend(date) {
    if (!date || typeof date !== 'string') return '';
    if (date.includes('/')) return date;
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  const handleAtualizarAgendamento = async (e) => {
    e.preventDefault();

    if (!paciente.data || !novoHorario || paciente.diaSemana === undefined) {
      errorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const requestBody = {
        id: agendamento.id,
        fkPaciente: {
          id: paciente.id,
          nome: paciente.nome,
          cpf: paciente.cpf,
          email: paciente.email,
          status: paciente.status,
          fkPlano: {
            id: paciente.fkPlano?.id,
            categoria: paciente.fkPlano?.categoria,
            preco: paciente.fkPlano?.preco,
          },
        },
        data: typeof paciente.data === 'string' && paciente.data.includes('/')
          ? formatDateToBackend(paciente.data)
          : paciente.data,
        hora: novoHorario, // <-- usa o novoHorario aqui!
        tipo: agendamento.tipo,
        statusSessao: paciente.statusSessao, // <-- valor do checkbox!
        anotacao: agendamento.anotacao,
        createdAt: agendamento.createdAt,
      };

      console.log("Request Body para Atualizar:", requestBody);

      await putAgendamento(agendamento.id, requestBody);
      responseMessage("Agendamento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      errorMessage("Erro ao atualizar agendamento.");
    }finally {
        responseMessage("Agendamento atualizado com sucesso!", "small");
        setTimeout(() => {
          window.location = '/dashboard/agendamentos';
        }, 1200);
      }
  };

  const handleDiaSemanaChange = (e) => {
    const selectedDiaSemana = parseInt(e.target.value, 10);
    setDiaSemana(selectedDiaSemana);

    const diasDoMesAtualizados = Array.from({ length: 4 }, (_, i) => {
      const data = new Date();
      data.setDate(data.getDate() + i * 7 + ((selectedDiaSemana - data.getDay() + 7) % 7));
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    });

    setDiasDoMes({ diaMes: diasDoMesAtualizados });
    setPaciente({
      ...paciente,
      diaSemana: selectedDiaSemana,
      data: formatDateToBackend(diasDoMesAtualizados[0]), // Salva no formato yyyy-MM-dd
    });
  }

  useEffect(() => {
    console.log("Paciente Data:", paciente.data);
    console.log("Dia da Semana Calculado:", diaSemana);
  }, [paciente, diaSemana]);

  // Sempre que paciente.horario mudar, atualiza o novoHorario
  useEffect(() => {
    if (paciente && paciente.horario) {
      setNovoHorario(paciente.horario);
    }
  }, [paciente.horario]);

  console.log("Horário selecionado:", paciente.horario);

  return (
    <>
      <MenuLateralComponent />
      <MainComponent
        title={'Editar Agendamento'}
        headerContent={
          <div className='flex gap-2 justify-between w-full'>
            <button className="btn_agendamento" onClick={() => window.location.href = '/dashboard/agendamentos'}>
              {"< Voltar"}
            </button>
            <button
              className='btn_agendamento rounded-full flex gap-2 m-0'
              type="button"
              onClick={() => setPaciente({
                ...paciente,
                data: paciente.selectedDate
              })}
            >
              <FaTrashCan className='' size={20} />
              Cancelar Agendamento
            </button>
          </div>
        }
      >

        <form className='form-editar-agendamento'

          noValidates
          onSubmit={handleAtualizarAgendamento}>
          <section className='container-editar-agendamento'>

            {paciente && (
              <div className="paciente-info-editar">
                <p><strong>Paciente Selecionado:</strong> {paciente.nome}</p>
                <p><strong>Horário Marcado:</strong> {paciente.horario}</p>
                <p><strong>Data Marcada:</strong> {agendamento.data}</p>
                <div className="pendente-container">
                  <span className={`status ${
                    agendamento.statusSessao === 'PENDENTE' ? 'status-sessao-pendente' :
                    agendamento.statusSessao === 'CONFIRMADA' ? 'status-sessao-ok' :
                    agendamento.statusSessao === 'CANCELADA' ? 'status-cancelado' :
                    ''
                  }`}>
                    {agendamento.statusSessao}
                  </span>
                </div>

              </div>
            )}


            <div className='container-sessao-editar'>
              <div className='container-inputs-editar flex gap-2'>
                <div className="select-container w-full">
                  <label htmlFor="diaSemana" className="input-label">Novo Dia da Semana:</label>
                  <select
                    id="diaSemana"
                    name="diaSemana"
                    required
                    className="select-field w-full"
                    value={diaSemana}
                    onChange={handleDiaSemanaChange}
                  >
                    <option value="" disabled>Selecione um dia da semana</option>
                    <option value={1}>Segunda-feira</option>
                    <option value={2}>Terça-feira</option>
                    <option value={3}>Quarta-feira</option>
                    <option value={4}>Quinta-feira</option>
                    <option value={5}>Sexta-feira</option>
                  </select>
                </div>
                <div className="select-container w-full">
                  <label htmlFor="data" className="input-label">Nova Data:</label>
                  <select
                    id="data"
                    name="data"
                    required
                    className="select-field w-full"
                    value={paciente?.data ? formatDateToFrontend(paciente.data) : ''}
                    onChange={e => setPaciente({
                      ...paciente,
                      data: formatDateToBackend(e.target.value)
                    })}
                  >
                    <option value="" disabled>Selecione uma data</option>
                    {paciente && diasDoMes.diaMes && diasDoMes.diaMes.map((data, index) => (
                      <option key={index} value={data}>
                        {data}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-container w-full">
                  <label htmlFor="horario" className="input-label">Novo Horário:</label>
                  <select
                    id="horario"
                    name="horario"
                    required
                    className="select-field w-full"
                    value={novoHorario}
                    onChange={e => setNovoHorario(e.target.value)}
                  >
                    <option value="" disabled>Selecione um horário</option>
                    {Array.from({ length: 9 }, (_, i) => {
                      const hour = (8 + i).toString().padStart(2, '0');
                      if (hour === "12") return null;
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="checkbox-container">
                  <input
                    name="confirmar_checkbox"
                    type="checkbox"
                    checked={paciente.statusSessao === 'CONFIRMADA'}
                    onChange={e => setPaciente({
                      ...paciente,
                      statusSessao: e.target.checked ? 'CONFIRMADA' : 'PENDENTE'
                    })}
                  />
                  <label htmlFor="confirmar_checkbox">
                    Confirmar Agendamento
                  </label>

                </div>
              </div>
            </div>
          </section>
          <div className='flex gap-2'>
            <button type='submit' className='btn_primario rounded-full flex gap-2'>
              <FaRegSave className='' size={20} />
              Salvar Alterações</button>
            <button className='btn_secundario rounded-full'
              onClick={() => window.location.href = '/dashboard/agendamentos'}
              type="button">
              Cancelar
            </button>
          </div>

        </form>

      </MainComponent>
    </>
  )
}

export default EditarAgendamento