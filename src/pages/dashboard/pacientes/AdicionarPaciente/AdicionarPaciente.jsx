import React, { useState } from 'react';
import './adicionarPaciente.css';
import MenuLateralComponent from '../../components/MenuLateral/MenuLateralComponent';
import CheckBox from '../../components/Checkbox/Checkbox';
import InputField from '../../components/InputField/InputField';
import SaveButton from '../../components/SaveButton/SaveButton';
import MainComponent from '../../components/MainComponent/MainComponent';
import { postPaciente } from '../../../../provider/api/pacientes/fetchs-pacientes';
import { postPreferencia } from '../../../../provider/api/preferencias/fetchs-preferencias'; // Importa a função para cadastrar preferências
import { errorMessage, responseMessage } from '../../../../utils/alert';

const AdicionarPaciente = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [diaConsultas, setDiaConsultas] = useState('');
    const [horarioConsultas, setHorarioConsultas] = useState('');
    const [planoMensal, setPlanoMensal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação simples
        if (!nome || !email || !diaConsultas || !horarioConsultas) {
            errorMessage('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const planoMensalEscolhido = planoMensal ? 2 : 1; // ID do plano mensal ou avulso
        const senha = "123456"; // Senha padrão para fins de teste

        const novoPaciente = {
            nome,
            email,
            senha,
            status: "ATIVO",
            fkPlano: {
                id: planoMensalEscolhido,
                categoria: planoMensal ? "PLANO" : "AVULSO",
                preco: planoMensal ? 1200 : 0, // Exemplo de preço
            },
        };

        try {
            // Cadastra o paciente
            const pacienteCadastrado = await postPaciente(novoPaciente);
            console.log("Paciente cadastrado:", pacienteCadastrado);

            // Cadastra a preferência associada ao paciente
            const novaPreferencia = {
                diaSemana: diaConsultas.toUpperCase(), // Converte o dia para maiúsculas
                horario: horarioConsultas,
                fkPaciente: {
                    id: pacienteCadastrado.id, // Certifique-se de que o ID está presente
                },
            };
            console.log("Payload enviado:", novaPreferencia);
            await postPreferencia(novaPreferencia);
            console.log("Preferência cadastrada:", novaPreferencia);

            responseMessage("Paciente e endereço atualizados com sucesso!");
            
            // Limpa os campos após o sucesso
            setNome('');
            setEmail('');
            setDiaConsultas('');
            setHorarioConsultas('');
            setPlanoMensal(false);
            setTimeout(() => {
                window.location = '/dashboard/pacientes';
            }, 1200);
        } catch (error) {
            console.error('Erro ao adicionar paciente ou preferências:', error);
            errorMessage('Erro ao adicionar paciente ou preferências. Tente novamente.');
        }
    };

    return (
        <div className='div-administracao flex'>
            <MenuLateralComponent></MenuLateralComponent>

            <MainComponent title="Adicionar Paciente"
                headerContent={
                    <button className="btn_agendamento" onClick={() => window.location.href = '/dashboard/pacientes'}>
                        {"< Voltar"}
                    </button>
                }
            >
                <form className='addPaciente' onSubmit={handleSubmit}>
                    <main className='div-add-paciente'>
                        <h2>Dados Do Paciente:</h2>
                        <section>
                            <div className='flex gap-3'>
                                <InputField
                                    labelTitle={'Nome'}
                                    value={nome}
                                    width={'w-full'}
                                    placeholder={'Nome do paciente'}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                                <InputField
                                    labelTitle={'E-mail'}
                                    type={'email'}
                                    value={email}
                                    width={'w-full'}
                                    placeholder={'E-mail do paciente'}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='flex gap-3'>
                                <div className="select-container">
                                    <label htmlFor="diaConsultas">Dia de Consultas</label>
                                    <select
                                        id="diaConsultas"
                                        value={diaConsultas}
                                        className='select-field w-full'
                                        onChange={(e) => setDiaConsultas(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Selecione um dia</option>
                                        <option value="SEGUNDA">Segunda-feira</option>
                                        <option value="TERCA">Terça-feira</option>
                                        <option value="QUARTA">Quarta-feira</option>
                                        <option value="QUINTA">Quinta-feira</option>
                                        <option value="SEXTA">Sexta-feira</option>
                                    </select>
                                </div>
                                <div className="select-container">
                                    <label htmlFor="horarioConsultas">Horário de Consultas</label>
                                    <select
                                        id="horarioConsultas"
                                        value={horarioConsultas}
                                        className='select-field w-full'
                                        onChange={(e) => setHorarioConsultas(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Selecione um horário</option>
                                        {Array.from({ length: 9 }, (_, i) => {
                                            const hour = (8 + i).toString().padStart(2, '0');
                                            return (
                                                <option key={hour} value={`${hour}:00`}>
                                                    {`${hour}:00`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <CheckBox
                                CheckboxValue={'mensal'}
                                labelTitle={'Plano Mensal'}
                                checked={planoMensal}
                                onChange={(e) => setPlanoMensal(e.target.checked)}
                            />
                        </section>
                        <SaveButton textContent={'Adicionar Paciente'} type="submit" />
                    </main>

                </form>
            </MainComponent>
        </div>
    );
};

export default AdicionarPaciente;