import { Router } from 'express';
import * as postCtrl from '../controllers/post.controller';
import * as commentCtrl from '../controllers/comment.controller';

const router = Router();

router.post('/post', postCtrl.createPost);
router.get('/post', postCtrl.getPosts);
router.get('/post/:postId', postCtrl.getPost);
router.put('/post/:postId', postCtrl.updatePost);

// comments for a post
router.get('/post/:postId/comments', commentCtrl.getCommentsByPost);

export default router;
