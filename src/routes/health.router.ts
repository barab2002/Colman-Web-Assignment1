import { Router } from 'express';
import * as healthCtrl from '../controllers/health.controller';

const router = Router();

// Public health check for MongoDB
router.get('/health/mongo', healthCtrl.mongoHealth);

export default router;
