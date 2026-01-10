import { Router } from 'express';
import exampleRouter from './example.router';

const router = Router();

router.use('/example', exampleRouter);

export default router;
