import React, { useState, useEffect } from "react";
import "./style/Administracao.css";

import InputField from "../components/InputField/InputField";
import SaveButton from "../components/SaveButton/SaveButton";
import EditButton from "../components/EditButton/EditButton";
import {
  popupMessage,
  responseMessage,
  errorMessage,
  confirmCancelEdit,
} from "../../../utils/alert";
import { alterarSenha } from "../../../provider/api/alterar-senha-psi";
import api from "../../../provider/api/api"; // Alteração aqui
import MainComponent from "../components/MainComponent/MainComponent";
import MenuLateralComponent from "../components/MenuLateral/MenuLateralComponent";

const Administracao = () => {
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [crp, setCrp] = useState("");

  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const formatTelefone = (numero) => {
    if (!numero) return "";
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const formatCrp = (numero) => {
    if (!numero) return "";
    return numero.replace(/^(\d{2})(\d{5,6})$/, "$1/$2");
  };

  const removeMask = (valor) => valor.replace(/\D/g, "");

  useEffect(() => {
    const idUsuario = localStorage.getItem("idUsuario");

    if (idUsuario) {
      api
        .get(`/psicologos/${idUsuario}`)
        .then((response) => {
          const { nome, email, telefone, crp } = response.data;
          setNome(nome || "");
          setEmail(email || "");
          setTelefone(formatTelefone(telefone || "")); // Formata o telefone para exibição
          setCrp(formatCrp(crp || "")); // Formata o CRP para exibição
        })
        .catch((error) => {
          console.error("Erro ao buscar informações do usuário:", error);
          errorMessage("Erro ao carregar informações do usuário.");
        });
    }
  }, []);

  const handleEditGeneral = async () => {
    if (isEditingGeneral) {
      const result = await confirmCancelEdit(
        "Cancelar edição?",
        "Tem certeza que deseja cancelar a edição?",
        "medium"
      );
      if (!result.isConfirmed) return;
    }
    setIsEditingGeneral(!isEditingGeneral);
  };

  const handleEditPassword = async () => {
    if (isEditingPassword) {
      const result = await confirmCancelEdit(
        "Cancelar edição da senha?",
        "Tem certeza que deseja cancelar a edição da senha?",
        "small"
      );
      if (!result.isConfirmed) return;
    }
    setIsEditingPassword(!isEditingPassword);
  };

  const handleSaveGeneral = async () => {
    if (!email || !nome || !telefone) {
      errorMessage("Todos os campos devem estar preenchidos!");
      return;
    }
    const idDoUsuario = localStorage.getItem("idUsuario");
    try {
      await api.put(`/psicologos/${idDoUsuario}`, {
        email,
        nome,
        telefone: removeMask(telefone),
        crp: crp.replace("/", ""), // Remove a máscara do CRP antes de enviar
      });
      responseMessage("Dados atualizados com sucesso!");
      setIsEditingGeneral(false);
      localStorage.setItem("nomeUsuario", nome);
    } catch (error) {
      errorMessage("Erro ao salvar dados.");
      console.error(error);
    }
  };

  const handleSavePassword = async () => {
    if (!senha || !novaSenha || !confirmarSenha) {
      errorMessage("Todos os campos devem estar preenchidos!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      errorMessage("A nova senha e a confirmação não coincidem!");
      return;
    }

    try {
      const idDoUsuario = localStorage.getItem("idUsuario");
      await alterarSenha(idDoUsuario, senha, novaSenha);
      responseMessage("Senha alterada com sucesso!");
      setIsEditingPassword(false);
    } catch (error) {
      errorMessage("Erro ao alterar a senha.");
      console.error(error);
    }
  };

  return (
    <div className="div-administracao flex">
      <MenuLateralComponent />
      <MainComponent
        title="Configurações de Conta"
        headerContent={
          <div className="flex w-full gap-2 items-center justify-end">
            <button className="btn_agendamento" onClick={() => popupMessage()}>
              Editar Planos
            </button>
          </div>
        }
      >
        <div className="form-cadastrar-agendamento">
          <div className="card-forms">
            <div className="forms-container">
              {/* Card: Dados Gerais */}
              <form
                className="editar-conta"
                onSubmit={(e) => e.preventDefault()}
              >
                <h2 className="flex items-center justify-between">
                  Dados Gerais:
                  <EditButton
                    onClick={handleEditGeneral}
                    text={isEditingGeneral ? "Cancelar" : "Editar"}
                  />
                </h2>
                <div className="card-inputs">
                  <InputField
                    labelTitle="Nome"
                    value={nome}
                    width={"w-full"}
                    containerWidth={"w-[90%]"}
                    disabled={!isEditingGeneral}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  <InputField
                    labelTitle="E-mail"
                    value={email}
                    width={"w-full"}
                    containerWidth={"w-[90%]"}
                    type="email"
                    disabled={!isEditingGeneral}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputField
                    labelTitle="Telefone"
                    value={telefone}
                    width={"w-full"}
                    containerWidth={"w-[90%]"}
                    disabled={!isEditingGeneral}
                    onChange={(e) =>
                      setTelefone(formatTelefone(removeMask(e.target.value)))
                    }
                  />
                  <InputField
                    labelTitle="CRP"
                    value={crp}
                    disabled={true}
                    width={"w-full"}
                    containerWidth={"w-[90%]"}
                    maskType={"crp"}
                  />
                </div>
                <div className="inputs-button">
                  <SaveButton
                    icon="📄"
                    textContent="Salvar Alterações"
                    disabled={!isEditingGeneral}
                    onClick={handleSaveGeneral}
                  />
                </div>
              </form>

              {/* Card: Alterar Senha */}
              <form
                className="editar-conta "
                onSubmit={(e) => e.preventDefault()}
              >
                <h2 className="flex items-center justify-between">
                  Alterar Senha:
                  <EditButton
                    onClick={handleEditPassword}
                    text={isEditingPassword ? "Cancelar" : "Editar"}
                  />
                </h2>
                <div className="card-inputs">
                  <InputField
                    labelTitle="Senha Atual"
                    value={senha}
                    disabled={!isEditingPassword}
                    width={"w-full"}
                    containerWidth={"w-[90%]"}
                    onChange={(e) => setSenha(e.target.value)}
                    type="password"
                  />

                  <InputField
                    labelTitle="Nova senha"
                    value={novaSenha}
                    width={"w-full"}
                    containerWidth={"w-[90%]"}
                    disabled={!isEditingPassword}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    type="password"
                  />
                  <InputField
                    labelTitle="Confirmar senha"
                    value={confirmarSenha}
                    width={"w-full"}
                    containerWidth={"w-[90%]"}
                    disabled={!isEditingPassword}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    type="password"
                  />
                </div>
                <div className="inputs-button">
                  <SaveButton
                    icon="🔒"
                    textContent="Alterar Senha"
                    disabled={!isEditingPassword}
                    onClick={handleSavePassword}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </MainComponent>
    </div>
  );
};

export default Administracao;
