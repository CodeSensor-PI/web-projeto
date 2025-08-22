import React from "react";
import ImgCalendario from "./images/Calendario.svg";
import ImgDashboard from "./images/Dashboard.svg";
import ImgIAAssistente from "./images/IA-Assistente.svg";
import ImgIntegracao from "./images/Integracao-WPP.svg";
import "./recursos.css";

import { Swiper, SwiperSlide } from "swiper/react";

const RecursosComponent = () => {
  const dadosRecursos = [
    {
      id: 1,
      titulo: "Calendário de consultas",
      descricao:
        "Gerencie seus agendamentos de forma prática com um calendário interativo. Visualize todos seus compromissos em um só lugar e edite as informações sempre que necessário, garantindo mais organização e controle sobre sua agenda.",
      img: ImgCalendario,
    },
    {
      id: 2,
      titulo: "Dashboard pessoal",
      descricao:
        "Tenha acesso a uma dashboard intuitiva e completa, com insights valiosos sobre seus clientes, frequência de agendamentos, reagendamentos e muito mais. Transforme dados em decisões estratégicas e otimize seu negócio com inteligência.",
      img: ImgDashboard,
    },
    {
      id: 3,
      titulo: "IA Assistente",
      descricao:
        "Nosso sistema contará com IA integrada ao calendário, oferecendo sugestões inteligentes, alertas automáticos e otimização dos agendamentos para mais eficiência e praticidade.",
      img: ImgIAAssistente,
    },
    {
      id: 4,
      titulo: "Integração com WhatsApp",
      descricao:
        "Tenha acesso a uma dashboard intuitiva e completa, com insights valiosos sobre seus clientes, frequência de agendamentos, reagendamentos e muito mais. Transforme dados em decisões estratégicas e otimize seu negócio com inteligência.",
      img: ImgIntegracao,
    },
  ];

  return (
    <div
      className="div-recursos flex flex-col justify-center items-center p-12 md:p-40"
      id="recursos"
    >
      <div className="header-recursos">
        <h1 className="titulo-section">RECURSOS AGENDFY</h1>
        <h3 className="subtitulo-section">AGENDAMENTOS INTELIGENTES</h3>
      </div>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        loop={true}
        className="swiper-recursos"
      >
        {dadosRecursos.map((recurso) => (
          <SwiperSlide key={recurso.id} className="card-content-solucao">
            <div className="card-solucao">
              <img src={recurso.img} alt={recurso.titulo} className="slide-img" />
              <div>
                <h1>{recurso.titulo}</h1>
                <p>{recurso.descricao}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecursosComponent;
