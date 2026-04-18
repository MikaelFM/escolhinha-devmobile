import api from './api';

export const alunosService = {
  /**
   * Cadastrar aluno
   */
  cadastrarAluno: async (params = {}) => {
    return api.post('/cria_aluno', params);
  },
  /**
   * Listar todos os alunos
   * @param {object} params - Query params da rota /get_alunos
   */
  listarAlunos: async (params = {}) => {
    return api.get('/get_alunos', { params });
  },

  /**
   * Buscar aluno por RG
   */
  getAlunoRg: async (rg) => {
    return api.get(`/get_aluno_rg/${rg}`);
  },

  /**
   * Atualizar aluno
   */
  atualizarAluno: async (rg, params = {}) => {
    return api.put(`/atualiza_dados_aluno/${rg}`, params);
  },

  /**
   * Deletar aluno
   */
  deletarAluno: async (rg) => {
    return api.delete(`/deleta_aluno/${rg}`);
  },
};
