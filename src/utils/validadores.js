export const validaObrigatorio = (valor, mensagem = 'Campo obrigatório.') => valor.trim() ? '' : mensagem;

export const validaEmail = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? '' : 'E-mail inválido.';

export const validaMinimoCaracteres = (valor, minimo = 6) => valor.length >= minimo ? '' : `Mínimo ${minimo} caracteres.`;

export const validaTelefone = (valor) => valor.replace(/\D/g, '').length >= 10 ? '' : 'Telefone inválido.';

export const validaData = (valor) => valor.replace(/\D/g, '').length >= 8 ? '' : 'Data inválida.';

export const validadores = {
  obrigatorio: validaObrigatorio,
  email: validaEmail,
  senha: validaMinimoCaracteres,
  telefone: validaTelefone,
  data: validaData,
};