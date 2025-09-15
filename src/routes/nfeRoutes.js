import { emitController, statusController } from '../controllers/nfeController.js';
export function nfeRoutes(app) {
  app.get('/emit', emitController);

  app.get('/status', statusController);
}
