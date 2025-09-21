import React from "react";
import logo from "../../../assets/images/logoBlue.svg";
import "./header.css";

const HeaderComponent = () => {
  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="app-header flex flex-row justify-between items-center p-4 md:p-10 bg-white border-b border-gray-300">
      <img
        src={logo}
        id="agendfy_logo"
        alt=""
        className="w-20 cursor-pointer"
        onClick={handleLogoClick}
      />
      <ul className="flex flex-row list-none gap-8">
        <li>
          <a
            href="#home"
            className="navbar-item text-sm md:text-base lg:text-md"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#solucao"
            className="navbar-item text-sm md:text-base lg:text-md"
          >
            Solução
          </a>
        </li>
        <li>
          <a
            href="#essencia"
            className="navbar-item text-sm md:text-base lg:text-md"
          >
            Nossa Essência
          </a>
        </li>
        <li>
          <a
            href="#recursos"
            className="navbar-item text-sm md:text-base lg:text-md"
          >
            Recursos AgendFy
          </a>
        </li>
        <li>
          <a
            href="#contate"
            className="navbar-item text-sm md:text-base lg:text-md"
          >
            Contate-nos
          </a>
        </li>
      </ul>
      <div className="flex gap-4">
        <button className="btn_primario" onClick={handleLoginRedirect}>
          Entrar
        </button>
      </div>
    </header>
  );
};

export default HeaderComponent;
