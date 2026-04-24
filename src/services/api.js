import axios from 'axios';
import { tokenService } from './tokenService';

import { API_CONFIG } from '../constants'; // Importa o objeto completo

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};


const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async (config) => {
    try {
      const token = await tokenService.obterToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return {
      status: response.status,
      ...response.data
    };
  },
  async (error) => {
    let message = 'Erro ao conectar com o servidor';

    console.log('error', error.response.data.mensagem);

    if (error.response) {
      const serverMessage = error.response.data?.mensagem || error.response.data?.erro || error.response.data?.error;

      switch (error.response.status) {
        case 400:
          message = serverMessage || 'Requisição inválida';
          break;
        case 401: {
          const tokenAtivo = await tokenService.obterToken();
          if (tokenAtivo) {
            message = serverMessage || 'Sessão expirada. Faça login novamente';
            await tokenService.limparToken();
            if (typeof onUnauthorized === 'function') {
              onUnauthorized();
            }
          } else {
            message = serverMessage || 'E-mail ou senha incorretos';
          }
          break;
        }
        case 403:
          message = serverMessage || 'Acesso negado';
          break;
        case 404:
          message = serverMessage || 'Recurso não encontrado';
          break;
        case 409:
          message = serverMessage || 'Conflito de dados';
          break;
        case 422:
          message = serverMessage || 'Dados inválidos';
          break;
        case 500:
          message = serverMessage || 'Erro no servidor';
          break;
        default:
          message = serverMessage || 'Erro desconhecido';
      }
    } else if (error.request) {
      message = 'Sem conexão com o servidor';
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      original: error,
    });
  }
);

export { tokenService };
export default api;
