// src/controllers/temperatureController.ts
import { Request, Response } from 'express';
import { TemperatureLogModel } from '../models/TemperatureLog';
import { OrderModel } from '../models/Order';

/**
 * ดึงข้อมูลอุณหภูมิตาม Order ID
 */
export const getTemperatureByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ตรวจสอบสิทธิ์การเข้าถึง (ถ้าไม่ใช่ admin ต้องเป็นเจ้าของคำสั่งซื้อ)
    if (req.user && order.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to access this temperature data' });
      return;
    }

    const temperatureData = await TemperatureLogModel.findByOrderId(orderId);
    
    res.json({ 
      order,
      temperatureData
    });
  } catch (error) {
    console.error('Get temperature by order ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงสถิติอุณหภูมิตาม Order ID
 */
export const getTemperatureStats = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ตรวจสอบสิทธิ์การเข้าถึง (ถ้าไม่ใช่ admin ต้องเป็นเจ้าของคำสั่งซื้อ)
    if (req.user && order.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to access this temperature data' });
      return;
    }

    const stats = await TemperatureLogModel.getTemperatureStats(orderId);
    
    res.json({ stats });
  } catch (error) {
    console.error('Get temperature stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * เพิ่มบันทึกอุณหภูมิใหม่
 */
export const addTemperatureLog = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const { orderId, temperature, humidity, is_alert } = req.body;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // สร้างบันทึกอุณหภูมิใหม่
    const temperatureLog = await TemperatureLogModel.create({
      order_id: orderId,
      temperature,
      humidity: humidity || null,
      is_alert: is_alert || false
    });
    
    res.status(201).json({ 
      message: 'Temperature log added successfully', 
      temperatureLog 
    });
  } catch (error) {
    console.error('Add temperature log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงการแจ้งเตือนอุณหภูมิทั้งหมด
 */
export const getAlerts = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const alerts = await TemperatureLogModel.findAlerts(limit, offset);
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get temperature alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงการแจ้งเตือนอุณหภูมิตาม Order ID
 */
export const getAlertsByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ตรวจสอบสิทธิ์การเข้าถึง (ถ้าไม่ใช่ admin ต้องเป็นเจ้าของคำสั่งซื้อ)
    if (req.user && order.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to access this temperature data' });
      return;
    }

    const alerts = await TemperatureLogModel.findAlertsByOrderId(orderId);
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get temperature alerts by order ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};