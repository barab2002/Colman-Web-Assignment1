import { Router } from 'express';
import * as healthCtrl from '../controllers/health.controller';

const router = Router();

router.get('/health/mongo', healthCtrl.mongoHealth);

export default router;
