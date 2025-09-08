import React from "react";
import "./home.css";



const HomeComponent = () => {

  const redirecionarLogin = () => {
    window.location.href = "/login";
  };

  return (
    <section
      className="section-home flex flex-col md:flex-row justify-between items-center p-12 md:p-40 bg-gradient-to-r from-white to-darkBlueFy mt-16"
      id="home"
    >
      <div className="text-home text-center md:text-left">
        <h1 className="text-4xl font-bold">
          Gerencie a agenda de sua clínica conosco!
        </h1>
        <p className="mt-4 text-lg">
          Aumente a eficiência de sua clínica com a nossa tecnologia em
          gerenciamento de agendamentos.
        </p>
        <div className="div-buttons flex gap-4 mt-4">
          <button className="btn_primario text-5xl w-[10em]"
          onClick={() => redirecionarLogin()}
          >
            Entrar
          </button>
          <button className="btn_secundario"
          onClick={() => window.location.href = "#contato"}
          >
            Saiba Mais
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;
