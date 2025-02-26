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

// ดึงบันทึกอุณหภูมิตาม order ID
router.get('/order/:orderId', authenticate, (req: Request, res: Response) => {
  getTemperatureByOrderId(req, res);
});

// ดึงสถิติอุณหภูมิตาม order ID
router.get('/stats/:orderId', authenticate, (req: Request, res: Response) => {
  getTemperatureStats(req, res);
});

// ดึงการแจ้งเตือนอุณหภูมิทั้งหมด (เฉพาะ admin)
router.get('/alerts', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  getAlerts(req, res);
});

// ดึงการแจ้งเตือนอุณหภูมิตาม order ID
router.get('/alerts/:orderId', authenticate, (req: Request, res: Response) => {
  getAlertsByOrderId(req, res);
});

// เพิ่มบันทึกอุณหภูมิใหม่ (เฉพาะ admin หรือระบบ IoT)
router.post('/log', authenticate, authorize(['admin', 'system']), (req: Request, res: Response) => {
  addTemperatureLog(req, res);
});

export default router;