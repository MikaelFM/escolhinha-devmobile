import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = '@devmobile_auth_token';
const USER_DATA_KEY = '@devmobile_user_data';
const BIOMETRIA_TOKEN_KEY = '@devmobile_biometria_token';
const DEVICE_ID_KEY = '@devmobile_device_id';
const BIOMETRIA_PREF_KEY = '@devmobile_biometria_pref';

export const tokenService = {

  salvarToken: async (token, userData = null) => {
  try {
    const updates = [[TOKEN_KEY, String(token)]];
    
    if (userData) {
      updates.push([USER_DATA_KEY, JSON.stringify(userData)]);
    }
    
    await AsyncStorage.multiSet(updates);

    return true;
  } catch (erro) {
    return false;
  }
},


  obterToken: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (erro) {
      return null;
    }
  },


  obterDadosUsuario: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (erro) {
      return null;
    }
  },


  temToken: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (erro) {
      return false;
    }
  },

  limparToken: async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_DATA_KEY]);
      return true;
    } catch (erro) {
      return false;
    }
  },

  salvarTokenBiometria: async (tokenBiometria) => {
    try {
      if (!tokenBiometria) {
        return false;
      }

      await AsyncStorage.setItem(BIOMETRIA_TOKEN_KEY, String(tokenBiometria));
      return true;
    } catch (erro) {
      return false;
    }
  },

  obterTokenBiometria: async () => {
    try {
      return await AsyncStorage.getItem(BIOMETRIA_TOKEN_KEY);
    } catch (erro) {
      return null;
    }
  },

  temBiometriaAtiva: async () => {
    try {
      const tokenBiometria = await AsyncStorage.getItem(BIOMETRIA_TOKEN_KEY);
      return !!tokenBiometria;
    } catch (erro) {
      return false;
    }
  },

  salvarPreferenciaBiometria: async (ativa) => {
    try {
      await AsyncStorage.setItem(BIOMETRIA_PREF_KEY, ativa ? '1' : '0');
      return true;
    } catch (erro) {
      return false;
    }
  },

  obterPreferenciaBiometria: async () => {
    try {
      const valor = await AsyncStorage.getItem(BIOMETRIA_PREF_KEY);
      if (valor === null) {
        return true;
      }

      return valor === '1';
    } catch (erro) {
      return true;
    }
  },

  limparBiometria: async () => {
    try {
      await AsyncStorage.removeItem(BIOMETRIA_TOKEN_KEY);
      return true;
    } catch (erro) {
      return false;
    }
  },

  obterOuCriarDeviceId: async () => {
    try {
      const deviceIdSalvo = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (deviceIdSalvo) {
        return deviceIdSalvo;
      }

      const novoDeviceId = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      await AsyncStorage.setItem(DEVICE_ID_KEY, novoDeviceId);
      return novoDeviceId;
    } catch (erro) {
      return `${Platform.OS}-fallback`;
    }
  },

  logout: async (navigation = null) => {
    try {
      await tokenService.limparToken();
      
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
      }
      
      return true;
    } catch (erro) {
      return false;
    }
  },
};
