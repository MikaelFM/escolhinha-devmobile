import api from './api';

export const mensalidadesService = {
  /**
   * Listar mensalidades do aluno por RG
   */
  getMensalidadesAluno: async (rgAluno) => {
    return api.get(`/get_mensalidades_aluno/${rgAluno}`);
  },

  /**
   * Atualizar status de pagamento de uma mensalidade
   */
  setMensalidadePago: async (params = {}) => {
    return api.patch('/set_mensalidade_pago', params);
  },
};