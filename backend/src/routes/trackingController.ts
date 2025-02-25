import { Request, Response } from 'express';
import { TrackingDataModel } from '../models/TrackingData';
import { OrderModel } from '../models/Order';

/**
 * ดึงข้อมูลการติดตามตาม order ID
 */
export const getTrackingByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ตรวจสอบสิทธิ์การเข้าถึง
    if (req.user && order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this tracking data' });
    }

    const trackingData = await TrackingDataModel.findByOrderId(orderId);
    
    res.json({ 
      order,
      trackingEvents: trackingData 
    });
  } catch (error) {
    console.error('Get tracking by order ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงข้อมูลการติดตามด้วยหมายเลขการติดตาม (หมายเลขคำสั่งซื้อ)
 */
export const getTrackingByTrackingNumber = async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;
    
    // ใช้หมายเลขคำสั่งซื้อเป็นหมายเลขติดตาม
    const order = await OrderModel.findByOrderNumber(trackingNumber);
    if (!order) {
      return res.status(404).json({ message: 'Tracking information not found' });
    }

    const trackingData = await TrackingDataModel.findByOrderId(order.id);
    
    res.json({ 
      orderNumber: order.order_number,
      status: order.status,
      senderName: order.sender_name,
      recipientName: order.recipient_name,
      estimatedDelivery: order.estimated_delivery_date,
      trackingEvents: trackingData 
    });
  } catch (error) {
    console.error('Get tracking by tracking number error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงสถานะการติดตามล่าสุดด้วยหมายเลขการติดตาม
 */
export const getLatestTrackingStatus = async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;
    
    // ใช้หมายเลขคำสั่งซื้อเป็นหมายเลขติดตาม
    const order = await OrderModel.findByOrderNumber(trackingNumber);
    if (!order) {
      return res.status(404).json({ message: 'Tracking information not found' });
    }

    const latestTracking = await TrackingDataModel.findLatestByOrderId(order.id);
    
    res.json({ 
      orderNumber: order.order_number,
      status: order.status,
      currentLocation: latestTracking?.location || 'Not available',
      lastUpdate: latestTracking?.timestamp || null,
      estimatedDelivery: order.estimated_delivery_date
    });
  } catch (error) {
    console.error('Get latest tracking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * เพิ่มเหตุการณ์การติดตามใหม่ (สำหรับเจ้าหน้าที่หรือระบบ)
 */
export const addTrackingEvent = async (req: Request, res: Response) => {
  try {
    const { orderId, status, location, notes, vehicleId } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }

    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // สร้างข้อมูลการติดตามใหม่
    const trackingData = await TrackingDataModel.create({
      order_id: orderId,
      status,
      location,
      notes,
      vehicle_id: vehicleId
    });

    // อัปเดตสถานะคำสั่งซื้อให้ตรงกับสถานะการติดตามล่าสุด
    await OrderModel.updateStatus(orderId, status);
    
    res.status(201).json({ 
      message: 'Tracking event added successfully', 
      trackingData 
    });
  } catch (error) {
    console.error('Add tracking event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};