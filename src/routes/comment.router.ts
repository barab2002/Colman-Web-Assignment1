import { Router } from 'express';
import * as commentCtrl from '../controllers/comment.controller';

const router = Router();

router.post('/comment', commentCtrl.createComment);
router.get('/comment/:commentId', commentCtrl.getComment);
router.put('/comment/:commentId', commentCtrl.updateComment);
router.delete('/comment/:commentId', commentCtrl.deleteComment);

export default router;
