/**
 * Serviço de Autenticação
 */
import api from './api';
import { tokenService } from './tokenService';
import * as Notifications from 'expo-notifications';

const obterExpoPushToken = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      return (await Notifications.getExpoPushTokenAsync()).data;
    }

    return null;
  } catch (notificationError) {
    return null;
  }
};

const obterTokenBiometriaDaResposta = (resposta) => {
  return (
    resposta?.tokenBiometria ||
    resposta?.token_biometria ||
    resposta?.biometriaToken ||
    null
  );
};

const extrairIdUsuario = (dadosUsuario) => {
  if (!dadosUsuario || typeof dadosUsuario !== 'object') {
    return null;
  }

  return (
    dadosUsuario.idUsuario ??
    dadosUsuario.id_usuario ??
    dadosUsuario.usuarioId ??
    dadosUsuario.userId ??
    dadosUsuario.id ??
    null
  );
};

const obterIdUsuarioLogado = async (dadosUsuarioAtual = null) => {
  const idDoParametro = extrairIdUsuario(dadosUsuarioAtual);
  if (idDoParametro !== null && idDoParametro !== undefined && String(idDoParametro).trim() !== '') {
    return idDoParametro;
  }

  const dadosSalvos = await tokenService.obterDadosUsuario();
  const idSalvo = extrairIdUsuario(dadosSalvos);

  if (idSalvo !== null && idSalvo !== undefined && String(idSalvo).trim() !== '') {
    return idSalvo;
  }

  return null;
};

export const authService = {
  ativarLoginBiometria: async (dadosUsuarioAtual = null) => {
    const deviceId = (await tokenService.obterOuCriarDeviceId())?.trim?.() || '';
    if (!deviceId) {
      throw { message: 'deviceId inválido para ativação biométrica.' };
    }

    const idUsuario = await obterIdUsuarioLogado(dadosUsuarioAtual);
    if (idUsuario === null || idUsuario === undefined || String(idUsuario).trim() === '') {
      throw { message: 'Não foi possível identificar idUsuario para ativação biométrica.' };
    }

    const expoToken = await obterExpoPushToken();
    const payload = {
      idUsuario,
      deviceId,
    };

    if (expoToken) {
      payload.expoToken = expoToken;
    }

    const ativacaoBiometria = await api.post('/ativar_login_biometria', payload);

    const tokenBiometria = obterTokenBiometriaDaResposta(ativacaoBiometria);
    if (tokenBiometria) {
      await tokenService.salvarTokenBiometria(tokenBiometria);
    }

    return {
      sucesso: !!tokenBiometria,
      tokenBiometria,
    };
  },

  /**
   * Login
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    try {
      const expoToken = await obterExpoPushToken();

      const resposta = await api.post('/login', {
        email,
        password,
        expoToken
      });

      if (resposta.token) {
        await tokenService.salvarToken(
          resposta.token,
          resposta.user || null
        );

        try {
          await authService.ativarLoginBiometria(resposta.user || null);
        } catch (erroBiometria) {
        }
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
    await tokenService.logout();
    return true;
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
   * Buscar dados do usuário para dashboards
   */
  getDadosUsuario: async () => {
    const resposta = await api.get('/get_dados_usuario');
    return resposta?.usuario ?? resposta?.data?.usuario ?? resposta;
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

  loginBiometria: async () => {
    try {
      const tokenBiometria = await tokenService.obterTokenBiometria();
      if (!tokenBiometria) {
        throw { message: 'Biometria não ativada para este dispositivo.' };
      }

      const deviceId = await tokenService.obterOuCriarDeviceId();
      const expoToken = await obterExpoPushToken();
      const idUsuario = await obterIdUsuarioLogado();

      const payload = {
        tokenBiometria,
        deviceId,
      };

      if (idUsuario !== null && idUsuario !== undefined && String(idUsuario).trim() !== '') {
        payload.idUsuario = idUsuario;
      }

      if (expoToken) {
        payload.expoToken = expoToken;
      }

      const resposta = await api.post('/login_biometria', payload);

      if (resposta.token) {
        await tokenService.salvarToken(
          resposta.token,
          resposta.user || null
        );
      }

      const novoTokenBiometria = obterTokenBiometriaDaResposta(resposta);
      if (novoTokenBiometria) {
        await tokenService.salvarTokenBiometria(novoTokenBiometria);
      }

      return resposta;
    } catch (erro) {
      throw erro;
    }
  },
};
