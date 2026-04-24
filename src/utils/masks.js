export const maskCPF = (texto) => {
    const nums = texto.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
};

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

export const maskRG = (texto) => texto.replace(/\D/g, '').slice(0, 10);

export const mascaras = {
  telefone: maskTelefone,
  data: maskData,
    rg: maskRG,
  apenasNumeros: maskApenasNumeros,
};