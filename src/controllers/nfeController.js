import { emitNFe, nfeStatus } from '../services/nfeService.js';
export async function emitController(req, reply) {
  const result = await emitNFe();
  reply.header('Content-Type', 'application/xml; charset=utf-8');
  return reply.send(result);
}

export async function statusController(req, reply) {
  const result = await nfeStatus();
  reply.header('Content-Type', 'application/xml; charset=utf-8');
  return reply.send(result);
}
