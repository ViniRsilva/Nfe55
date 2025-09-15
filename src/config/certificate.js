import path from 'path';

const root = process.cwd();
const CERTIFICADO_PATH = path.join(root, 'cert', 'certificado.pfx');

export const config_certificate = {
  pfx: CERTIFICADO_PATH,
  senha: process.env.CERT_PASSWORD || '23132492'
};
