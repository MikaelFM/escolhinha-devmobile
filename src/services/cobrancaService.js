import api from './api';

export const cobrancaService = {
  /**
   * Gerar cobrança via PIX
   */
  gerarCobrancaPix: async (id_mensalidade) => {
    return api.post('/gerar_cobranca_pix', { id_mensalidade });
  },
};