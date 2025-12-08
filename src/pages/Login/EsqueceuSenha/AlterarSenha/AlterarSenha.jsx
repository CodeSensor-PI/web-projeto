import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Titulo from "../../../../components/Titulo/Titulo";
import { errorMessage, responseMessage } from "../../../../utils/alert";
import { redefinirSenha } from "../../../../provider/api/password-reset";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import SendButton from "../../../dashboard/components/SendButton/SendButton";
import "./AlterarSenha.css";

const AlterarSenha = () => {
  const [searchParams] = useSearchParams();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const email = searchParams.get("email");
  const codigo = searchParams.get("codigo");

  useEffect(() => {
    if (!email || !codigo) {
      errorMessage("Informações incompletas. Redirecionando...");
      setTimeout(() => {
        window.location.href = "/login/esqueceu-senha";
      }, 2000);
    }
  }, [email, codigo]);

  // Regras para senha forte
  const rules = useMemo(() => ({
    minLength: 12,
    hasLower: /[a-z]/.test(novaSenha || ''),
    hasUpper: /[A-Z]/.test(novaSenha || ''),
    hasNumber: /[0-9]/.test(novaSenha || ''),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha || ''),
  }), [novaSenha]);

  const satisfied = useMemo(() => {
    return {
      length: (novaSenha || '').length >= rules.minLength,
      lower: rules.hasLower,
      upper: rules.hasUpper,
      number: rules.hasNumber,
      special: rules.hasSpecial,
    };
  }, [novaSenha, rules]);

  // calcula força: 0-5
  const score = useMemo(() => {
    let s = 0;
    if (satisfied.length) s += 2; // comprimento ponderado
    if (satisfied.lower) s += 1;
    if (satisfied.upper) s += 1;
    if (satisfied.number) s += 1;
    if (satisfied.special) s += 1;
    return Math.min(s, 5);
  }, [satisfied]);

  const strength = useMemo(() => {
    if (score >= 5) return 'forte';
    if (score >= 3) return 'média';
    if (score > 0) return 'fraca';
    return '';
  }, [score]);

  const strengthColor = useMemo(() => {
    if (strength === 'forte') return '#16a34a';
    if (strength === 'média') return '#f59e0b';
    if (strength === 'fraca') return '#ef4444';
    return '#e5e7eb';
  }, [strength]);

  const passwordsMatch = useMemo(() => {
    return novaSenha && confirmarSenha && novaSenha === confirmarSenha;
  }, [novaSenha, confirmarSenha]);

  const canSave = strength === 'forte' && passwordsMatch;

  const handleAlterarSenha = async (e) => {
    e.preventDefault();

    if (!novaSenha || novaSenha.length < 12) {
      errorMessage("A senha deve ter no mínimo 12 caracteres.");
      return;
    }

    if (strength !== 'forte') {
      errorMessage("A senha deve ser forte para continuar.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      errorMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await redefinirSenha(codigo, novaSenha, 'psicologo');
      responseMessage("Senha alterada com sucesso!");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2300);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      
      // Tratamento de erros mais específico
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data.includes && data.includes("Código inválido")) {
            errorMessage("Código inválido ou expirado. Solicite um novo código.");
          } else if (data.includes && data.includes("expirado")) {
            errorMessage("Código expirado. Solicite um novo código.");
          } else {
            errorMessage("Código inválido. Verifique o código e tente novamente.");
          }
        } else if (status === 404) {
          errorMessage("Código não encontrado. Solicite um novo código.");
        } else {
          errorMessage("Erro no servidor. Tente novamente em alguns momentos.");
        }
      } else {
        errorMessage("Erro de conexão. Verifique sua internet e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alterar-senha-page">
      <div className="alterar-senha-container">
        <p
          className="alterar-senha-voltar"
          onClick={() => (window.location.href = "/login")}
        >
          Voltar para Login
        </p>

        <div className="alterar-senha-title">
          <Titulo titulo="Alterar Senha" />
          <p>Digite sua nova senha abaixo.</p>
        </div>

        <form onSubmit={handleAlterarSenha} className="alterar-senha-form">
          <div className="alterar-senha-input">
            <label htmlFor="novaSenha">Nova Senha:</label>
            <div className="alterar-senha-input-wrapper">
              <input
                type={showNovaSenha ? "text" : "password"}
                name="novaSenha"
                id="input_nova_senha"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="alterar-senha-eye-button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                aria-label={showNovaSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {showNovaSenha ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <div className="alterar-senha-input">
            <label htmlFor="confirmarSenha">Confirmar senha:</label>
            <div className="alterar-senha-input-wrapper">
              <input
                type={showConfirmarSenha ? "text" : "password"}
                name="confirmarSenha"
                id="input_confirmar_senha"
                placeholder="Confirme a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="alterar-senha-eye-button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                aria-label={showConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmarSenha ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {confirmarSenha && (
            <div className="alterar-senha-match-text" style={{ color: passwordsMatch ? '#16a34a' : '#ef4444' }}>
              {passwordsMatch ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
            </div>
          )}

          {novaSenha && (
            <div className="alterar-senha-password-feedback">
              <div className="alterar-senha-password-meter">
                <div 
                  className="alterar-senha-meter-fill" 
                  style={{ width: `${(score / 5) * 100}%`, backgroundColor: strengthColor }} 
                />
              </div>
              <div className="alterar-senha-strength-text" style={{ color: strengthColor }}>
                {strength ? strength.charAt(0).toUpperCase() + strength.slice(1) : '—'}
              </div>

              <ul className="alterar-senha-requirements-list">
                <li style={{ color: satisfied.length ? '#16a34a' : '#6b7280' }}>
                  {satisfied.length ? '✓' : '○'} Mínimo de {rules.minLength} caracteres
                </li>
                <li style={{ color: satisfied.upper ? '#16a34a' : '#6b7280' }}>
                  {satisfied.upper ? '✓' : '○'} Uma letra maiúscula (A-Z)
                </li>
                <li style={{ color: satisfied.lower ? '#16a34a' : '#6b7280' }}>
                  {satisfied.lower ? '✓' : '○'} Uma letra minúscula (a-z)
                </li>
                <li style={{ color: satisfied.number ? '#16a34a' : '#6b7280' }}>
                  {satisfied.number ? '✓' : '○'} Um número (0-9)
                </li>
                <li style={{ color: satisfied.special ? '#16a34a' : '#6b7280' }}>
                  {satisfied.special ? '✓' : '○'} Um caractere especial (!@#$...)
                </li>
              </ul>
            </div>
          )}

          <div className="alterar-senha-botao">
            <SendButton
              textContent={loading ? "Alterando..." : "Alterar Senha"}
              onClick={handleAlterarSenha}
              disabled={loading || !canSave}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlterarSenha;
