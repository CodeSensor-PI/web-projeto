// Função para ajustar data para o formato PT-BR (dd/mm/aaaa)
export function ajustarDataParaPTBR(data) {
  if (!data) return '';
  // Aceita Date, string ISO ou string yyyy-mm-dd
  let dateObj;
  if (data instanceof Date) {
    dateObj = data;
  } else if (typeof data === 'string') {
    // Tenta converter string para Date
    if (data.includes('T')) {
      dateObj = new Date(data);
    } else if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // yyyy-mm-dd
      const [ano, mes, dia] = data.split('-');
      dateObj = new Date(ano, mes - 1, dia);
    } else {
      return data; // formato desconhecido, retorna como está
    }
  } else {
    return '';
  }
  const dia = String(dateObj.getDate()).padStart(2, '0');
  const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
  const ano = dateObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
