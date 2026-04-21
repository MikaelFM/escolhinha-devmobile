import api from './api';

export const mensalidadesService = {
  /**
   * Listar mensalidades por mês e ano
   */
  getMensalidades: async ({ mes, ano } = {}) => {
    return api.get('/get_mensalidades', {
      params: { mes, ano },
    });
  },

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