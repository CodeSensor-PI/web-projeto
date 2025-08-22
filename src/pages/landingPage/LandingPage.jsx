import React from 'react'

import DivisaoComponent from './components/divisao/divisao'
import HeaderComponent from './header/HeaderComponent';
import HomeComponent from './home/HomeComponent'
import NossaEssenciaComponent from './nossa-essencia/NossaEssenciaComponent'
import SolucaoComponent from './solucao/SolucaoComponent';
import RecursosComponent from './recursos/RecursosComponent';
import ContatoComponent from './contato/ContatoComponent';
import { Link } from 'react-router-dom';	
import FooterComponent from './footer/FooterComponent';


const LandingPage = () => {
    return (
        <div>
            
            <HeaderComponent/>
            
            <HomeComponent/>

            <DivisaoComponent componenteSeguinte="solucao"/>

            <section id="solucao">
                <SolucaoComponent/>
            </section>

            <DivisaoComponent componenteSeguinte="nossa-essencia" cor="azul"/>

            <section id="nossa-essencia">
                <NossaEssenciaComponent/>
            </section>

            <DivisaoComponent componenteSeguinte="recursos"/>

            <section id="recursos">
                <RecursosComponent/>
            </section>

            <DivisaoComponent componenteSeguinte="contato" cor="azul-claro"/>

            <section id="contato">
                <ContatoComponent/>
            </section>

            <FooterComponent/>
        </div>
    )
}

export default LandingPage