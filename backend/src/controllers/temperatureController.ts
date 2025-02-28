// backend/src/controllers/temperatureController.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { TemperatureLog } from '../entities/TemperatureLog';
import { Order } from '../entities/Order';

export const addTemperatureLog = async (req: Request, res: Response) => {
  try {
    const { orderId, temperature, humidity, notes } = req.body;
    
    // Validate input
    if (!orderId || temperature === undefined) {
      return res.status(400).json({ message: 'OrderId and temperature are required' });
    }
    
    // Check if order exists
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: orderId } });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check for permission (only staff, admin or the order owner can add logs)
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.id !== order.user_id) {
      return res.status(403).json({ message: 'Not authorized to add temperature logs for this order' });
    }
    
    // Set temperature alert based on required range
    // This could be product-specific in a more sophisticated implementation
    const minTemp = -20; // Example minimum acceptable temperature
    const maxTemp = -15; // Example maximum acceptable temperature
    const isAlert = temperature < minTemp || temperature > maxTemp;
    
    // Create new temperature log
    const temperatureLogRepository = getRepository(TemperatureLog);
    const newLog = temperatureLogRepository.create({
      order_id: orderId,
      staff_id: req.user.role === 'staff' || req.user.role === 'admin' ? req.user.id : null,
      temperature,
      humidity: humidity || null,
      is_alert: isAlert,
      input_method: 'manual',
      notes: notes || null
    });
    
    await temperatureLogRepository.save(newLog);
    
    // If there's an alert, additional notification logic would go here
    if (isAlert) {
      // Send alert to relevant parties (email, push notification, etc.)
      console.log(`Temperature alert for order ${orderId}: ${temperature}°C`);
      // logAlertService.recordAlert(newLog.id, orderId, temperature, minTemp, maxTemp);
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