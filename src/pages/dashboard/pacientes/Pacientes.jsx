import React from 'react';
import './pacientes.css';
import MenuLateralComponent from '../components/MenuLateral/MenuLateralComponent';
import { FaPen, FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MainComponent from '../components/MainComponent/MainComponent';
import { getPacientes, getPacientesLista } from '../../../provider/api/pacientes/fetchs-pacientes';
import CardPaciente from './components/CardPaciente/CardPaciente';
import Loading from '../components/Loading/Loading';



// Map global para requisições em andamento (compartilhado entre instâncias do componente)
const inFlightRequests = new Map();

const Pacientes = () => {
  const [pacientes, setPacientes] = React.useState([]);

  const [pacientesLista, setPacientesLista] = React.useState(pacientes);
  const [pesquisar, setPesquisar] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(12);
  const [totalPages, setTotalPages] = React.useState(null);
  const navigate = useNavigate();



  const carregarPagina = React.useCallback(async (p = page, s = size) => {
    setLoading(true);
    const key = `${p}-${s}`;

    try {
      // Se já existe uma requisição em andamento para a mesma chave, reutiliza a mesma promise
      if (inFlightRequests.has(key)) {
        const cachedPromise = inFlightRequests.get(key);
        const data = await cachedPromise;
        const lista = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
        const tp = Number.isFinite(data?.totalPages) ? data.totalPages : null;
        setTotalPages(tp);
        setPacientes(lista);
        setPacientesLista(lista);
        return;
      }

      const fetchPromise = (async () => {
        try {
          const data = await getPacientes(p, s);
          return data;
        } catch (err) {
          throw err;
        }
      })();

      inFlightRequests.set(key, fetchPromise);

      const data = await fetchPromise;

      const lista = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
      const tp = Number.isFinite(data?.totalPages) ? data.totalPages : null;
      setTotalPages(tp);
      setPacientes(lista);
      setPacientesLista(lista);
    } catch (error) {
      console.error("Erro ao encontrar pacientes:", error);
      setPacientes([]);
      setPacientesLista([]);
    } finally {
      // Limpa a chave do cache (caso tenha sido setada)
      try { inFlightRequests.delete(`${p}-${s}`); } catch (e) {}
      setTimeout(() => setLoading(false), 300);
    }
  }, [page, size]);

  React.useEffect(() => {
    // Recarrega a lista paginada quando página/tamanho mudam e não há pesquisa
    if (!pesquisar) {
      carregarPagina(page, size);
    }
  }, [page, size, pesquisar, carregarPagina]);

  const handleSearch = async (e) => {
    const pesquisa = e.target.value;
    setPesquisar(pesquisa);

    if (!pesquisa || !pesquisa.trim()) {
      // Limpa pesquisa: volta para a primeira página da listagem paginada
      setPage(1);
      await carregarPagina(1, size);
      return;
    }

    // Busca no servidor por nome (sem paginação)
    try {
      setLoading(true);
      const lista = await getPacientesLista(pesquisa.trim());
      const arr = Array.isArray(lista) ? lista : [];
      setPacientesLista(arr);
    } catch (err) {
      console.error('Erro na busca por nome:', err);
      setPacientesLista([]);
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  }

  const redirectToVisualizarPaciente = (id) => {
    navigate(`/dashboard/pacientes/editar/${id}`);
  };

  const redirectToCadastrarAgendamento = (id) => {
    navigate(`/dashboard/agendamentos/cadastrar/${id}`)
  };

  return (
    
    <div className='div-pacientes flex'>
      <MenuLateralComponent></MenuLateralComponent>
      {loading && <Loading />}
      <MainComponent
        title="Meus Pacientes"
        headerContent={
          <>
            <div className="search-container flex">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Pesquisar pacientes..."
                className="input-pesquisa"
                value={pesquisar}
                onChange={handleSearch}
              />
            </div>


            <button
              className='btn_agendamento flex rounded-full'
              onClick={(e) => {
                e.preventDefault();
                navigate(`/dashboard/pacientes/adicionar`);
              }}
            >
              <FaPlus className='icon' />
              Adicionar Paciente
            </button>
          </>
        }
      >
        
          <div className='pacientes-background'>
            <div className='pacientes-container'>
              {pacientesLista.map((paciente) => (
                <CardPaciente
                  key={paciente.id}
                  paciente={paciente}
                  onVisualizar={redirectToVisualizarPaciente}
                  onAgendar={redirectToCadastrarAgendamento}
                />
              ))}
            </div>
            {!pesquisar && (
              <div className="flex flex-col items-center justify-center gap-3 mt-auto pt-4 w-full">
                <div className="flex items-center justify-center gap-4">
                  <button
                    className='btn_secundario rounded-full'
                    type='button'
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Anterior
                  </button>
                  <div>
                    Página {page}{totalPages ? ` de ${totalPages}` : ''}
                  </div>
                  <button
                    className='btn_secundario rounded-full'
                    type='button'
                    onClick={() => setPage((p) => p + 1)}
                    disabled={totalPages ? page >= totalPages : (pacientesLista.length < size)}
                  >
                    Próxima
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="page-size" style={{ whiteSpace: 'nowrap' }}>Itens por página:</label>
                  <select
                    id="page-size"
                    className="input-pesquisa-select"
                    value={size}
                    onChange={(e) => { setPage(1); setSize(Number(e.target.value) || 12); }}
                  >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={18}>18</option>
                    <option value={36}>36</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        
      </MainComponent>
    </div>
  );
};

export default Pacientes;