import express from 'express';
import { 
  createOrder, getOrderById, getUserOrders, 
  updateOrder, updateOrderStatus, cancelOrder 
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { OrderModel } from '../models/Order';
import { validateBody } from '../middleware/validation';
import { validateOrderInput } from '../utils/validators';

const router = express.Router();

// Use authentication for all routes
router.use(authenticate);

// User routes
router.post('/', validateBody(validateOrderInput), createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id', validateBody(validateOrderInput), updateOrder);
router.patch('/:id/cancel', cancelOrder);

// Admin-only routes
router.patch('/:id/status', authorize(['admin']), updateOrderStatus);
router.get('/', authorize(['admin']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;
    
    const orders = await OrderModel.findAll(limit, offset);
    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;