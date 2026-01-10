import { Router } from 'express';
import exampleRouter from './example.router';
import postRouter from './post.router';
import commentRouter from './comment.router';

const router = Router();

router.use('/example', exampleRouter);
router.use('/', postRouter);
router.use('/', commentRouter);

export default router;
