import { Request, Response } from 'express';
import { TemperatureLogModel } from '../models/TemperatureLog';
import { OrderModel } from '../models/Order';

/**
 * ดึงบันทึกอุณหภูมิตาม order ID
 */
export const getTemperatureByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ตรวจสอบสิทธิ์การเข้าถึง
    if (req.user && order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this temperature data' });
    }

    const temperatureLogs = await TemperatureLogModel.findByOrderId(orderId);
    
    // จัดรูปแบบข้อมูลให้ใช้งานได้ง่ายใน frontend
    const formattedData = temperatureLogs.map(log => ({
      id: log.id,
      temperature: log.temperature,
      humidity: log.humidity,
      timestamp: log.timestamp,
      isAlert: log.is_alert
    }));
    
    res.json({ 
      orderId,
      orderNumber: order.order_number,
      temperatureLogs: formattedData 
    });
  } catch (error) {
    console.error('Get temperature logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงสถิติอุณหภูมิตาม order ID
 */
export const getTemperatureStats = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ตรวจสอบสิทธิ์การเข้าถึง
    if (req.user && order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this temperature data' });
    }

    const stats = await TemperatureLogModel.getTemperatureStats(orderId);
    const latestLog = await TemperatureLogModel.findLatestByOrderId(orderId);
    
    res.json({ 
      orderId,
      orderNumber: order.order_number,
      stats,
      currentTemperature: latestLog ? latestLog.temperature : null,
      currentHumidity: latestLog ? latestLog.humidity : null,
      lastUpdate: latestLog ? latestLog.timestamp : null
    });
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
    const { orderId, temperature, humidity } = req.body;
    
    if (!orderId || temperature === undefined) {
      return res.status(400).json({ message: 'Order ID and temperature are required' });
    }

    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ตรวจสอบว่าอุณหภูมิอยู่ในช่วงปกติหรือไม่ (ตัวอย่าง: 2-8°C สำหรับสินค้าที่ต้องควบคุมอุณหภูมิ)
    // ข้อกำหนดอุณหภูมิอาจแตกต่างกันตามประเภทของสินค้า
    const minTemp = 2;
    const maxTemp = 8;
    const isAlert = temperature < minTemp || temperature > maxTemp;

    // สร้างบันทึกอุณหภูมิใหม่
    const temperatureLog = await TemperatureLogModel.create({
      order_id: orderId,
      temperature,
      humidity,
      is_alert: isAlert
    });

    // ถ้าอุณหภูมิไม่อยู่ในช่วงที่กำหนด ควรมีการแจ้งเตือน
    // โค้ดส่วนนี้จะเรียกใช้บริการแจ้งเตือน (ซึ่งยังไม่ได้พัฒนา)
    if (isAlert) {
      // ตัวอย่าง: notificationService.sendAlert(...)
      console.log(`Temperature alert for order ${orderId}: ${temperature}°C`);
    }
    
    res.status(201).json({ 
      message: 'Temperature log added successfully', 
      temperatureLog,
      isAlert
    });
  } catch (error) {
    console.error('Add temperature log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงการแจ้งเตือนอุณหภูมิทั้งหมด (สำหรับ admin)
 */
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;
    
    const alerts = await TemperatureLogModel.findAlerts(limit, offset);
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get temperature alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงการแจ้งเตือนอุณหภูมิตาม order ID
 */
export const getAlertsByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ตรวจสอบสิทธิ์การเข้าถึง
    if (req.user && order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this temperature data' });
    }

    const alerts = await TemperatureLogModel.findAlertsByOrderId(orderId);
    
    res.json({ 
      orderId,
      orderNumber: order.order_number,
      alerts 
    });
  } catch (error) {
    console.error('Get temperature alerts by order ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};