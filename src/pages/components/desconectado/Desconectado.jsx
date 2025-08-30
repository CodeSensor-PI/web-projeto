import './desconectado.css'
import LogoBlue from '../../../assets/images/logoBlue.svg'
import { useEffect } from 'react'

const Desconectado = () => {

    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <div className='desconectado'>
            <img src={LogoBlue} alt="Logo" />
            <div className='mensagem'>
                Você foi desconectado(a).
                <a href="/login">Clique aqui para fazer login novamente.</a>
            </div>
        </div>
    )
}

export default Desconectado