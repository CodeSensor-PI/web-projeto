import React from 'react'
import MissaoImg from '../../../assets/images/essencia/missao_img.svg'
import ValoresImg from '../../../assets/images/essencia/valores_img.svg'
import VisaoImg from '../../../assets/images/essencia/visao_img.svg'
import './nossaEssencia.css'


const NossaEssenciaComponent = () => {
    return (
        <section className="section-nossa-essencia flex flex-col justify-between items-center p-12 md:p-40" id="essencia">
            <h1 className="titulo-section">NOSSA ESSÊNCIA</h1>
            <h3 className="subtitulo-section">MISSÃO, VISÃO E VALORES</h3>
            <div className="boxes flex flex-col md:flex-row gap-8 mt-8">
                <div className="box-content ">
                    <img src={MissaoImg} className="w-24" alt="" />
                    <h3 className="mt-4 text-lg font-bold">Missão</h3>
                    <p className="mt-2 text-sm">Facilitar e otimizar o gerenciamento de agendamentos por meio de tecnologia inovadora, proporcionando eficiência e organização.</p>
                </div>
                <div className="box-content">
                    <img src={VisaoImg} className="w-24" alt="" />
                    <h3 className="mt-4 text-lg font-bold">Visão</h3>
                    <p className="mt-2 text-sm">Ser a principal referência em soluções tecnológicas para agendamentos, revolucionando a experiência entre empresas e clientes.</p>
                </div>
                <div className="box-content">
                    <img src={ValoresImg} className="w-24" alt="" />
                    <h3 className="mt-4 text-lg font-bold">Valores</h3>
                    <p className="mt-2 text-sm">Prezamos pela segurança, protegendo os dados, garantindo processos simples e ágeis. e oferecendo um serviço confiável.</p>
                </div>
            </div>
            <button id="btn_primario" className="bg-lightBlueFy border-2 border-lightBlueFy text-white p-4 font-medium text-sm transition duration-300 ease-in-out hover:bg-darkestBlueFy mt-8">Entre em contato</button>
        </section>
    )
}

export default NossaEssenciaComponent