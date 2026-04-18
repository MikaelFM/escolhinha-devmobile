import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@devmobile_auth_token';
const USER_DATA_KEY = '@devmobile_user_data';

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
    console.log('Erro ao salvar token:', erro);
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
