import { FaSave } from "react-icons/fa";
import InputField from "../../components/InputField/InputField";
import MenuLateralComponent from "../../components/MenuLateral/MenuLateralComponent";
import "./adicionarPsicologo.css";
import MainComponent from "../../components/MainComponent/MainComponent";
import MenuPsicologo from "../components/menuPsicologo/menuPsicologo";
import { postPsicologo } from "../../../../provider/api/psicologos/fetchs-psicologos";
import { errorMessage, responseMessage } from "../../../../utils/alert";
import { useState } from "react";

const AdicionarPsicologo = () => {
    const [formData, setFormData] = useState({
        nome: "",
        crp: "",
        email: "",
        senha: "123456", // Senha padrão para fins de teste
        telefone: "",
        fkRoles: {
            id: 3, // ID do papel (role) para psicólogos
            role: "PSICOLOGO",
        },
        status: "ATIVO", // Status padrão
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envia os dados do psicólogo para a API
            await postPsicologo(formData);

            responseMessage("Psicólogo adicionado com sucesso!");
            // Redireciona para a lista de psicólogos
            setTimeout(() => {
                window.location.href = "/dashboard/psicologos";
            }, 2000);
        } catch (error) {
            console.error("Erro ao adicionar psicólogo:", error);
            errorMessage("Erro ao adicionar psicólogo. Tente novamente.");
        }
    };

    return (
        <>
            <MenuPsicologo />
            <MainComponent
                title="Adicionar Psicólogo"
                mostrarIconeNotificacao={false}
                headerContent={
                    <button
                        className="btn_agendamento"
                        onClick={() => window.location.href = "/dashboard/psicologos"}
                    >
                        {"< Voltar"}
                    </button>
                }
            >
                <div className="container-psicologo">
                    <h2>Dados do Psicólogo: </h2>
                    <form
                        className="flex flex-col gap-5 w-full"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex gap-3">
                            <InputField
                                type="text"
                                name="nome"
                                labelTitle="Nome Completo"
                                placeholder="Informe o nome completo"
                                width="w-[50%]"
                                required
                                value={formData.nome}
                                onChange={handleChange}
                            />
                            <InputField
                                type="text"
                                name="crp"
                                labelTitle="CRP"
                                placeholder="Informe o CRP"
                                width="w-[50%]"
                                required
                                value={formData.crp}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex gap-3">
                            <InputField
                                type="email"
                                name="email"
                                labelTitle="Endereço de Email"
                                placeholder="Informe seu Email"
                                width="w-[50%]"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <InputField
                                type="text"
                                name="telefone"
                                labelTitle="Telefone"
                                placeholder="(11) 98877-6655"
                                width="w-[50%]"
                                required
                                value={formData.telefone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex gap-3 justify-end mt-5">
                            <button
                                type="submit"
                                className="btn_primario flex rounded-full"
                            >
                                <FaSave className="icon-save" />
                                Adicionar Psicólogo
                            </button>
                            <button
                                type="button"
                                className="btn_secundario flex rounded-full"
                                onClick={() => window.location.href = "/dashboard/psicologos"}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </MainComponent>
        </>
    );
};

export default AdicionarPsicologo;