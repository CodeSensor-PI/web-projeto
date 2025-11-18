import React, { useState, useRef } from 'react';
import '../EsqueceuSenha.css';
import MainComponent from '../../../dashboard/components/MainComponent/MainComponent';
import InputField from '../../../dashboard/components/InputField/InputField';
import SendButton from '../../../dashboard/components/SendButton/SendButton';
import { errorMessage, responseMessage } from '../../../../utils/alert';
import SimpleButton from '../../../dashboard/components/SimpleButton/SimpleButton';

const ConfirmarCodigo = () => {
  const [codigo, setCodigo] = useState('');
  const [digits, setDigits] = useState(Array(6).fill(''));
  const inputsRef = useRef([]);
  const [confirmado, setConfirmado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const joined = digits.join('');
    if (!joined || joined.length !== 6) {
      errorMessage('Digite o código de 6 dígitos enviado ao seu e-mail.');
      return;
    }
    // Aqui você faria a chamada para a API de confirmação de código
    setCodigo(joined);
    setConfirmado(true);
    responseMessage('Código confirmado com sucesso! Você pode redefinir sua senha.');
    setTimeout(() => {
      window.location.href = '/login/esqueceu-senha/alterar-senha'; // Redireciona para a página de alteração de senha
    }, 2000);
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      const next = [...digits];
      next[idx] = '';
      setDigits(next);
      return;
    }

    // If user pasted multiple characters, distribute
    if (val.length > 1) {
      const chars = val.split('');
      const next = [...digits];
      for (let i = 0; i < chars.length && idx + i < 6; i++) {
        next[idx + i] = chars[i];
      }
      setDigits(next);
      const focusIndex = Math.min(5, idx + chars.length - 1);
      inputsRef.current[focusIndex]?.focus();
      return;
    }

    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    // move focus
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = '';
        setDigits(next);
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        const next = [...digits];
        next[idx - 1] = '';
        setDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e, idx) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!paste) return;
    const chars = paste.split('');
    const next = [...digits];
    for (let i = 0; i < chars.length && idx + i < 6; i++) {
      next[idx + i] = chars[i];
    }
    setDigits(next);
    const focusIndex = Math.min(5, idx + chars.length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="esqueceu-senha-container">
      <form className="esqueceu-senha-form flex flex-col gap-4 items-center justify-center" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">Confirme o Código</h2>
        <p className="text-center">
          Digite o código de 6 dígitos que enviamos para o seu e-mail.
        </p>
        <div className="codigo-inputs flex gap-3 justify-center w-full">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="codigo-box"
              style={{
                width: 56,
                height: 56,
                textAlign: 'center',
                fontSize: '1.25rem',
                borderRadius: 8,
                border: '1px solid #d1d5db',
              }}
              aria-label={`Código dígito ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <SendButton
            textContent="Confirmar"
            type="submit"
          />
          <SimpleButton
            variant='secondary'
            type="button"
            onClick={() => window.location.href = '/login/esqueceu-senha'}
          >
            Não recebi o código
          </SimpleButton>
        </div>
        {confirmado && (
          <span className="sucesso-msg text-green-600 text-center">
            Código confirmado! Agora você pode redefinir sua senha.
          </span>
        )}
      </form>
    </div>
  );
};

export default ConfirmarCodigo;