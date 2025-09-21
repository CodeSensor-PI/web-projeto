import "./CalendarCard.css";
import { useNavigate } from "react-router-dom";

const CalendarCard = ({
  timeSlot,
  status,
  patientName,
  buttonText,
  day,
  id,
}) => {
  const navigate = useNavigate();

  const borderColor =
    {
      Pendente: "orange",
      Confirmada: "green",
      Concluida: "blue",
      Cancelada: "red",
      Disponível: "gray",
    }[status] || "gray";

  const backgroundColor =
    {
      Pendente: "rgba(255, 165, 0, 0.1)",
      Confirmada: "rgba(0, 128, 0, 0.1)",
      Cancelada: "rgba(255, 0, 0, 0.1)",
      Disponível: "rgba(128, 128, 128, 0.1)",
      Concluida: "rgba(0, 0, 255, 0.1)",
    }[status] || "rgba(128, 128, 128, 0.1)";

  let isDisabled = false;
  if (status === "Disponível") {
    try {
      const [startTime] = timeSlot.split(" - ");
      let dateParts;
      if (day.includes("/")) {
        dateParts = day.split("/");
        var cardDate = new Date(
          Number(dateParts[2]),
          Number(dateParts[1]) - 1,
          Number(dateParts[0]),
          Number(startTime.split(":")[0]),
          Number(startTime.split(":")[1])
        );
      } else {
        dateParts = day.split("-");
        var cardDate = new Date(
          Number(dateParts[0]),
          Number(dateParts[1]) - 1,
          Number(dateParts[2]),
          Number(startTime.split(":")[0]),
          Number(startTime.split(":")[1])
        );
      }
      const now = new Date();
      if (cardDate < now) isDisabled = true;
    } catch (e) {
      isDisabled = false;
    }
  }

  const handleButtonClick = (e) => {
    if (isDisabled) return;
    const startTime = timeSlot.split(" - ")[0];

    if (status === "Disponível") {
      e.stopPropagation();
      navigate(
        `/dashboard/agendamentos/cadastrar?timeSlot=${encodeURIComponent(
          startTime
        )}&day=${encodeURIComponent(day)}`
      );
    } else {
      e.stopPropagation();
      navigate(`/dashboard/agendamentos/editar/${id}`);
    }
  };

  return (
    <div
      className="calendario-card flex flex-col justify-between"
      style={{ borderLeft: `4px solid ${borderColor}`, backgroundColor }}
    >
      <div className="card-header-calendario">
        <span>
          {timeSlot}
          {patientName && ` - ${patientName}`}
        </span>
        <div className="agendamento-info">
          <p>Status: {isDisabled ? "Indisponível" : status}</p>
        </div>
      </div>


      <div className="flex justify-center gap-2 w-full">
        <button
          className={`btn_calendario flex rounded-full${isDisabled ? " btn_calendario--disabled" : ""
            }`}
          onClick={handleButtonClick}
          disabled={isDisabled}
        >
          {isDisabled ? "Indisponível" : buttonText}
        </button>
      </div>
    </div>
  );
};

export default CalendarCard;
