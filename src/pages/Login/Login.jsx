import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/LogoTipo Branco 1.svg";
import { errorMessage, responseMessage } from "../../utils/alert.js";
import "./login.css";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/psicologos/login",
        {
          email: email,
          senha: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { id, nome, role } = response.data;

      const toCapitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const nomeFormatado = toCapitalize(nome);

      localStorage.setItem("nomeUsuario", nomeFormatado);
      localStorage.setItem("idUsuario", id);
      localStorage.setItem("roleUsuario", role.role);

      responseMessage(`Bem vindo, ${nomeFormatado}!`);

      setTimeout(() => {
        if (role.id === 1) {
          window.location.href = "/dashboard/psicologos";
        } else if (role.id === 3) {
          window.location.href = "/dashboard";
        }
      }, 2300);
    } catch (error) {
      errorMessage("Usuário ou senha inválidos");
      console.error("Erro ao autenticar usuário:", error);
    }
  };

  return (
    <div className="background">
      <div className="card">
        <div className="login-container">
          <Link to="/" className="flex items-center mb-4 gap-2">
            <FaArrowAltCircleLeft />
            Voltar
          </Link>
          <h1 className="text-2xl font-semibold">Que bom te ver de novo!</h1>
          <h2 className="text-1xl font-small">Entre para continuar</h2>
          <form
            id="loginForm"
            onSubmit={handleSubmit}
            noValidate
            className="w-4/5 space-y-8"
          >
            <div>
              <label htmlFor="email" className="block text-base font-small">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email_input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-b-2 border-lightGrayFy"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="senha_input"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-b-2 border-lightGrayFy"
              />
            </div>
            <p className="">
              É necessário no mínimo 8 letras, 1 letra maiúscula e 1 número.
            </p>
            <Link
              to="/login/esqueceu-senha"
              className="text-darkBlueFy font-semibold text-right block"
            >
              Esqueceu a senha?
            </Link>
            <button
              type="submit"
              className="bg-lightBlueFy text-white text-lg font-semibold py-2 px-8 border-2 border-darkestBlueFy hover:bg-darkBlueFy transition ease-in-out duration-200"
            >
              Entrar
            </button>
          </form>
        </div>
        <div className="cadastro-container bg-darkestBlueFy">
          <img src={logo} alt="Logo" className="logo-class" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
