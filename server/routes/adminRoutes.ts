import { Router } from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
} from '../controllers/adminController.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

router.use(requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/customers', getAllCustomers);

export default router;
