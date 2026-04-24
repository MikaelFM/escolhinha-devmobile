export const validaObrigatorio = (valor, mensagem = 'Campo obrigatório.') => valor.trim() ? '' : mensagem;

export const validaEmail = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? '' : 'E-mail inválido.';

export const validaMinimoCaracteres = (valor, minimo = 6) => valor.length >= minimo ? '' : `Mínimo ${minimo} caracteres.`;

export const validaTelefone = (valor) => valor.replace(/\D/g, '').length >= 10 ? '' : 'Telefone inválido.';

export const validaData = (valor) => {
  const texto = String(valor || '').trim();
  const match = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return 'Data inválida.';

  const dia = Number(match[1]);
  const mes = Number(match[2]);
  const ano = Number(match[3]);
  const data = new Date(ano, mes - 1, dia);

  const dataValida =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  if (!dataValida) return 'Data inválida.';

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);

  if (data > hoje) return 'Data não pode ser futura.';

  return '';
};

export const validaCPF = (valor) => {
  const cpf = valor.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return 'CPF inválido.';
  const calc = (mod) => {
    let soma = 0;
    for (let i = 0; i < mod - 1; i++) soma += Number(cpf[i]) * (mod - i);
    const resto = (soma * 10) % 11;
    return resto >= 10 ? 0 : resto;
  };
  return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]) ? '' : 'CPF inválido.';
};

export const validadores = {
  obrigatorio: validaObrigatorio,
  email: validaEmail,
  senha: validaMinimoCaracteres,
  telefone: validaTelefone,
  data: validaData,
};