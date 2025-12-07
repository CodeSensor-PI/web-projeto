import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Titulo from "../../../../components/Titulo/Titulo";
import { errorMessage, responseMessage } from "../../../../utils/alert";
import { validarCodigoRecuperacao } from "../../../../provider/api/password-reset";
import SendButton from "../../../dashboard/components/SendButton/SendButton";
import "./ConfirmarCodigo.css";

const ConfirmarCodigo = () => {
  const [searchParams] = useSearchParams();
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const email = searchParams.get("email");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      errorMessage("Email não informado. Redirecionando...");
      setTimeout(() => {
        window.location.href = "/login/esqueceu-senha";
      }, 2000);
    }
  }, [email]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCodigo = [...codigo];
    newCodigo[index] = value.slice(-1);
    setCodigo(newCodigo);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCodigo = [...codigo];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCodigo[i] = pastedData[i];
    }
    
    setCodigo(newCodigo);
    const nextEmptyIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleValidarCodigo = async (e) => {
    e.preventDefault();

    const codigoCompleto = codigo.join("");

    if (codigoCompleto.length !== 6) {
      errorMessage("Por favor, insira o código completo de 6 dígitos.");
      return;
    }

    if (!/^\d{6}$/.test(codigoCompleto)) {
      errorMessage("O código deve conter apenas números.");
      return;
    }

    setLoading(true);

    try {
      await validarCodigoRecuperacao(email, codigoCompleto);
      responseMessage("Código validado com sucesso!");
      
      setTimeout(() => {
        window.location.href = `/login/esqueceu-senha/alterar-senha?email=${encodeURIComponent(email)}&codigo=${codigoCompleto}`;
      }, 2000);
    } catch (error) {
      console.error("Erro ao validar código:", error);
      
      if (error.message === "Código inválido ou expirado") {
        errorMessage("Código inválido ou expirado. Solicite um novo código.");
      } else {
        errorMessage("Erro na validação. Verifique o código e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirmar-codigo">
      <div className="container">
        <div className="title">
          <Titulo titulo="Confirme o Código" />
          <p>Digite o código de 6 dígitos que enviamos para o seu e-mail.</p>
        </div>

        <form onSubmit={handleValidarCodigo} className="form">
          <div className="codigo-inputs">
            {codigo.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="digit-input"
              />
            ))}
          </div>

          <div className="botao">
            <SendButton
              textContent={loading ? "Confirmando..." : "Confirmar"}
              onClick={handleValidarCodigo}
              disabled={loading}
              type="submit"
            />
          </div>

          <p className="nao-recebi">Não recebi o código</p>
        </form>
      </div>
    </div>
  );
};

export default ConfirmarCodigo;
