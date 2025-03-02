// backend/src/routes/temperatureRoutes.ts
import express, { Request, Response } from 'express';
import { 
  getTemperatureByOrderId, 
  getTemperatureStats, 
  addTemperatureLog, 
  getAlerts,
  getAlertsByOrderId 
} from '../controllers/temperatureController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// ดึงข้อมูลอุณหภูมิตาม Order ID
router.get('/order/:orderId', authenticate, (req: Request, res: Response) => {
  getTemperatureByOrderId(req, res);
});

// ดึงสถิติอุณหภูมิตาม Order ID
router.get('/stats/:orderId', authenticate, (req: Request, res: Response) => {
  getTemperatureStats(req, res);
});

// เพิ่มบันทึกอุณหภูมิใหม่ (staff/admin)
router.post('/', authenticate, authorize(['staff', 'admin']), (req: Request, res: Response) => {
  addTemperatureLog(req, res);
});

// ดึงการแจ้งเตือนอุณหภูมิทั้งหมด (admin)
router.get('/alerts', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  getAlerts(req, res);
});

// ดึงการแจ้งเตือนอุณหภูมิตาม Order ID
router.get('/alerts/:orderId', authenticate, (req: Request, res: Response) => {
  getAlertsByOrderId(req, res);
});

export default router;