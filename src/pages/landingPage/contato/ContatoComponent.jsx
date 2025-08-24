import React from 'react'
import './contato.css'
import { useState } from 'react'
import { send } from '@emailjs/browser'
import { responseMessage } from "../../../utils/alert.js"; // Importa a função de sucesso
import { errorMessage } from "../../../utils/alert.js"; // Importa a função de erro
import Swal from "sweetalert2";

const ContatoComponent = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  function sendEmail(e) {
    e.preventDefault()

    if (!name || !email || !subject || !message) {
      errorMessage('Preencha todos os campos! ❌')
      return;
    }
    if (!email.includes('@')) {
      errorMessage('Email inválido! ❌')
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
    };

    send('service_ireolsm', 'template_upuv15g', templateParams, 'UGXHycF5j6jM9cSfi')

      .then((response) => {
        console.log('Email enviado com sucesso!', response.status, response.text)
        responseMessage('Email enviado com sucesso! ✔')
        setEmail('')
        setName('')
        setSubject('')
        setMessage('')
      }, (error) => {
        console.log('Erro ao enviar email', error)
        errorMessage('Erro ao enviar email! ❌')
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Erro ao enviar email!'
        })
      })


  }







  return (
    <div className='contato-section' id='contate'>
      <div className='header-contato'>
        <h1 className='titulo-section'>CONTATE-NOS</h1>
        <h3 className='subtitulo-section'>ENTRE EM CONTATO CONOSCO</h3>
      </div>
      <form className='contato-form' onSubmit={sendEmail}>
        <label htmlFor="Nome">Nome</label>
        <input
          type="text"
          placeholder='Nome'
          name='Nome'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <label htmlFor="Email">Email</label>
        <input
          type="email"
          placeholder='Email'
          name='Email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <label htmlFor="Assunto">Assunto</label>
        <input
          type="text"
          placeholder='Assunto'
          name='Assunto'
          onChange={(e) => setSubject(e.target.value)}
          value={subject}
        />

        <label htmlFor="Mensagem">Mensagem</label>
        <textarea
          placeholder='Mensagem'
          name='Mensagem'
          onChange={(e) => setMessage(e.target.value)}
          value={message}></textarea>
        <button type='submit' className='btn_primario flex justify-center text-center'>
          ENVIAR
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ContatoComponent