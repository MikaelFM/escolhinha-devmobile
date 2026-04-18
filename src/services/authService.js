/**
 * Serviço de Autenticação
 */
import api from './api';
import { tokenService } from './tokenService';
import * as Notifications from 'expo-notifications';


export const authService = {
  /**
   * Login
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    try {
      let expoToken = null;

      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus === 'granted') {
          expoToken = (await Notifications.getExpoPushTokenAsync()).data;
        }
      } catch (notificationError) {
        console.log('Falha ao obter token de push no login:', notificationError);
      }

      const resposta = await api.post('/login', {
        email,
        password,
        expoToken
      });

      if (resposta.token) {
        console.log('Salvando token...')
        await tokenService.salvarToken(
          resposta.token,
          resposta.user || null
        );
      }

      return resposta;
    } catch (erro) {
      throw erro;
    }
  },

  /**
   * Registrar novo usuário
   */
  register: async (dados) => {
    try {
      const resposta = await api.post('/auth/register', dados);

      if (resposta.token) {
        await tokenService.salvarToken(
          resposta.token,
          resposta.user || null
        );
      }

      return resposta;
    } catch (erro) {
      throw erro;
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      try {
        await api.post('/auth/logout');
      } catch (erro) {
        console.warn('Erro ao notificar logout no servidor:', erro);
      }

      await tokenService.logout();
      return true;
    } catch (erro) {
      throw erro;
    }
  },

  /**
   * Verificar sessão e dados do usuário
   */
  verificarSessao: async () => {
    try {
      const resposta = await api.get('/auth/me');
      
      if (resposta) {
        const token = await tokenService.obterToken();
        if (token) {
          await tokenService.salvarToken(token, resposta);
        }
      }

      return resposta;
    } catch (erro) {
      throw erro;
    }
  },

  /**
   * Recuperar senha
   */
  esqueceuSenha: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Resetar senha
   */
  resetarSenha: async (token, novaSenha) => {
    return api.post('/auth/reset-password', { token, novaSenha });
  },

  /**
   * Atualizar senha do usuário logado
   */
  atualizarSenha: async (id, senhaAtual, senhaNova) => {
    return api.post('/atualizar_senha', {
      id,
      senhaAtual,
      senhaNova
    });
  },
};
