import React from "react";
import "./MenuPsicologo.css";
import Logo from "../../../../../assets/images/icons/Logo.svg";
import { Link, useLocation } from "react-router-dom";

const MenuPsicologo = () => {
  const location = useLocation();

  return (
    <div className="menu-lateral flex flex-col">
      <section className="logo">
        <img src={Logo} alt="Logo" className="w-8" />
      </section>
      <section className="btns-menu">
        <Link to={"/dashboard/psicologos"}>
          <button
            id="btn-psicologos"
            aria-label="Psicologos"
            className={
              location.pathname === "/dashboard/psicologos" ? "active" : ""
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </button>
        </Link>
      </section>

      <button
        className="btn-sair"
        id="btn-sair"
        aria-label="Sair"
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </button>
    </div>
  );
};

export default MenuPsicologo;
