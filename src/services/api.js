import axios from 'axios';
import { tokenService } from './tokenService';

const BASE_URL = 'http://192.168.0.106:5000/' //'https://api-projeto-mobile-1.onrender.com/';

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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

    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = error.response.data?.message || 'Requisição inválida';
          break;
        case 401:
          message = 'Sessão expirada. Faça login novamente';
          await tokenService.limparToken();
          if (typeof onUnauthorized === 'function') {
            onUnauthorized();
          }
          break;
        case 403:
          message = 'Acesso negado';
          break;
        case 404:
          message = 'Recurso não encontrado';
          break;
        case 500:
          message = 'Erro no servidor';
          break;
        default:
          message = error.response.data?.message || 'Erro desconhecido';
      }
    } else if (error.request) {
      message = 'Sem conexão com o servidor';
    }

    console.log('API Error:', {
      message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

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
