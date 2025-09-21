import React, { useState, useEffect } from 'react';
import './Modal.css';
import { errorMessage, responseMessage, confirmCancelEdit } from '../../../../utils/alert';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const ModalCadastrarRelatorio = ({ 
  isOpen, 
  onClose, 
  agendamentoId, 
  existingReports = [], 
  onReportSaved,
  onReportDeleted 
}) => {
  const [relatorios, setRelatorios] = useState(existingReports);
  const [novoRelatorio, setNovoRelatorio] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    setRelatorios(existingReports);
  }, [existingReports]);

  const handleCreateReport = async () => {
    if (!novoRelatorio.trim()) {
      errorMessage('O conteúdo do relatório não pode estar vazio.');
      return;
    }

    try {
      // Simulate API call - in real implementation, this would call a backend API
      const newReport = {
        id: Date.now(), // Temporary ID generation
        agendamentoId: agendamentoId,
        conteudo: novoRelatorio.trim(),
        dataVencimento: new Date().toISOString(),
        dateCreated: new Date().toISOString()
      };

      setRelatorios([...relatorios, newReport]);
      setNovoRelatorio('');
      setShowCreateForm(false);
      responseMessage('Relatório criado com sucesso!');
      
      if (onReportSaved) {
        onReportSaved(newReport);
      }
    } catch (error) {
      errorMessage('Erro ao criar relatório.');
      console.error('Erro ao criar relatório:', error);
    }
  };

  const handleEditReport = (id, content) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const handleSaveEdit = async () => {
    if (!editingContent.trim()) {
      errorMessage('O conteúdo do relatório não pode estar vazio.');
      return;
    }

    try {
      // Simulate API call - in real implementation, this would call a backend API
      const updatedReports = relatorios.map(report => 
        report.id === editingId 
          ? { ...report, conteudo: editingContent.trim(), lastModified: new Date().toISOString() }
          : report
      );

      setRelatorios(updatedReports);
      setEditingId(null);
      setEditingContent('');
      responseMessage('Relatório atualizado com sucesso!');
      
      if (onReportSaved) {
        const updatedReport = updatedReports.find(r => r.id === editingId);
        onReportSaved(updatedReport);
      }
    } catch (error) {
      errorMessage('Erro ao atualizar relatório.');
      console.error('Erro ao atualizar relatório:', error);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      // Use custom confirmation dialog from alert utils
      const result = await confirmCancelEdit(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.',
        'medium'
      );

      if (result.isConfirmed) {
        // Simulate API call - in real implementation, this would call a backend API
        const updatedReports = relatorios.filter(report => report.id !== id);
        setRelatorios(updatedReports);
        responseMessage('Relatório excluído com sucesso!');
        
        if (onReportDeleted) {
          onReportDeleted(id);
        }
      }
    } catch (error) {
      errorMessage('Erro ao excluir relatório.');
      console.error('Erro ao excluir relatório:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Gerenciar Relatórios</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          {/* Create New Report Section */}
          <div className="create-report-section">
            {!showCreateForm ? (
              <button 
                className="btn_primario"
                onClick={() => setShowCreateForm(true)}
              >
                Novo Relatório
              </button>
            ) : (
              <div className="create-form">
                <textarea
                  className="report-textarea"
                  placeholder="Digite o conteúdo do relatório..."
                  value={novoRelatorio}
                  onChange={(e) => setNovoRelatorio(e.target.value)}
                  rows={4}
                />
                <div className="form-actions">
                  <button 
                    className="btn_primario"
                    onClick={handleCreateReport}
                  >
                    <FaSave /> Salvar
                  </button>
                  <button 
                    className="btn_secundario"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNovoRelatorio('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing Reports Section */}
          <div className="reports-list-container">
            <h3>Relatórios Existentes</h3>
            {relatorios.length === 0 ? (
              <p className="no-reports">Nenhum relatório encontrado.</p>
            ) : (
              <div className="reports-scrollable">
                {relatorios.map((relatorio) => (
                  <div key={relatorio.id} className="report-card">
                    {editingId === relatorio.id ? (
                      <div className="edit-form">
                        <textarea
                          className="report-textarea"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={4}
                        />
                        <div className="form-actions">
                          <button 
                            className="btn_primario"
                            onClick={handleSaveEdit}
                          >
                            <FaSave /> Salvar Alterações
                          </button>
                          <button 
                            className="btn_secundario"
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="report-content">
                          <p>{relatorio.conteudo}</p>
                          <small className="report-date">
                            Criado em: {new Date(relatorio.dateCreated).toLocaleDateString('pt-BR')}
                            {relatorio.lastModified && (
                              <span> (Modificado em: {new Date(relatorio.lastModified).toLocaleDateString('pt-BR')})</span>
                            )}
                          </small>
                        </div>
                        <div className="report-actions">
                          <button 
                            className="btn_editar"
                            onClick={() => handleEditReport(relatorio.id, relatorio.conteudo)}
                            title="Editar relatório"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn_deletar"
                            onClick={() => handleDeleteReport(relatorio.id)}
                            title="Excluir relatório"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCadastrarRelatorio;