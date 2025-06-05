import React, { useEffect, useState } from "react";
import "./editarPaciente.css";
import { useParams } from "react-router-dom";

import MenuLateralComponent from "../../components/MenuLateral/MenuLateralComponent";
import CheckBox from "../../components/Checkbox/Checkbox";
import InputField from "../../components/InputField/InputField";
import SaveButton from "../../components/SaveButton/SaveButton";
import MainComponent from "../../components/MainComponent/MainComponent";
import { FaUserEdit, FaUser } from "react-icons/fa";
import {
  putDesativarPaciente,
  putPaciente,
  putEndereco,
  buscarTelefonePorIdPaciente
} from "../../../../provider/api/pacientes/fetchs-pacientes";
import Swal from "sweetalert2";
import {
  confirmCancelEdit,
  errorMessage,
  responseMessage,
} from "../../../../utils/alert";
import {
  getPreferenciasPorId,
  putPreferencia,
} from "../../../../provider/api/preferencias/fetchs-preferencias";
import { getEnderecoPorCep } from "../../../../provider/api/pacientes/fetchs-pacientes";
import Loading from "../../components/Loading/Loading";
import EditButton from "../../components/EditButton/EditButton";

const EditarPaciente = () => {
  const { id } = useParams();
  const [paciente, setPaciente] = React.useState({
    fkEndereco: {},
    diaConsulta: "",
    horaConsulta: "",
  });
  const [isEditingGeneral, setIsEditingGeneral] = useState(false); // Controle do modo de edição
  const [isAtivo, setIsAtivo] = useState(false); // Controle do checkbox "Paciente Ativo"
  const [isPlanoAtivo, setIsPlanoAtivo] = useState(true); // Controle do checkbox "Plano Mensal"
  const [preferencias, setPreferencias] = useState([]); // Estado para armazenar as preferências do paciente
  const [erro, setErro] = useState(''); // Estado para armazenar erros
  const [loading, setLoading] = useState(true); // Estado para controle de loading
  const [telefone, setTelefone] = useState({});

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
  ];

  // Mapeamento dos valores do backend para exibição amigável
  const diasSemanaBackend = [
    { value: "SEGUNDA", label: "Segunda-feira" },
    { value: "TERCA", label: "Terça-feira" },
    { value: "QUARTA", label: "Quarta-feira" },
    { value: "QUINTA", label: "Quinta-feira" },
    { value: "SEXTA", label: "Sexta-feira" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pacienteResponse, preferenciasResponse] = await Promise.all([
          fetch(`/pacientes/${id}`).then((res) => res.json()),
          getPreferenciasPorId(id)
        ]);

        setPaciente({
          ...pacienteResponse,
          fkEndereco: pacienteResponse.fkEndereco || {},
          diaConsulta: preferenciasResponse.diaSemana,
          horaConsulta: preferenciasResponse.horario,
        });

        setIsAtivo(pacienteResponse.status === "ATIVO");
        setIsPlanoAtivo(pacienteResponse.fkPlano.id === 2);
        setPreferencias(preferenciasResponse);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
      setTimeout(() => setLoading(false), 500);
    };

    fetchData();
  }, [id]);
  const handleEditGeneral = async () => {
    if (isEditingGeneral) {
      const result = await confirmCancelEdit(
        "Cancelar edição?",
        "Tem certeza que deseja cancelar a edição?",
        "small"
      );
      if (!result.isConfirmed) return;
    }
    setIsEditingGeneral(!isEditingGeneral);
  };

  const buscarTelefone = async () => {
    try {
      const telefoneResponse = await buscarTelefonePorIdPaciente(id);
      if (telefoneResponse && telefoneResponse.length > 0) {
        setTelefone((prev) => ({
          ...prev,
          telefone: telefoneResponse[0].numero || "",
          ddd: telefoneResponse[0].ddd || "",
          telefoneContato: telefoneResponse[1]?.numero || "",
          dddContato: telefoneResponse[1]?.ddd || "",
          nomeContato: telefoneResponse[1]?.nomeContato || "",
        }));
      } else {
        setTelefone((prev) => ({
          ...prev,
          telefone: "",
          ddd: "",
          telefoneContato: "",
          dddContato: "",
          nomeContato: "",
        }));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTelefone({
          telefone: "",
          ddd: "",
          telefoneContato: "",
          dddContato: "",
          nomeContato: "",
        });
        return;
      } else {
        console.error("Erro ao buscar telefone:", error?.message, error?.response);
        errorMessage("Erro ao buscar telefone do paciente.");
      }
    }
  };

  useEffect(() => {
    buscarTelefone();
  }, [id]);

  function limparCamposEndereco() {
    setPaciente((prev) => ({
      ...prev,
      fkEndereco: {
        ...prev.fkEndereco,
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
      },
    }));
  }

  const handleBuscarEndereco = async () => {
    try {
      setErro("");
      const cepSemFormatacao = paciente.fkEndereco?.cep?.replace(/\D/g, "");

      if (!cepSemFormatacao || cepSemFormatacao.length !== 8) {
        throw new Error("Formato de CEP inválido.");
      }

      const endereco = await getEnderecoPorCep(cepSemFormatacao);

      setPaciente((prev) => ({
        ...prev,
        fkEndereco: {
          ...prev.fkEndereco,
          logradouro: endereco.logradouro || "",
          bairro: endereco.bairro || "",
          cidade: endereco.localidade || "",
          uf: endereco.uf || "",
        },
      }));
    } catch (error) {
      limparCamposEndereco();
      setErro("CEP Inválido ou não encontrado.");
      return;
    }
  };

  const handleAtualizarPaciente = async () => {
    try {
      // const cpfFormatado = paciente.cpf?.trim();

      const pacienteAtualizado = {
        nome: paciente.nome,
        email: paciente.email,
        senha: paciente.senha || "senha_padrao",
        status: isAtivo ? "ATIVO" : "INATIVO",
        fkPlano: {
          id: isPlanoAtivo ? 2 : 1,
        },
        fkEndereco: {
          id: paciente.fkEndereco?.id || null,
        },
      };

      const preferenciaAtualizada = {
        diaSemana: paciente.diaConsulta,
        horario: paciente.horaConsulta,
      };

      await putPreferencia(preferencias.id, preferenciaAtualizada);

      console.log(`STATUS PACIENTE: ${pacienteAtualizado.status}`);

      if (!isAtivo) {
        await putDesativarPaciente(id, pacienteAtualizado);
      } else {
        await putPaciente(id, pacienteAtualizado);
      }

      let enderecoAtualizado = false;

      if (paciente.fkEndereco?.id) {
        const enderecoPayload = {
          cep: paciente.fkEndereco?.cep?.trim() || "",
          logradouro: paciente.fkEndereco?.logradouro || "",
          bairro: paciente.fkEndereco?.bairro || "",
          numero: paciente.fkEndereco?.numero || "",
          cidade: paciente.fkEndereco?.cidade || "",
          uf: paciente.fkEndereco?.uf || "",
        };

        await putEndereco(paciente.fkEndereco.id, enderecoPayload);
        enderecoAtualizado = true;
      } else {
        console.warn(
          "Usuário não possui endereço cadastrado. PUT de endereço ignorado."
        );
      }

      if (enderecoAtualizado) {
        responseMessage("Paciente e endereço atualizados com sucesso!");
        setTimeout(() => {
          window.location = '/dashboard/pacientes';
        }, 1200);
      } else {
        responseMessage("Paciente atualizado com sucesso!");
        setTimeout(() => {
          window.location = '/dashboard/pacientes';
        }, 1200);

      }

      setIsEditingGeneral(false);
    } catch (error) {
      console.error("Erro ao atualizar paciente ou endereço:", error);
      errorMessage("Ocorreu um erro ao atualizar o paciente ou endereço.");
    }
  };
  return (
    <div className="div-administracao flex">
      <MenuLateralComponent></MenuLateralComponent>
      {loading && <Loading />}
      <MainComponent
        title="Editar Paciente"
        headerContent={
          <>
            <div className="flex w-full justify-between">
              <button className="btn_agendamento rounded-full" onClick={() => window.location.href = '/dashboard/pacientes'}>
                {"< Voltar"}
              </button>
              <EditButton
                className="bg-white"
                onClick={handleEditGeneral}
                text={isEditingGeneral ? "Cancelar" : "Editar"}
              />
            </div>
          </>
        }
      >
        <form className="editPaciente">
          <section className="flex">

            <div className="flex flex-col gap-4">
              <figure>
                <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {paciente.imagemUrl && paciente.imagemUrl.trim() !== "" ? (
                    <img
                      src={paciente.imagemUrl}
                      alt="Foto do paciente"
                      style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <FaUser size={80} color="#bdbdbd" />
                  )}
                </div>
                <span>
                  <span>Upload</span> imagem
                </span>
              </figure>
              <CheckBox
                CheckboxValue={"ativo"}
                labelTitle={"Plano Mensal?"}
                checked={isPlanoAtivo}
                disabled={!isEditingGeneral}
                onChange={(e) => setIsPlanoAtivo(e.target.checked)}
              />
              <CheckBox
                CheckboxValue={"ativo"}
                labelTitle={"Paciente Ativo?"}
                checked={isAtivo}
                disabled={!isEditingGeneral}
                onChange={(e) => setIsAtivo(e.target.checked)}
              />
            </div>

            <section className="fields">

              <section>

                <div className="inputArea">

                  <div className="input-card flex flex-col gap-2">
                    <h2>Dados do Paciente:</h2>
                    <InputField
                      disabled={!isEditingGeneral}
                      labelTitle={"Nome"}
                      placeholder={'Nome do paciente'}
                      containerWidth={"w-full"}
                      value={paciente.nome || ""}
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          nome: e.target.value,
                        }))
                      }
                    />
                    <InputField
                      labelTitle="CPF"
                      placeholder="CPF do paciente"
                      containerWidth={"w-full"}
                      maxLength={14}
                      disabled={true}
                      value={paciente.cpf || ""}
                      maskType="cpf"
                    />
                    <InputField
                      disabled={!isEditingGeneral}
                      type={"tel"}
                      placeholder={'Telefone do paciente'}
                      labelTitle={"Telefone"}
                      containerWidth={"w-full"}
                      value={(telefone.ddd || "") + (telefone.telefone || "")}
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          telefone: e.target.value,
                        }))
                      }
                      maskType="telefone"
                    />
                    <InputField
                      disabled={!isEditingGeneral}
                      type={"email"}
                      placeholder={'E-mail do paciente'}
                      labelTitle={"E-mail"}
                      containerWidth={"w-full"}
                      value={paciente.email || ""}
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="input-card flex flex-col gap-2">
                    <h2>Preferências do Paciente:</h2>
                    <div className="flex flex-col gap-2">
                      <label className="w-fit text-sm font-bold text-gray-800">Dia de Consultas:</label>
                      <select
                        className="border-b border-gray-300 text-sm px-2 py-2 caret-blue-500 outline-none"
                        disabled={!isEditingGeneral}
                        value={
                          diasSemanaBackend.some(d => d.value === paciente.diaConsulta)
                            ? paciente.diaConsulta
                            : ""
                        }
                        onChange={e =>
                          setPaciente(prev => ({
                            ...prev,
                            diaConsulta: e.target.value,
                          }))
                        }
                      >
                        <option value="" disabled>Selecione o dia</option>
                        {diasSemanaBackend.map(dia => (
                          <option key={dia.value} value={dia.value}>{dia.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="w-fit text-sm font-bold text-gray-800">
                        Horário de Consultas:</label>
                      <select
                        className="border-b border-gray-300 text-sm px-2 py-2 caret-blue-500 outline-none"

                        disabled={!isEditingGeneral}
                        value={paciente.horaConsulta || ""}
                        onChange={e =>
                          setPaciente(prev => ({
                            ...prev,
                            horaConsulta: e.target.value,
                          }))
                        }
                      >
                        <option value="" disabled>Selecione o horário</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                      </select>
                    </div>

                    <InputField
                      disabled={!isEditingGeneral}
                      labelTitle={"Contato de Emergência"}
                      placeholder={'Nome do contato de emergência'}
                      value={telefone.nomeContato || ""}
                      containerWidth={"w-full"}
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          nomeContato: e.target.value,
                        }))
                      }
                    />
                    <InputField
                      disabled={!isEditingGeneral}
                      type={"tel"}
                      containerWidth={"w-full"}
                      labelTitle={"Telefone de Emergência"}
                      placeholder={'Telefone do contato de emergência'}
                      value={(telefone.telefoneContato || "") + (telefone.dddContato || "")}
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          telefoneContato: e.target.value,
                        }))
                      }
                      maskType="telefone"
                    />
                  </div>

                  <div className="input-card flex flex-col gap-2">
                    <h2>Endereço do Paciente:</h2>
                    <div>
                      <InputField
                        disabled={true}
                        type={"text"}
                        labelTitle={"CEP"}
                        containerWidth={"w-full"}
                        placeholder={'CEP do paciente'}
                        value={paciente.fkEndereco?.cep || ""} // Usa o operador ?. para evitar erros
                        maxLength={9}
                        onChange={(e) =>
                          setPaciente((prev) => ({
                            ...prev,
                            fkEndereco: {
                              ...prev.fkEndereco,
                              cep: e.target.value,
                            },
                          }))
                        }
                        onBlur={handleBuscarEndereco}
                        maskType="cep"
                      />
                      {erro && <p className="text-xs text-red-500">{erro}</p>}
                    </div>
                    <InputField
                      disabled={true}
                      type={"text"}
                      labelTitle={"Cidade"}
                      containerWidth={"w-full"}
                      placeholder={'Cidade do paciente'}
                      value={paciente.fkEndereco?.cidade || ""} // Usa o operador ?. para evitar erros
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          fkEndereco: {
                            ...prev.fkEndereco,
                            cidade: e.target.value,
                          },
                        }))
                      }
                    />
                    <InputField
                      disabled={true}
                      type={"text"}
                      labelTitle={"Bairro"}
                      placeholder={'Bairro do paciente'}
                      containerWidth={"w-full"}
                      value={paciente.fkEndereco?.bairro || ""} // Usa o operador ?. para evitar erros
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          fkEndereco: {
                            ...prev.fkEndereco,
                            bairro: e.target.value,
                          },
                        }))
                      }
                    />
                    <InputField
                      disabled={true}
                      type={"text"}
                      labelTitle={"Número"}
                      placeholder={'Número do endereço'}
                      containerWidth={"w-full"}
                      value={paciente.fkEndereco?.numero || ""}
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          fkEndereco: {
                            ...prev.fkEndereco,
                            numero: e.target.value,
                          },
                        }))
                      }
                    />
                    <InputField
                      disabled={true}
                      type={"text"}
                      labelTitle={"Logradouro"}
                      placeholder={'Logradouro do paciente'}
                      containerWidth={"w-full"}
                      value={paciente.fkEndereco?.logradouro || ""}
                      onChange={(e) =>
                        setPaciente((prev) => ({
                          ...prev,
                          fkEndereco: {
                            ...prev.fkEndereco,
                            logradouro: e.target.value,
                          },
                        }))
                      }
                    />
                    <div className="flex flex-col gap-2">

                      <InputField
                        className="border-b border-gray-300 text-sm px-0 py-2 caret-blue-500 outline-none"
                        disabled={true}
                        type={"text"}
                        labelTitle={"Estado"}
                        placeholder={'Estado do paciente'}
                        containerWidth={"w-full"}
                        value={paciente.fkEndereco?.uf || ""}
                        onChange={(e) =>
                          setPaciente((prev) => ({
                            ...prev,
                            fkEndereco: {
                              ...prev.fkEndereco,
                              uf: e.target.value,
                            },
                          }))
                        }
                      />

                    </div>
                  </div>


                </div>
              </section>
            </section>
          </section>
          <SaveButton
            textContent="Salvar Alterações"
            disabled={!isEditingGeneral}
            onClick={handleAtualizarPaciente}
          />
        </form>
      </MainComponent>
    </div>
  );
};

export default EditarPaciente;
