export const maskTelefone = (texto) => {
    const nums = texto.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
}

export const maskData = (texto) => {
    const nums = texto.replace(/\D/g, '').slice(0, 8);
    if (nums.length <= 2) return nums;
    if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
    return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
}

export const maskApenasNumeros = (texto) => texto.replace(/\D/g, '');

export const mascaras = {
  telefone: maskTelefone,
  data: maskData,
  apenasNumeros: maskApenasNumeros,
};