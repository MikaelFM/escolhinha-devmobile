export type MesAtual = {
  mes: number;
  ano: number;
};

export type MesReferencia = {
  key: string;
  mes: number;
  ano: number;
  label: string;
};

export const normalizarTexto = (valor: unknown): string => {
  if (valor === null || valor === undefined) {
    return '';
  }

  return String(valor);
};

export const formatarDataBR = (
  valor?: string | Date | null,
  fallback = 'N/A'
): string => {
  if (!valor) {
    return fallback;
  }

  const data = valor instanceof Date ? valor : new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return fallback;
  }

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
};

export const formatarMesAno = (
  ano?: string | number | null,
  mes?: string | number | null,
  fallback = 'N/A'
): string => {
  if (!ano || !mes) {
    return fallback;
  }

  const data = new Date(Number(ano), Number(mes) - 1, 1);

  if (Number.isNaN(data.getTime())) {
    return fallback;
  }

  const texto = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(data);

  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const formatarMoedaBR = (valor?: string | number | null): string => {
  const numero = Number(String(valor ?? 0).replace(',', '.'));
  const seguro = Number.isFinite(numero) ? numero : 0;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(seguro);
};

export const obterChaveMes = (mes: number, ano: number): string => {
  return `${ano}-${String(mes).padStart(2, '0')}`;
};

export const obterMesAtual = (): MesAtual => {
  const hoje = new Date();

  return {
    mes: hoje.getMonth() + 1,
    ano: hoje.getFullYear(),
  };
};

export const parseDataISO = (valor?: string | null): Date | null => {
  if (!valor) {
    return null;
  }

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
};

export const construirMesesPeriodo = (
  inicio: Date | null,
  fim: Date | null,
  mesBase: MesAtual
): MesReferencia[] => {
  if (!inicio && !fim) {
    return [
      {
        key: obterChaveMes(mesBase.mes, mesBase.ano),
        mes: mesBase.mes,
        ano: mesBase.ano,
        label: formatarMesAno(mesBase.ano, mesBase.mes, ''),
      },
    ];
  }

  const baseInicio = inicio || fim || new Date();
  const baseFim = fim || inicio || new Date();

  const dataInicio = new Date(baseInicio.getFullYear(), baseInicio.getMonth(), 1);
  const dataFim = new Date(baseFim.getFullYear(), baseFim.getMonth(), 1);

  if (dataInicio.getTime() > dataFim.getTime()) {
    return [];
  }

  const meses: MesReferencia[] = [];
  const cursor = new Date(dataInicio);

  while (cursor.getTime() <= dataFim.getTime()) {
    const mes = cursor.getMonth() + 1;
    const ano = cursor.getFullYear();

    meses.push({
      key: obterChaveMes(mes, ano),
      mes,
      ano,
      label: formatarMesAno(ano, mes, ''),
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return meses;
};
