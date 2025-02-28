import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { 
  addTemperatureLog, getTemperatureByOrderId, 
  getTemperatureStats, getAlerts, getAlertsByOrderId 
} from '../controllers/temperatureController';

const router = express.Router();

// Group routes by auth requirements
router.use(authenticate);

// Routes that any authenticated user can access
router.get('/order/:orderId', getTemperatureByOrderId);
router.get('/stats/:orderId', getTemperatureStats);
router.post('/log', addTemperatureLog);
router.get('/alerts/:orderId', getAlertsByOrderId);

// Admin-only routes
router.get('/alerts', authorize(['admin']), getAlerts);

export default router;