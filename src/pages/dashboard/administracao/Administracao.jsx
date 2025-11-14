import React, { useState, useEffect } from 'react';
import './style/Administracao.css';

import {
  popupMessage,
  responseMessage,
  errorMessage,
  confirmCancelEdit,
} from '../../../utils/alert';
import { alterarSenha } from '../../../provider/api/alterar-senha-psi';
import axios from 'axios';
import MainComponent from '../components/MainComponent/MainComponent';
import MenuLateralComponent from '../components/MenuLateral/MenuLateralComponent';

import DadosGeraisCard from './components/DadosGeraisCard';
import AlterarSenhaCard from './components/AlterarSenhaCard';

const Administracao = () => {
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [crp, setCrp] = useState('');

  const [senha, setSenha] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const formatTelefone = (numero) => {
    if (!numero) return '';
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  };

  const formatCrp = (numero) => {
    if (!numero) return '';
    return numero.replace(/^(\d{2})(\d{5,6})$/, '$1/$2');
  };

  const removeMask = (valor) => (valor || '').replace(/\D/g, '');

  useEffect(() => {
    const idUsuario = localStorage.getItem('idUsuario');

    if (idUsuario) {
      axios
        .get(`http://localhost:8080/psicologos/${idUsuario}`)
        .then((response) => {
          const { nome, email, telefone, crp } = response.data;
          setNome(nome || '');
          setEmail(email || '');
          setTelefone(formatTelefone(telefone || ''));
          setCrp(formatCrp(crp || ''));
        })
        .catch((error) => {
          console.error('Erro ao buscar informações do usuário:', error);
          errorMessage('Erro ao carregar informações do usuário.');
        });
    }
  }, []);

  const handleEditGeneral = async () => {
    if (isEditingGeneral) {
      const result = await confirmCancelEdit(
        'Cancelar edição?',
        'Tem certeza que deseja cancelar a edição?',
        'medium'
      );
      if (!result.isConfirmed) return;
    }
    setIsEditingGeneral((v) => !v);
  };

  const handleEditPassword = async () => {
    if (isEditingPassword) {
      const result = await confirmCancelEdit(
        'Cancelar edição da senha?',
        'Tem certeza que deseja cancelar a edição da senha?',
        'small'
      );
      if (!result.isConfirmed) return;
    }
    setIsEditingPassword((v) => !v);
  };

  const handleSaveGeneral = async () => {
    if (!email || !nome || !telefone) {
      errorMessage('Todos os campos devem estar preenchidos!');
      return;
    }
    const idDoUsuario = localStorage.getItem('idUsuario');
    try {
      await axios.put(`/psicologos/${idDoUsuario}`, {
        email,
        nome,
        telefone: removeMask(telefone),
        crp: (crp || '').replace('/', ''),
      });
      responseMessage('Dados atualizados com sucesso!');
      setIsEditingGeneral(false);
      localStorage.setItem('nomeUsuario', nome);
    } catch (error) {
      errorMessage('Erro ao salvar dados.');
      console.error(error);
    }
  };

  const handleSavePassword = async () => {
    if (!senha || !novaSenha || !confirmarSenha) {
      errorMessage('Todos os campos devem estar preenchidos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      errorMessage('A nova senha e a confirmação não coincidem!');
      return;
    }

    try {
      const idDoUsuario = localStorage.getItem('idUsuario');
      await alterarSenha(idDoUsuario, senha, novaSenha);
      responseMessage('Senha alterada com sucesso!');
      setIsEditingPassword(false);
    } catch (error) {
      errorMessage('Erro ao alterar a senha.');
      console.error(error);
    }
  };

  // Handlers para passar aos componentes filhos
  const handleNomeChange = (v) => setNome(v);
  const handleEmailChange = (v) => setEmail(v);
  const handleTelefoneChange = (v) => setTelefone(formatTelefone(removeMask(v)));
  const handleCrpChange = (v) => setCrp(v);

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
              <DadosGeraisCard
                isEditing={isEditingGeneral}
                onToggleEdit={handleEditGeneral}
                nome={nome}
                email={email}
                telefone={telefone}
                crp={crp}
                onChangeNome={handleNomeChange}
                onChangeEmail={handleEmailChange}
                onChangeTelefone={handleTelefoneChange}
                onChangeCrp={handleCrpChange}
                onSave={handleSaveGeneral}
              />

              <AlterarSenhaCard
                isEditing={isEditingPassword}
                onToggleEdit={handleEditPassword}
                senha={senha}
                novaSenha={novaSenha}
                confirmarSenha={confirmarSenha}
                onChangeSenha={setSenha}
                onChangeNovaSenha={setNovaSenha}
                onChangeConfirmarSenha={setConfirmarSenha}
                onSavePassword={handleSavePassword}
              />
            </div>
          </div>
        </div>
      </MainComponent>
    </div>
  );
};

export default Administracao;
