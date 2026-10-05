import { Router } from 'express';
import { register, login, adminLogin, getMe } from '../controllers/authController.ts';
import { authenticateUser } from '../middleware/auth.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', authenticateUser, getMe);

export default router;
