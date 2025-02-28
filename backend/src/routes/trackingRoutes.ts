import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { OrderModel } from '../models/Order';
import { TrackingDataModel } from '../models/TrackingData';
import { validateTrackingEventInput } from '../utils/validators';

const router = express.Router();

// Use authentication for all routes
router.use(authenticate);

// Get tracking data by order ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const trackingData = await TrackingDataModel.findByOrderId(req.params.orderId);
    res.json({ trackingData });
  } catch (error) {
    console.error('Get tracking data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest tracking event
router.get('/latest/:orderId', async (req, res) => {
  try {
    const latestTracking = await TrackingDataModel.findLatestByOrderId(req.params.orderId);
    if (!latestTracking) {
      return res.status(404).json({ message: 'No tracking data found' });
    }
    res.json({ trackingData: latestTracking });
  } catch (error) {
    console.error('Get latest tracking data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add tracking event (staff/admin only)
router.post('/event', authorize(['admin', 'staff']), async (req, res) => {
  try {
    const { error, value } = validateTrackingEventInput(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { orderId, status, location, notes, vehicleId } = value;
    
    // Create tracking event
    const trackingData = await TrackingDataModel.create({
      order_id: orderId,
      status,
      location,
      notes,
      vehicle_id: vehicleId
    });
    
    // Update order status
    await OrderModel.updateStatus(orderId, status);
    
    res.status(201).json({ message: 'Tracking event added successfully', trackingData });
  } catch (error) {
    console.error('Add tracking event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;