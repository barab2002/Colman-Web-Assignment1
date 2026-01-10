import { Router } from 'express';
import exampleRouter from './example.router';
import postRouter from './post.router';
import commentRouter from './comment.router';
import healthRouter from './health.router';

const router = Router();

router.use('/example', exampleRouter);
router.use('/', postRouter);
router.use('/', commentRouter);
router.use('/', healthRouter);

export default router;
