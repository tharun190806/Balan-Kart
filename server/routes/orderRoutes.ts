import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.ts';
import { authenticateUser, optionalAuth } from '../middleware/auth.ts';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticateUser, getUserOrders);
router.get('/:id', optionalAuth, getOrderById);

export default router;
