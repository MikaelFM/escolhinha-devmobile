import api from './api';

export const ajustesService = {
  /**
   * Consultar ajustes atuais do sistema
   */
  consultarAjustes: async () => {
    return api.get('/consulta_ajustes');
  },

  /**
   * Salvar ajustes do sistema
   */
  inserirAjustes: async (params) => {
    return api.post('/insere_ajustes', params);
  },
};