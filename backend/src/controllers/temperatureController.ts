import { Request, Response } from 'express';
import { TemperatureLogModel } from '../models/TemperatureLog';
import { OrderModel } from '../models/Order';

// Add temperature log
export const addTemperatureLog = async (req: Request, res: Response) => {
  try {
    const { orderId, temperature, humidity, notes } = req.body;
    
    // Validate input
    if (!orderId || temperature === undefined) {
      return res.status(400).json({ message: 'OrderId and temperature are required' });
    }
    
    // Check if order exists
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check permission
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.id !== order.user_id) {
      return res.status(403).json({ message: 'Not authorized to add temperature logs for this order' });
    }
    
    // Set temperature alert based on required range
    const [minTemp, maxTemp] = [-20, -15]; // Example temperature range
    const isAlert = temperature < minTemp || temperature > maxTemp;
    
    // Create log
    const newLog = await TemperatureLogModel.create({
      order_id: orderId,
      temperature,
      humidity: humidity || null,
      is_alert: isAlert
    });
    
    if (isAlert) {
      console.log(`Temperature alert for order ${orderId}: ${temperature}°C`);
      // Additional alert handling could go here
    }
    
    return res.status(201).json({ 
      message: 'Temperature log added successfully',
      temperatureLog: newLog,
      isAlert
    });
  } catch (error) {
    console.error('Add temperature log error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get temperature logs by order ID
export const getTemperatureByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const logs = await TemperatureLogModel.findByOrderId(orderId);
    res.json({ temperatureLogs: logs });
  } catch (error) {
    console.error('Get temperature logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get temperature statistics by order ID
export const getTemperatureStats = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const stats = await TemperatureLogModel.getTemperatureStats(orderId);
    res.json({ stats });
  } catch (error) {
    console.error('Get temperature stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all temperature alerts (admin only)
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const alerts = await TemperatureLogModel.findAlerts(limit, offset);
    res.json({ alerts });
  } catch (error) {
    console.error('Get temperature alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get temperature alerts by order ID
export const getAlertsByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const alerts = await TemperatureLogModel.findAlertsByOrderId(orderId);
    res.json({ alerts });
  } catch (error) {
    console.error('Get temperature alerts by order ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};