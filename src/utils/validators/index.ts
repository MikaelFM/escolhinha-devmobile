export const validaObrigatorio = (valor: string, mensagem = 'Campo obrigatório.'): string => valor.trim() ? '' : mensagem;
export const validaEmail = (valor: string): string => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? '' : 'E-mail inválido.';
export const validaMinimoCaracteres = (valor: string, minimo = 6): string => valor.length >= minimo ? '' : `Mínimo ${minimo} caracteres.`;
export const validaTelefone =  (valor: string): string => valor.replace(/\D/g, '').length >= 10 ? '' : 'Telefone inválido.';
export const validaData = (valor: string): string => valor.replace(/\D/g, '').length >= 8 ? '' : 'Data inválida.';
export const validaCPF = (cpf: string): string => {
  const limpo = cpf.replace(/\D/g, '');

  if (!limpo) return 'CPF é obrigatório.';
  if (limpo.length !== 11) return 'CPF deve ter 11 dígitos.';
  
  if (/^(\d)\1+$/.test(limpo)) return 'CPF inválido.';

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) 
    soma = soma + parseInt(limpo.substring(i - 1, i)) * (11 - i);
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.substring(9, 10))) return 'CPF inválido.';

  soma = 0;
  for (let i = 1; i <= 10; i++) 
    soma = soma + parseInt(limpo.substring(i - 1, i)) * (12 - i);
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.substring(10, 11))) return 'CPF inválido.';

  return '';
};