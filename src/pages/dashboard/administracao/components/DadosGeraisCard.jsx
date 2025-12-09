import React from 'react';
import InputField from '../../components/InputField/InputField';
import SaveButton from '../../components/SaveButton/SaveButton';
import EditButton from '../../components/EditButton/EditButton';

const DadosGeraisCard = ({
  isEditing,
  onToggleEdit,
  nome,
  email,
  telefone,
  crp,
  onChangeNome,
  onChangeEmail,
  onChangeTelefone,
  onChangeCrp,
  onSave,
}) => {
  return (
    <form className="editar-conta" onSubmit={(e) => e.preventDefault()}>
      <h2 className="flex items-center justify-between">
        Dados Gerais:
        <EditButton onClick={onToggleEdit} text={isEditing ? 'Cancelar' : 'Editar'} />
      </h2>
      <div className="card-inputs">
        <InputField
          labelTitle="Nome"
          value={nome}
          width={'w-full'}
          containerWidth={'w-[90%]'}
          disabled={!isEditing}
          onChange={(e) => onChangeNome(e.target.value)}
        />
        <InputField
          labelTitle="E-mail"
          value={email}
          width={'w-full'}
          containerWidth={'w-[90%]'}
          type="email"
          disabled={!isEditing}
          onChange={(e) => onChangeEmail(e.target.value)}
        />
        <InputField
          labelTitle="Telefone"
          value={telefone}
          width={'w-full'}
          containerWidth={'w-[90%]'}
          disabled={!isEditing}
          onChange={(e) => onChangeTelefone(e.target.value)}
        />
        <InputField
          labelTitle="CRP"
          value={crp}
          disabled={true}
          width={'w-full'}
          containerWidth={'w-[90%]'}
          maskType={'crp'}
        />
      </div>
      <div className="inputs-button">
        <SaveButton icon="📄" textContent="Salvar Alterações" disabled={!isEditing} onClick={onSave} />
      </div>
    </form>
  );
};

export default DadosGeraisCard;
