import express, { Request, Response } from 'express';
import { 
  createOrder, 
  getOrderById, 
  getUserOrders, 
  updateOrder, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { OrderModel } from '../models/Order';

const router = express.Router();

// สร้างคำสั่งซื้อใหม่ (ต้องล็อกอินแล้ว)
router.post('/', authenticate, (req: Request, res: Response) => {
  createOrder(req, res);
});

// ดึงคำสั่งซื้อของผู้ใช้ที่ล็อกอินอยู่
router.get('/my-orders', authenticate, (req: Request, res: Response) => {
  getUserOrders(req, res);
});

// ดึงคำสั่งซื้อตาม ID
router.get('/:id', authenticate, (req: Request, res: Response) => {
  getOrderById(req, res);
});

// อัปเดตคำสั่งซื้อตาม ID
router.put('/:id', authenticate, (req: Request, res: Response) => {
  updateOrder(req, res);
});

// อัปเดตสถานะคำสั่งซื้อ (เฉพาะ admin)
router.patch('/:id/status', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  updateOrderStatus(req, res);
});

// ยกเลิกคำสั่งซื้อ
router.patch('/:id/cancel', authenticate, (req: Request, res: Response) => {
  cancelOrder(req, res);
});

// สำหรับ admin เท่านั้น - ดึงคำสั่งซื้อทั้งหมด
router.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
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