import { useState } from "react";
import Titulo from "../../../components/Titulo/Titulo";
import { errorMessage, responseMessage } from "../../../utils/alert";
import { solicitarRecuperacaoSenha } from "../../../provider/api/password-reset";
import SendButton from "../../dashboard/components/SendButton/SendButton";
import "./EsqueceuSenha.css";

const EsqueceuSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      errorMessage("Por favor, insira um email válido.");
      return;
    }

    setLoading(true);

    try {
      // Como é o sistema web para psicólogos, sempre usar 'psicologo'
      await solicitarRecuperacaoSenha(email, 'psicologo');
      responseMessage("Código enviado para o seu email!");
      
      setTimeout(() => {
        window.location.href = `/login/esqueceu-senha/confirmar-codigo?email=${encodeURIComponent(email)}`;
      }, 2300);
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      errorMessage("Erro ao enviar código. Verifique o email e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="esqueceu-senha-page">
      <div className="esqueceu-senha-container">
        <p
          className="esqueceu-senha-voltar"
          onClick={() => (window.location.href = "/login")}
        >
          Voltar para Login
        </p>

        <div className="esqueceu-senha-title">
          <Titulo titulo="Esqueceu a senha?" />
          <p>Digite seu email para receber o código de recuperação</p>
        </div>

        <form onSubmit={handleSolicitarCodigo} className="esqueceu-senha-form">
          <div className="esqueceu-senha-input">
            <label htmlFor="email">Endereço de Email</label>
            <input
              type="email"
              name="email"
              id="input_email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="esqueceu-senha-botao">
            <SendButton
              textContent={loading ? "Enviando..." : "Enviar Código"}
              onClick={handleSolicitarCodigo}
              disabled={loading}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EsqueceuSenha;