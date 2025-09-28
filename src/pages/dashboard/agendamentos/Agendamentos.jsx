import { useEffect, useState } from 'react';
import './Agendamentos.css';
import MenuLateralComponent from '../components/MenuLateral/MenuLateralComponent';
import MainComponent from '../components/MainComponent/MainComponent';
import { FaPlus } from 'react-icons/fa';
import CalendarCard from './components/CalendarCard/CalendarCard';
import { paginacaoGetAgendamentos } from '../../../provider/api/agendamentos/fetchs-agendamentos';
import Loading from '../components/Loading/Loading';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offsetSemana, setOffsetSemana] = useState(0);

  const redirectToCadastrarAgendamento = () => {
    window.location.href = './agendamentos/cadastrar';
  };

const getWeekRange = (offset = 0) => {
  const today = new Date();
  const currentDay = today.getDay();

  if (currentDay === 6) today.setDate(today.getDate() + 2);
  else if (currentDay === 0) today.setDate(today.getDate() + 1);
  else today.setDate(today.getDate() - (currentDay - 1));

  today.setDate(today.getDate() + offset * 7);

  const start = new Date(today);
  const end = new Date(today);
  end.setDate(start.getDate() + 4);

  const format = (d) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return `${format(start)} - ${format(end)}`;
};

const getCurrentWeekDays = (offset = 0) => {
  const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const today = new Date();
  const currentDay = today.getDay();

  // Vai para segunda-feira da semana atual
  if (currentDay === 6) today.setDate(today.getDate() + 2);
  else if (currentDay === 0) today.setDate(today.getDate() + 1);
  else today.setDate(today.getDate() - (currentDay - 1));

  // Aplica o offset de semanas
  today.setDate(today.getDate() + offset * 7);

  // Gera os próximos 5 dias úteis (segunda a sexta)
  const weekDays = [];
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

  
  const getSegundaDaSemanaISO = (offset = 0) => {
    const d = new Date();
    const dow = d.getDay();
    if (dow === 6) d.setDate(d.getDate() + 2);
    else if (dow === 0) d.setDate(d.getDate() + 1);
    else d.setDate(d.getDate() - (dow - 1));
    d.setDate(d.getDate() + offset * 7);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchAgendamentosSemana = async () => {
      try {
        setLoading(true);
        const segunda = getSegundaDaSemanaISO(offsetSemana);
        const data = await paginacaoGetAgendamentos({ segunda, size: 40 });
        const lista = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
        const agendamentosTransformados = lista.map((agendamento) => ({
          ...agendamento,
          timeSlot: agendamento.hora ? agendamento.hora.substring(0, 5) : '00:00',
          patientName: agendamento.fkPaciente?.nome || 'Desconhecido',
          status: agendamento.statusSessao || 'Indefinido',
        }));
        setAgendamentos(agendamentosTransformados);
      } catch (error) {
        console.error('Erro ao buscar agendamentos da semana:', error);
        setAgendamentos([]);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchAgendamentosSemana();
  }, [offsetSemana]);
    
  const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatDateToBackend = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; 
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
              {`< ${getWeekRange(offsetSemana - 1)}`}
            </button>
            <button
              className="btn_agendamento"
              onClick={() => setOffsetSemana((prev) => prev + 1)}
            >
              {`${getWeekRange(offsetSemana + 1)} >`}
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
                        <span>{day.date}</span> 
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
                          return `${day}/${month}/${year}`;
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
                                timeSlot={agendamento.timeSlot.split(' - ')[0]}
                                status={capitalizeFirstLetter(agendamento.status)}
                                patientName={agendamento.patientName}
                                buttonText="Ver Detalhes"
                                day={day.date}
                                id={agendamento.id}
                              />
                            ) : (
                              <CalendarCard
                                timeSlot={timeSlot.split(' - ')[0]}
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