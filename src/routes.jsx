import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
// import { environment } from "../environments/environment";
import LandingPage from "./pages/landingPage/LandingPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Agendamentos from "./pages/dashboard/agendamentos/Agendamentos";
import CadastrarAgendamento from "./pages/dashboard/agendamentos/CadastrarAgendamento/CadastrarAgendamento";
import EditarAgendamento from "./pages/dashboard/agendamentos/EditarAgendamento/EditarAgendamento";
import Pacientes from "./pages/dashboard/pacientes/Pacientes";
import EditarPaciente from "./pages/dashboard/pacientes/EditarPaciente/EditarPaciente";
import AdicionarPaciente from "./pages/dashboard/pacientes/AdicionarPaciente/AdicionarPaciente";
import Administracao from "./pages/dashboard/administracao/Administracao";
import Psicologos from "./pages/dashboard/psicologos/psicologos";
import AdicionarPsicologo from "./pages/dashboard/psicologos/adicionarPsicologo/adicionarPsicologo";
import LoginPage from "./pages/Login/Login";
import EditarPsicologo from "./pages/dashboard/psicologos/visualizarPsicologo/EditarPsicologo";
import EsqueceuSenha from "./pages/Login/EsqueceuSenha/EsqueceuSenha";
import ConfirmarCodigo from "./pages/Login/EsqueceuSenha/ConfirmarCodigo/ConfirmarCodigo";
import AlterarSenha from "./pages/Login/EsqueceuSenha/AlterarSenha/AlterarSenha";
import Desconectado from "./pages/components/desconectado/Desconectado";
import NotFound from "./pages/components/notFound/NotFound";

export const routes = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/desconectado", element: <Desconectado /> },
    { path: "/login/esqueceu-senha", element: <EsqueceuSenha /> },
    { path: "/login/esqueceu-senha/confirmar-codigo", element: <ConfirmarCodigo /> },
    { path: "/login/esqueceu-senha/alterar-senha", element: <AlterarSenha /> },
    // Rotas protegidas por ambiente
    { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
    { path: "/dashboard/agendamentos", element: <ProtectedRoute><Agendamentos /></ProtectedRoute> },
    { path: "/dashboard/agendamentos/cadastrar/:id", element: <ProtectedRoute><CadastrarAgendamento /></ProtectedRoute> },
    { path: "/dashboard/agendamentos/cadastrar", element: <ProtectedRoute><CadastrarAgendamento /></ProtectedRoute> },
    { path: "/dashboard/agendamentos/editar/:id", element: <ProtectedRoute><EditarAgendamento /></ProtectedRoute> },
    { path: "/dashboard/pacientes", element: <ProtectedRoute><Pacientes /></ProtectedRoute> },
    { path: "/dashboard/pacientes/editar/:id", element: <ProtectedRoute><EditarPaciente /></ProtectedRoute> },
    { path: "/dashboard/pacientes/adicionar", element: <ProtectedRoute><AdicionarPaciente /></ProtectedRoute> },
    { path: "/dashboard/administracao", element: <ProtectedRoute><Administracao /></ProtectedRoute> },
    { path: "/dashboard/psicologos", element: <ProtectedRoute><Psicologos /></ProtectedRoute> },
    { path: "/dashboard/psicologos/adicionar", element: <ProtectedRoute><AdicionarPsicologo /></ProtectedRoute> },
    { path: "/dashboard/psicologos/editar/:id", element: <ProtectedRoute><EditarPsicologo /></ProtectedRoute> },
    { path: "*", element: <NotFound /> }
]);
