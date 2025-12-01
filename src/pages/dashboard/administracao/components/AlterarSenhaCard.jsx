import React, { useMemo, useState } from 'react';
import InputField from '../../components/InputField/InputField';
import SaveButton from '../../components/SaveButton/SaveButton';
import EditButton from '../../components/EditButton/EditButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import './alterarSenhaCard.css';

const AlterarSenhaCard = ({
  isEditing,
  onToggleEdit,
  senha,
  novaSenha,
  confirmarSenha,
  onChangeSenha,
  onChangeNovaSenha,
  onChangeConfirmarSenha,
  onSavePassword,
}) => {
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
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
    if (strength === 'forte') return 'var(--success-color, #16a34a)';
    if (strength === 'média') return 'var(--warning-color, #f59e0b)';
    if (strength === 'fraca') return 'var(--danger-color, #ef4444)';
    return '#e5e7eb';
  }, [strength]);

  const passwordsMatch = useMemo(() => {
    return novaSenha && confirmarSenha && novaSenha === confirmarSenha;
  }, [novaSenha, confirmarSenha]);

  const canSave = isEditing && strength === 'forte' && passwordsMatch && senha;

  return (
    <form className="editar-conta" onSubmit={(e) => e.preventDefault()}>
      <h2 className="flex items-center justify-between">
        Alterar Senha:
        <EditButton onClick={onToggleEdit} text={isEditing ? 'Cancelar' : 'Editar'} />
      </h2>
      <div className="card-inputs">
        <InputField
          labelTitle="Senha Atual"
          type={showSenhaAtual ? "text" : "password"}
          value={senha}
          disabled={!isEditing}
          width={'w-full'}
          containerWidth={'w-[90%]'}
          onChange={(e) => onChangeSenha(e.target.value)}
          showPasswordToggle={
            isEditing ? (
              <button
                type="button"
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                aria-label={showSenhaAtual ? "Ocultar senha" : "Mostrar senha"}
              >
                {showSenhaAtual ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            ) : null
          }
        />

        <InputField
          labelTitle="Nova senha"
          type={showNovaSenha ? "text" : "password"}
          value={novaSenha}
          width={'w-full'}
          containerWidth={'w-[90%]'}
          disabled={!isEditing}
          onChange={(e) => onChangeNovaSenha(e.target.value)}
          showPasswordToggle={
            isEditing ? (
              <button
                type="button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                aria-label={showNovaSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {showNovaSenha ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            ) : null
          }
        />

        <InputField
          labelTitle="Confirmar senha"
          type={showConfirmarSenha ? "text" : "password"}
          value={confirmarSenha}
          width={'w-full'}
          containerWidth={'w-[90%]'}
          disabled={!isEditing}
          onChange={(e) => onChangeConfirmarSenha(e.target.value)}
          showPasswordToggle={
            isEditing ? (
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                aria-label={showConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmarSenha ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            ) : null
          }
        />
        
        {isEditing && (
          <>
            <div className="match-text" style={{ color: passwordsMatch ? 'var(--success-color, #16a34a)' : 'var(--danger-color, #ef4444)', fontWeight: 600 }}>
              {confirmarSenha ? (passwordsMatch ? 'Senhas coincidem' : 'Senhas não coincidem') : ''}
            </div>

            {/* Indicador de força e checklist */}
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
            </div>
          </>
        )}
      </div>
      <div className="inputs-button">
        <SaveButton icon="🔒" textContent="Alterar Senha" disabled={!canSave} onClick={onSavePassword} />
      </div>
    </form>
  );
};

export default AlterarSenhaCard;
