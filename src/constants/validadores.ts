export const validaObrigatorio = (valor: string, mensagem = 'Campo obrigatório.'): string => valor.trim() ? '' : mensagem;
export const validaEmail = (valor: string): string => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? '' : 'E-mail inválido.';
export const validaMinimoCaracteres = (valor: string, minimo = 6): string => valor.length >= minimo ? '' : `Mínimo ${minimo} caracteres.`;
export const validaTelefone =  (valor: string): string => valor.replace(/\D/g, '').length >= 10 ? '' : 'Telefone inválido.';
export const validaData = (valor: string): string => valor.replace(/\D/g, '').length >= 8 ? '' : 'Data inválida.';

export const validadores = {
  obrigatorio: validaObrigatorio,
  email: validaEmail,
  senha: validaMinimoCaracteres,
  telefone: validaTelefone,
  data: validaData,
};