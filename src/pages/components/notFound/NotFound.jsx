// import Botao from "../../../components/botoes/BotaoComponent";
import './notFound.css'

const NotFound = () => {

    return (
        <>
            <div className="container_notFound">
                <h1 className="title">404</h1>
                <p className="message">Página não encontrada</p>
                <button onClick={() => window.history.back()}>Voltar</button>
            </div>
        </>
    );
};

export default NotFound;