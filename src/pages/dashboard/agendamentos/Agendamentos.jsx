import React, { use, useEffect, useState } from 'react';
import './Agendamentos.css';
import MenuLateralComponent from '../components/MenuLateral/MenuLateralComponent';
import MainComponent from '../components/MainComponent/MainComponent';
import { FaPlus } from 'react-icons/fa';
import CalendarCard from './components/CalendarCard/CalendarCard';
import { getAgendamentos, getAgendamentosPorPaciente } from '../../../provider/api/agendamentos/fetchs-agendamentos';
import Loading from '../components/Loading/Loading';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offsetSemana, setOffsetSemana] = useState(0);

  const redirectToCadastrarAgendamento = () => {
    window.location.href = './agendamentos/cadastrar';
  };

  const getCurrentWeekDays = (offset = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const weekDays = [];

    // Avança para a próxima segunda-feira se for sábado ou domingo
    if (currentDay === 6) {
      today.setDate(today.getDate() + 2);
    } else if (currentDay === 0) {
      today.setDate(today.getDate() + 1);
    } else {
      // Se for segunda a sexta, volta para a segunda-feira da semana atual
      today.setDate(today.getDate() - (currentDay - 1));
    }

    // Aplica o offset de semanas
    today.setDate(today.getDate() + offset * 7);

    // Gera os próximos 5 dias úteis (segunda a sexta)
    for (let i = 0; i < 5; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dayOfMonth = day.getDate().toString().padStart(2, '0');
      const month = (day.getMonth() + 1).toString().padStart(2, '0');
      const year = day.getFullYear();

      weekDays.push({
        dayName: daysOfWeek[day.getDay()],
        date: `${dayOfMonth}/${month}/${year}`,
      });
    }

    return weekDays;
  };

  const weekDays = getCurrentWeekDays(offsetSemana);

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  useEffect(() => {
    const fetchAgendamentos = async () => {
        try {
            setLoading(true);
            const response = await getAgendamentos();

            if (Array.isArray(response)) {
                const agendamentosTransformados = response.map((agendamento) => ({
                    ...agendamento,
                    timeSlot: agendamento.hora
                        ? agendamento.hora.substring(0, 5) 
                        : '00:00',
                    patientName: agendamento.fkPaciente?.nome || 'Desconhecido', 
                    status: agendamento.statusSessao || 'Indefinido', 
                }));

                setAgendamentos(agendamentosTransformados);
                console.log("Agendamentos transformados:", agendamentosTransformados);
            } else {
                console.error("A resposta da API não é um array:", response);
            }
        } catch (error) {
            console.error("Erro ao encontrar agendamentos:", error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    fetchAgendamentos();
}, []);
    
  const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatDateToDisplay = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`; // Converte para o formato DD/MM/YYYY
  };

  const formatDateToBackend = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Converte para o formato YYYY-MM-DD
};

  return (
    <div className='div-agendamentos flex'>
      <MenuLateralComponent />
      <MainComponent
        title="Agendamentos"
        headerContent={
          <div className="flex gap-2">
            <button
              className="btn_agendamento"
              onClick={() => setOffsetSemana((prev) => prev - 1)}
            >
              {"< Semana Anterior"}
            </button>
            <button
              className="btn_agendamento"
              onClick={() => setOffsetSemana((prev) => prev + 1)}
            >
              {"Próxima Semana >"}
            </button>
            <button className='btn_agendamento flex rounded-full' onClick={redirectToCadastrarAgendamento}>
              <FaPlus className='icon' />
              Agendar
            </button>
          </div>
        }
      >
        <section className='calendario-container'>
          {loading ? (
            <Loading />
          ) : (
            <>
              <table className='calendario-table flex flex-col w-full'>
                <thead className='flex w-full justify-between'>
                  <tr className='table-tr flex w-full justify-evenly gap-2' >
                    {weekDays.map((day, index) => (
                      <th key={index} className='calendario-card-header'>
                        <span>{day.dayName}</span>
                        <span>{day.date}</span> {/* Exibe a data no formato DD/MM */}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='table-body flex w-full flex-col justify-between gap-2'>
                  {timeSlots.map((timeSlot, rowIndex) => (
                    <tr key={rowIndex} className='flex w-full justify-evenly gap-2'>
                      {weekDays.map((day, colIndex) => {
                        const formatDateToDisplay = (date) => {
                          const [year, month, day] = date.split('-');
                          return `${day}/${month}/${year}`; // Converte para o formato DD/MM/YYYY
                        };

                        const agendamento = agendamentos.find(
                            (a) =>
                                a.data === formatDateToBackend(day.date) &&
                                a.timeSlot === timeSlot.split(" - ")[0]
                        );
                        return (
                          <td key={colIndex} className='div-calendario-card'>
                            {agendamento ? (
                              <CalendarCard
                                timeSlot={agendamento.timeSlot}
                                status={capitalizeFirstLetter(agendamento.status)} // Formata o texto do status
                                patientName={agendamento.patientName}
                                buttonText="Ver Detalhes"
                                day={day.date}
                                id={agendamento.id}
                              />
                            ) : (
                              <CalendarCard
                                timeSlot={timeSlot}
                                status="Disponível"
                                patientName=""
                                buttonText="+ Agendar"
                                day={day.date}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>
      </MainComponent>
    </div>
  );
};

export default Agendamentos;