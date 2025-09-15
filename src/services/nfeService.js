import { Tools, Make } from 'node-sped-nfe';
import { config_sefaz } from '../config/sefaz.js';
import { config_certificate } from '../config/certificate.js';
import { signXml, sendNfe, gerarChaveNF } from '../utils/nfeUtils.js';
import fs from 'fs';
import { env } from '../env.js';

import path from 'path';
const myTools = new Tools(config_sefaz, config_certificate);

export async function nfeStatus() {
  const status = await myTools.sefazStatus();
  return status;
}

export async function emitNFe(nfeData) {
  console.log('TESTEEEEEEE ', env.cert.password);
  let NFe = new Make();

  const numeroNf = 1;
  const nNF = numeroNf.toString().padStart(9, '0');
  // const cNF = (nNF % 10000000).toString().padStart(8, '0');
  const cNF = Math.floor(10000000 + Math.random() * 90000000).toString();
  const ano = new Date().getFullYear();
  const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const serie = 1;

  const infosChaveAcesso = {
    cUF: env.codigoUf,
    ano,
    mes,
    CNPJ: env.emitente.cnpj,
    modelo: '55',
    serie: serie,
    nNF,
    tpEmis: env.emitente.tpEmis,
    cNF
  };

  // console.log('Infos Chave Acesso:', infosChaveAcesso);
  // return;
  const chaveAcesso = gerarChaveNF(infosChaveAcesso);
  const cDV = chaveAcesso.charAt(chaveAcesso.length - 1);

  const tagIde = {
    cUF: infosChaveAcesso.cUF,
    cNF,
    natOp: 'VENDA',
    mod: '55',
    serie: infosChaveAcesso.serie,
    nNF: numeroNf,
    dhEmi: NFe.formatData(),
    tpNF: '1',
    idDest: '1',
    cMunFG: env.emitente.codMunicipio,
    tpImp: '1',
    tpEmis: infosChaveAcesso.tpEmis,
    cDV: cDV,
    tpAmb: '2',
    finNFe: '1',
    indFinal: '1',
    indPres: '1',
    indIntermed: '0',
    procEmi: '0',
    verProc: '4.13'
  };

  console.log('Dados da NFe:', tagIde);

  const tagEmit = {
    CNPJ: env.emitente.cnpj,
    xNome: env.emitente.nomeEmpresa,
    xFant: env.emitente.nomeFantasia,
    IE: env.emitente.ie,
    CRT: '1'
  };

  console.log('Emitente:', tagEmit);

  const tagEnderEmit = {
    xLgr: env.emitente.logradouro,
    nro: env.emitente.numero,
    xBairro: env.emitente.bairro,
    cMun: env.emitente.codMunicipio,
    xMun: env.emitente.municipio,
    UF: env.emitente.uf,
    CEP: env.emitente.cep,
    cPais: env.emitente.codPais,
    xPais: env.emitente.nomePais,
    fone: env.emitente.fone
  };

  const tagDest = {
    CPF: '05407814013',
    xNome: 'VITOR MANOEL DE MORAES',
    indIEDest: '9'
  };

  const tagEnderDest = {
    xLgr: 'Dona clara',
    nro: '89',
    xBairro: 'beira rio',
    cMun: '4305355',
    xMun: 'Charqueadas',
    UF: 'RS',
    CEP: '96745000',
    cPais: '1058',
    xPais: 'BRASIL'
  };

  const items = [
    {
      cProd: '126',
      cEAN: 'SEM GTIN',
      xProd: 'CABOS MICROFONE DMX XR CANON BALANCEADO 20 METROS',
      NCM: '85044010',
      CFOP: '5102',
      uCom: 'UNID',
      qCom: '3.0000',
      vUnCom: '132.0000000000',
      vProd: '396.00',
      cEANTrib: 'SEM GTIN',
      uTrib: 'UNID',
      qTrib: '3.0000',
      vUnTrib: '132.0000000000',
      indTot: '1'
    }
  ];

  NFe.tagInfNFe({ Id: 'NFe' + chaveAcesso, versao: '4.00' });
  NFe.tagIde(tagIde);
  NFe.tagEmit(tagEmit);
  NFe.tagEnderEmit(tagEnderEmit);
  NFe.tagDest(tagDest);

  NFe.tagEnderDest(tagEnderDest);

  NFe.tagProd(items);

  //Setor o imposto de cada produto.
  items.map((value, index) => {
    NFe.tagProdICMSSN(index, { orig: '0', CSOSN: '400' });

    NFe.tagProdPIS(index, { CST: '49', qBCProd: 0, vAliqProd: 0, vPIS: 0 });
    NFe.tagProdCOFINS(index, { CST: '49', qBCProd: 0, vAliqProd: 0, vCOFINS: 0 });
  });
  NFe.tagICMSTot();
  NFe.tagTransp({ modFrete: 9 });
  NFe.tagDetPag([{ indPag: 0, tPag: '01', vPag: '1200.00' }]);
  NFe.tagTroco('0.00');
  NFe.tagInfRespTec({
    CNPJ: env.emitente.cnpj,
    xContato: env.emitente.nomeEmpresa,
    email: 'teste@testes.com.br',
    fone: env.emitente.fone
  });

  const xmlEnvio = NFe.xml();
  const pathXml = path.resolve(process.cwd(), 'xmls');
  const xmlAssinado = await signXml(xmlEnvio, myTools);
  const retorno = await sendNfe(xmlAssinado, myTools);
  fs.writeFileSync(path.join(pathXml, 'nfe.xml'), xmlAssinado);
  return retorno;
}
