import React from "react";
import ImgHome from "../../../assets/images/office_girl.png";
import CardComponent from "./Card/CardComponent";
import CardIcon1 from "./Card/icons/Vector.svg";
import CardIcon2 from "./Card/icons/Vector-1.svg";
import CardIcon3 from "./Card/icons/Vector-2.svg";
import CardIcon4 from "./Card/icons/Vector-3.svg";
import "./solucao.css";

const SolucaoComponent = () => {
  const cards1 = [
    {
      id: 1,
      icon: CardIcon1,
      text: "Facilite o gerenciamento de agendas com a Dashboard customizada!",
    },
    {
      id: 2,
      icon: CardIcon2,
      text: "Aumente a produtividade de seus serviços utilizando a nossa solução.",
    },
  ];

  const cards2 = [
    {
      id: 3,
      icon: CardIcon3,
      text: "Tenha mais eficiência nos atendimentos aos seus clientes.",
    },
    {
      id: 4,
      icon: CardIcon4,
      text: "Organize seus agendamentos em calendários semanais",
    },
  ];

  return (
    <section className="section-solucao pt-16" id="solucao">
      <div className="header-solucao">
        <h1 className="titulo-section">SOLUÇÃO</h1>
        <h3 className="subtitulo-section">BENEFÍCIOS DA AGENDFY</h3>
      </div>
      <div className="content-solucao flex flex-col md:flex-row lg:flex-row justify-between items-center gap-4 md:gap-8 lg:gap-8 p-4 md:p-10 lg:p-10">
        <div className="cards-solucao flex flex-col justify-between items-center w-full md:w-2/3 lg:w-2/3">
          <div className="cards-solucao-content">
            {cards1.map((cardInfo) => (
              <CardComponent
                key={cardInfo.id}
                icons={cardInfo.icon}
                text={cardInfo.text}
              />
            ))}
          </div>
          <div className="cards-solucao-content">
            {cards2.map((cardInfo) => (
              <CardComponent
                key={cardInfo.id}
                icons={cardInfo.icon}
                text={cardInfo.text}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolucaoComponent;
