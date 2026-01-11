import { Router } from 'express';
import * as postCtrl from '../controllers/post.controller';
import * as commentCtrl from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/post', authenticate, postCtrl.createPost);
router.get('/post', authenticate, postCtrl.getPosts);
router.get('/post/:postId', authenticate, postCtrl.getPost);
router.put('/post/:postId', authenticate, postCtrl.updatePost);
router.get('/post/:postId/comments', authenticate, commentCtrl.getCommentsByPost);

export default router;
