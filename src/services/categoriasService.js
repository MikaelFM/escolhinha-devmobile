import api from './api';

export const categoriasService = {
  /**
   * Listar todas as categorias
   */
  listarCategorias: async () => {
    return api.get('/get_categorias');
  },
};
