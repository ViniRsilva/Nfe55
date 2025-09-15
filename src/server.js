import fastify from 'fastify';
import cors from '@fastify/cors';
const app = fastify();
import { nfeRoutes } from './routes/nfeRoutes.js';
app.register(cors, {
  origin: 'http://127.0.0.1:3010/'
});

app.register(nfeRoutes, { prefix: '/nfe' });

export function bootstrap() {
  const PORT = process.env.PORT || 3000;
  app.listen({ port: PORT }, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
