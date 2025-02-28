import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { TrackingDataModel } from '../models/TrackingData';
import { OrderModel } from '../models/Order';

const router = express.Router();

// Get tracking data by order ID
router.get('/order/:orderId', authenticate, async (req, res) => {
  try {
    const trackingData = await TrackingDataModel.findByOrderId(req.params.orderId);
    res.json({ trackingData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest tracking event
router.get('/latest/:orderId', authenticate, async (req, res) => {
  try {
    const latestTracking = await TrackingDataModel.findLatestByOrderId(req.params.orderId);
    if (!latestTracking) return res.status(404).json({ message: 'No tracking data found' });
    res.json({ trackingData: latestTracking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add tracking event (staff/admin only)
router.post('/event', authenticate, authorize(['admin', 'staff']), async (req, res) => {
  try {
    const { orderId, status, location, notes, vehicleId } = req.body;
    
    if (!orderId || !status) return res.status(400).json({ message: 'Order ID and status are required' });
    
    // Create tracking event
    const trackingData = await TrackingDataModel.create({
      order_id: orderId,
      status,
      location: location || null,
      notes: notes || null,
      vehicle_id: vehicleId || null
    });
    
    // Update order status
    await OrderModel.updateStatus(orderId, status);
    
    res.status(201).json({ message: 'Tracking event added successfully', trackingData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;