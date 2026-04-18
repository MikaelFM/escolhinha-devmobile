import api from './api';

export const presencaService = {
  /**
   * Listar todas as datas com presenças registradas
   */
  listarDatasPresenca: async () => {
    return api.get('/datas_lancadas');
  },

  /**
   * Listar presença por data e categoria
   */
  getListaPresenca: async (data, id_categoria) => {
    return api.get('/get_lista_presenca', {
      params: { data, id_categoria },
    });
  },

  /**
   * Listar histórico de presenças por RG do aluno
   */
  getListaPresencaPorRg: async (rg) => {
    return api.get(`/get_lista_presenca/${rg}`);
  },
  
  inserirPresenca: async (params) => {
    return api.post('/insere_presenca', params);
  },

  getHistoricoPresenca: async (rg_aluno) => {
    return api.get('/get_historico_presenca/' + rg_aluno);
  },
};
