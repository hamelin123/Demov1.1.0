// backend/src/controllers/trackingController.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { TrackingData } from '../entities/TrackingData';
import { Order } from '../entities/Order';
import { TemperatureLog } from '../entities/TemperatureLog';
import { checkPermission } from '../utils/permissionHelper';

/**
 * เพิ่มเหตุการณ์การติดตามใหม่ (สำหรับเจ้าหน้าที่หรือระบบ)
 */
export const addTrackingEvent = async (req: Request, res: Response) => {
  try {
    const { orderId, status, location, notes, vehicleId } = req.body;
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: orderId } });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // ตรวจสอบสิทธิ์
    if (!checkPermission(req.user, 'tracking:create', { orderId: order.id, userId: order.user_id })) {
      return res.status(403).json({ message: 'Not authorized to add tracking events for this order' });
    }
    
    // สร้างข้อมูลการติดตามใหม่
    const trackingRepository = getRepository(TrackingData);
    const newTracking = trackingRepository.create({
      order_id: orderId,
      status,
      location: location || null,
      notes: notes || null,
      vehicle_id: vehicleId || null,
      staff_id: req.user.role === 'staff' || req.user.role === 'admin' ? req.user.id : null,
      input_method: 'manual'
    });
    
    await trackingRepository.save(newTracking);
    
    // อัปเดตสถานะคำสั่งซื้อให้ตรงกับสถานะการติดตามล่าสุด
    await orderRepository.update(orderId, { status });
    
    // หากเป็นการส่งมอบเสร็จสิ้น (Delivered) ให้บันทึกเวลาส่งมอบ
    if (status === 'delivered') {
      await orderRepository.update(orderId, { 
        delivery_completed_at: new Date(),
        updated_at: new Date()
      });
    }
    
    res.status(201).json({ 
      message: 'Tracking event added successfully', 
      trackingData: newTracking 
    });
  } catch (error) {
    console.error('Add tracking event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * รับข้อมูลการติดตามล่าสุดพร้อมข้อมูลอุณหภูมิล่าสุด
 */
export const getLatestTrackingAndTemperature = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: orderId } });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // ตรวจสอบสิทธิ์
    if (!checkPermission(req.user, 'order:view', { orderId: order.id, userId: order.user_id })) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    // ดึงข้อมูลการติดตามล่าสุด
    const trackingRepository = getRepository(TrackingData);
    const latestTracking = await trackingRepository.findOne({
      where: { order_id: orderId },
      order: { timestamp: 'DESC' }
    });
    
    // ดึงข้อมูลอุณหภูมิล่าสุด
    const temperatureRepository = getRepository(TemperatureLog);
    const latestTemperature = await temperatureRepository.findOne({
      where: { order_id: orderId },
      order: { timestamp: 'DESC' }
    });
    
    res.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        estimatedDelivery: order.estimated_delivery_date
      },
      tracking: latestTracking || null,
      temperature: latestTemperature || null
    });
  } catch (error) {
    console.error('Get latest tracking and temperature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};