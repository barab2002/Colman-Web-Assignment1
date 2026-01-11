import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/users', userController.registerUser);
router.get('/users', authenticate, userController.getUsers);
router.get('/users/:userId', authenticate, userController.getUser);
router.put('/users/:userId', authenticate, userController.updateUser);
router.delete('/users/:userId', authenticate, userController.deleteUser);

export default router;
