import api from './api';

export const responsavelService = {
  /**
   * Buscar responsavel por CPF
   */
  getResponsavelCPF: async (cpf) => {
    return api.get(`/get_responsavel_cpf/${cpf}`);
  },
};
