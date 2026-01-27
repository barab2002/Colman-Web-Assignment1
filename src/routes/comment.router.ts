import { Router } from 'express';
import * as commentCtrl from '../controllers/comment.controller';
import * as healthCtrl from '../controllers/health.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/comment', authenticate, commentCtrl.createComment);
router.get('/comment/:commentId', authenticate, commentCtrl.getComment);
router.put('/comment/:commentId', authenticate, commentCtrl.updateComment);
router.delete('/comment/:commentId', authenticate, commentCtrl.deleteComment);

// Expose health check through comments router (public)
router.get('/comment/health', healthCtrl.mongoHealth);

export default router;
