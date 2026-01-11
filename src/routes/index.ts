import { Router } from 'express';
import postRouter from './post.router';
import commentRouter from './comment.router';
import healthRouter from './health.router';
import userRouter from './user.router';
import authRouter from './auth.router';

const router = Router();

router.use('/', postRouter);
router.use('/', commentRouter);
router.use('/', healthRouter);
router.use('/', userRouter);
router.use('/', authRouter);

export default router;
