import React, { useState } from 'react';
import ModalCadastrarRelatorio from '../dashboard/components/ModalCadastrarRelatorio/ModalCadastrarRelatorio';
import { FaFileAlt } from 'react-icons/fa';

const ModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatorios, setRelatorios] = useState([
    {
      id: 1,
      agendamentoId: 123,
      conteudo: 'Paciente chegou no horário. Sessão produtiva com exercícios de respiração e técnicas de relaxamento. Paciente demonstrou melhora significativa nos sintomas de ansiedade.',
      dateCreated: '2024-01-15T10:30:00.000Z'
    },
    {
      id: 2,
      agendamentoId: 123,
      conteudo: 'Segunda sessão focada em técnicas cognitivo-comportamentais. Paciente relatou redução dos episódios de ansiedade durante a semana.',
      dateCreated: '2024-01-22T10:30:00.000Z',
      lastModified: '2024-01-22T11:15:00.000Z'
    }
  ]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleReportSaved = (report) => {
    const updatedReports = [...relatorios];
    const existingIndex = updatedReports.findIndex(r => r.id === report.id);
    
    if (existingIndex >= 0) {
      updatedReports[existingIndex] = report;
    } else {
      updatedReports.push(report);
    }
    
    setRelatorios(updatedReports);
  };

  const handleReportDeleted = (reportId) => {
    const updatedReports = relatorios.filter(r => r.id !== reportId);
    setRelatorios(updatedReports);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#1B66A4', marginBottom: '1rem' }}>
          Demonstração - Modal de Gerenciamento de Relatórios
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Informações da Sessão (Simulado)</h2>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <p><strong>Paciente:</strong> João Silva</p>
            <p><strong>Data:</strong> 15/01/2024</p>
            <p><strong>Horário:</strong> 10:30</p>
            <p><strong>Status:</strong> <span style={{ 
              color: 'white', 
              background: '#28a745', 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}>CONCLUIDA</span></p>
            <p><strong>Relatórios:</strong> <span style={{ 
              color: 'white', 
              background: relatorios.length > 0 ? '#28a745' : '#ffc107', 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}>
              {relatorios.length > 0 ? `${relatorios.length} Disponível(is)` : 'Não disponível'}
            </span></p>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          style={{
            background: '#1B66A4',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#1559a3'}
          onMouseOut={(e) => e.target.style.background = '#1B66A4'}
        >
          <FaFileAlt />
          Gerenciar Relatórios
        </button>

        <div style={{ marginTop: '2rem', color: '#666' }}>
          <h3>Funcionalidades Demonstradas:</h3>
          <ul>
            <li>✅ Criar novos relatórios com validação</li>
            <li>✅ Editar relatórios existentes</li>
            <li>✅ Excluir relatórios com confirmação personalizada</li>
            <li>✅ Lista scrollável para relatórios extensos</li>
            <li>✅ Design responsivo e acessível</li>
            <li>✅ Integração com sistema de alertas SweetAlert2</li>
            <li>✅ Indicadores de status de relatórios</li>
          </ul>
        </div>
      </div>

      <ModalCadastrarRelatorio
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        agendamentoId={123}
        existingReports={relatorios}
        onReportSaved={handleReportSaved}
        onReportDeleted={handleReportDeleted}
      />
    </div>
  );
};

export default ModalDemo;