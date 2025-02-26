import express, { Request, Response } from 'express';
import { 
  getTrackingByOrderId, 
  getTrackingByTrackingNumber, 
  addTrackingEvent,
  getLatestTrackingStatus
} from '../controllers/trackingController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// ดึงข้อมูลการติดตามด้วยหมายเลขการติดตาม (ไม่จำเป็นต้องล็อกอิน)
router.get('/track/:trackingNumber', (req: Request, res: Response) => {
  getTrackingByTrackingNumber(req, res);
});

// ดึงข้อมูลการติดตามล่าสุดด้วยหมายเลขการติดตาม
router.get('/status/:trackingNumber', (req: Request, res: Response) => {
  getLatestTrackingStatus(req, res);
});

// ดึงข้อมูลการติดตามด้วย order ID (ต้องล็อกอินแล้ว)
router.get('/order/:orderId', authenticate, (req: Request, res: Response) => {
  getTrackingByOrderId(req, res);
});

// เพิ่มข้อมูลการติดตามใหม่ (เฉพาะ admin)
router.post('/event', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  addTrackingEvent(req, res);
});

export default router;