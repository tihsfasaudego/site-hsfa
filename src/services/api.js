import axios from 'axios'

// Configuração base da API
// Em desenvolvimento: Vite proxy redireciona /api para http://localhost:3000
// Em produção: usa URL relativa para o mesmo servidor Node.js
// IMPORTANTE: Em desenvolvimento, não usar baseURL para evitar duplicação com o proxy do Vite
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? '' : (import.meta.env.VITE_API_URL || '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Serviços de API
export const examesService = {
  getAll: () => api.get('/exames.php'),
  getById: (id) => api.get(`/exames.php?id=${id}`),
}

export const cirurgiasService = {
  getAll: () => api.get('/cirurgias.php'),
  getById: (id) => api.get(`/cirurgias.php?id=${id}`),
}

export const editaisService = {
  getAll: () => api.get('/editais.php'),
}

export const contatoService = {
  // Usando novos endpoints Node.js
  // Em desenvolvimento: Vite proxy redireciona /api para http://localhost:3000
  // Em produção: URL relativa funciona diretamente
  send: (data) => api.post('/api/contato', data),
  sendPesquisa: (data) => api.post('/api/pesquisa', data),
}

export default api

