export function signXml(xml, myTools) {
  const signedXml = myTools.xmlSign(xml);
  return signedXml;
}

export async function sendNfe(xml, myTools) {
  const response = await myTools.sefazEnviaLote(xml, { indSinc: 1 });
  return response;
}

export function gerarChaveNF(dados) {
  // Campos formatados com tamanho correto
  const ano = new Date().getFullYear().toString().slice(-2);
  const cUF = dados.cUF.toString().padStart(2, '0'); // 2 dígitos
  const AAMM = ano.toString().padStart(2, '0') + dados.mes.toString().padStart(2, '0'); // 4 dígitos
  const CNPJ = dados.CNPJ.toString().padStart(14, '0'); // 14 dígitos
  const mod = dados.modelo.toString().padStart(2, '0'); // 2 dígitos
  const serie = dados.serie.toString().padStart(3, '0'); // 3 dígitos
  const nNF = dados.nNF;
  const tpEmis = dados.tpEmis.toString().padStart(1, '0'); // 1 dígito
  const cNF = dados.cNF;

  const chaveSemDV = `${cUF}${AAMM}${CNPJ}${mod}${serie}${nNF}${tpEmis}${cNF}`;

  const cDV = calcularCDV(chaveSemDV);

  console.log('anoemes : ', AAMM);

  return chaveSemDV + cDV.toString();
}

export function calcularCDV(chave) {
  const pesos = [2, 3, 4, 5, 6, 7, 8, 9];
  let soma = 0;
  let pesoIndex = 0;

  for (let i = chave.length - 1; i >= 0; i--) {
    soma += parseInt(chave[i], 10) * pesos[pesoIndex];
    pesoIndex = (pesoIndex + 1) % pesos.length;
  }

  const resto = soma % 11;
  return resto === 0 || resto === 1 ? 0 : 11 - resto;
}
