import React, { useState, useMemo } from 'react';
import '../EsqueceuSenha.css';
import MainComponent from '../../../dashboard/components/MainComponent/MainComponent';
import InputField from '../../../dashboard/components/InputField/InputField';
import SendButton from '../../../dashboard/components/SendButton/SendButton';
import { errorMessage, responseMessage } from '../../../../utils/alert';
import SaveButton from '../../../dashboard/components/SaveButton/SaveButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AlterarSenha = () => {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alterada, setAlterada] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // validar força da senha e confirmação
    const rules = {
      minLength: 12,
      hasLower: /[a-z]/.test(senha || ''),
      hasUpper: /[A-Z]/.test(senha || ''),
      hasNumber: /[0-9]/.test(senha || ''),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha || ''),
    };

    const satisfied = {
      length: (senha || '').length >= rules.minLength,
      lower: rules.hasLower,
      upper: rules.hasUpper,
      number: rules.hasNumber,
      special: rules.hasSpecial,
    };

    let score = 0;
    if (satisfied.length) score += 2;
    if (satisfied.lower) score += 1;
    if (satisfied.upper) score += 1;
    if (satisfied.number) score += 1;
    if (satisfied.special) score += 1;
    score = Math.min(score, 5);

    const strength = score >= 5 ? 'forte' : score >= 3 ? 'média' : score > 0 ? 'fraca' : '';

    if (strength !== 'forte') {
      errorMessage('A senha precisa ser forte antes de prosseguir. Confira os requisitos abaixo.');
      return;
    }

    if (senha !== confirmarSenha) {
      errorMessage('As senhas não coincidem.');
      return;
    }
    // Aqui você faria a chamada para a API de alteração de senha
    setAlterada(true);
    responseMessage('Senha alterada com sucesso! Você já pode fazer login.');
    setTimeout(() => {
      window.location.href = '/login'; // Redireciona para a página de login
    }, 2000);
  };

  return (
    <div className="esqueceu-senha-container">
      <form className="esqueceu-senha-form flex flex-col gap-4 items-center justify-center" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">Alterar Senha</h2>
        <p className="text-center">
          Digite sua nova senha abaixo.
        </p>
        <div className="w-full">
          <label className="block text-base font-medium mb-1">Nova senha</label>
          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              placeholder="Nova senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {showSenha ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label className="block text-base font-medium mb-1">Confirmar senha</label>
          <div className="relative">
            <input
              type={showConfirmarSenha ? "text" : "password"}
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {showConfirmarSenha ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>
        {/* Indicador de força e checklist semelhante ao used em AlterarSenhaCard */}
        {(
          (() => {
            const rules = {
              minLength: 12,
              hasLower: /[a-z]/.test(senha || ''),
              hasUpper: /[A-Z]/.test(senha || ''),
              hasNumber: /[0-9]/.test(senha || ''),
              hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha || ''),
            };

            const satisfied = {
              length: (senha || '').length >= rules.minLength,
              lower: rules.hasLower,
              upper: rules.hasUpper,
              number: rules.hasNumber,
              special: rules.hasSpecial,
            };

            let score = 0;
            if (satisfied.length) score += 2;
            if (satisfied.lower) score += 1;
            if (satisfied.upper) score += 1;
            if (satisfied.number) score += 1;
            if (satisfied.special) score += 1;
            score = Math.min(score, 5);

            const strength = score >= 5 ? 'forte' : score >= 3 ? 'média' : score > 0 ? 'fraca' : '';
            const strengthColor = strength === 'forte' ? 'var(--success-color, #16a34a)' : strength === 'média' ? 'var(--warning-color, #f59e0b)' : strength === 'fraca' ? 'var(--danger-color, #ef4444)' : '#e5e7eb';

            const passwordsMatch = senha && confirmarSenha && senha === confirmarSenha;
            const canSave = strength === 'forte' && passwordsMatch;

            return (
              <>
                <div className="password-feedback" style={{ width: '100%', marginTop: 8 }}>
                  <div className="password-meter" aria-hidden>
                    <div className="meter-fill" style={{ width: `${(score / 5) * 100}%`, background: strengthColor }} />
                  </div>
                  <div className="strength-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, flexDirection: 'column' }}>
                    <div className="strength-text" style={{ color: strengthColor, fontWeight: 600, textTransform: 'capitalize' }}>{strength || '—'}</div>
                  </div>

                  <ul className="requirements-list" style={{ marginTop: 8, paddingLeft: 18 }}>
                    <li style={{ color: satisfied.length ? 'var(--success-color, #16a34a)' : '#6b7280' }}>
                      {satisfied.length ? '✓' : '○'} Mínimo de {rules.minLength} caracteres
                    </li>
                    <li style={{ color: satisfied.upper ? 'var(--success-color, #16a34a)' : '#6b7280' }}>
                      {satisfied.upper ? '✓' : '○'} Uma letra maiúscula (A-Z)
                    </li>
                    <li style={{ color: satisfied.lower ? 'var(--success-color, #16a34a)' : '#6b7280' }}>
                      {satisfied.lower ? '✓' : '○'} Uma letra minúscula (a-z)
                    </li>
                    <li style={{ color: satisfied.number ? 'var(--success-color, #16a34a)' : '#6b7280' }}>
                      {satisfied.number ? '✓' : '○'} Um número (0-9)
                    </li>
                    <li style={{ color: satisfied.special ? 'var(--success-color, #16a34a)' : '#6b7280' }}>
                      {satisfied.special ? '✓' : '○'} Um caractere especial (!@#$...)
                    </li>
                  </ul>

                  <div className="match-text" style={{ color: passwordsMatch ? 'var(--success-color, #16a34a)' : 'var(--danger-color, #ef4444)', fontWeight: 600, marginTop: 8 }}>
                    {confirmarSenha ? (passwordsMatch ? 'Senhas coincidem' : 'Senhas não coincidem') : ''}
                  </div>

                  <div className="inputs-button" style={{ marginTop: 12 }}>
                    <SaveButton textContent="Alterar Senha" type="submit" disabled={!canSave} />
                  </div>
                </div>
              </>
            );
          })()
        )}
        {alterada && (
          <span className="sucesso-msg text-green-600 text-center">
            Senha alterada com sucesso! Você já pode fazer login.
          </span>
        )}
      </form>
    </div>
  );
};

export default AlterarSenha;