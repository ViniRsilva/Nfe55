import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'PORT',
  'CERT_PASSWORD',
  'LOUGRADOURO',
  'NUMERO_LOG',
  'BAIRRO',
  'MUNICIPIO',
  'UF',
  'CEP',
  'COD_PAIS',
  'NOME_PAIS',
  'FONE',
  'COD_MUNICIPIO',
  'NOME_EMPRESA',
  'NOME_FANTASIA',
  'IE',
  'CNPJ',
  'CODIGO_UF',
  'TPEMIS'
];

const missing = requiredEnvVars.filter(k => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = {
  port: Number(process.env.PORT),
  codigoUf: process.env.CODIGO_UF,
  cert: {
    path: process.env.CERT_PATH,
    password: process.env.CERT_PASSWORD
  },
  emitente: {
    logradouro: process.env.LOUGRADOURO,
    numero: process.env.NUMERO_LOG,
    bairro: process.env.BAIRRO,
    municipio: process.env.MUNICIPIO,
    uf: process.env.UF,
    cep: process.env.CEP,
    codPais: process.env.COD_PAIS,
    nomePais: process.env.NOME_PAIS,
    fone: process.env.FONE,
    codMunicipio: process.env.COD_MUNICIPIO,
    nomeEmpresa: process.env.NOME_EMPRESA,
    nomeFantasia: process.env.NOME_FANTASIA,
    ie: process.env.IE,
    cnpj: process.env.CNPJ,
    tpEmis: process.env.TPEMIS
  }
};

export default env;
