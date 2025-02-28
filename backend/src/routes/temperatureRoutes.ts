import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { 
  addTemperatureLog, getTemperatureByOrderId, 
  getTemperatureStats, getAlerts, getAlertsByOrderId 
} from '../controllers/temperatureController';

const router = express.Router();

router.get('/order/:orderId', authenticate, getTemperatureByOrderId);
router.get('/stats/:orderId', authenticate, getTemperatureStats);
router.post('/log', authenticate, addTemperatureLog);
router.get('/alerts', authenticate, authorize(['admin']), getAlerts);
router.get('/alerts/:orderId', authenticate, getAlertsByOrderId);

export default router;