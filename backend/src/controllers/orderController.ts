import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { TrackingDataModel } from '../models/TrackingData';
import { validateOrderInput } from '../utils/validators';

/**
 * สร้างคำสั่งซื้อใหม่
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateOrderInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const orderData = {
      user_id: req.user.id,
      ...value
    };

    // สร้างคำสั่งซื้อใหม่
    const newOrder = await OrderModel.create(orderData);

    // สร้างข้อมูลการติดตามเริ่มต้น
    await TrackingDataModel.create({
      order_id: newOrder.id,
      status: 'Order Created',
      notes: 'Order has been received and is being processed'
    });

    res.status(201).json({ 
      message: 'Order created successfully', 
      order: newOrder 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงคำสั่งซื้อตาม ID
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await OrderModel.findById(id);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ตรวจสอบว่าเป็นเจ้าของคำสั่งซื้อหรือเป็น admin
    if (req.user && (order.user_id !== req.user.id && req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Not authorized to access this order' });
      return;
    }

    // ดึงข้อมูลการติดตามล่าสุด
    const trackingData = await TrackingDataModel.findByOrderId(id);

    res.json({ 
      order,
      tracking: trackingData 
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงคำสั่งซื้อทั้งหมดของผู้ใช้
 */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const orders = await OrderModel.findByUserId(req.user.id);
    
    res.json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * อัปเดตคำสั่งซื้อ
 */
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await OrderModel.findById(id);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ตรวจสอบว่าเป็นเจ้าของคำสั่งซื้อหรือเป็น admin
    if (req.user && (order.user_id !== req.user.id && req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Not authorized to update this order' });
      return;
    }

    // ตรวจสอบว่าคำสั่งซื้อสามารถอัปเดตได้
    if (order.status !== 'pending' && req.user.role !== 'admin') {
      res.status(400).json({ 
        message: 'Can only update pending orders' 
      });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateOrderInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const updatedOrder = await OrderModel.update(id, value);
    
    res.json({ 
      message: 'Order updated successfully', 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * อัปเดตสถานะคำสั่งซื้อ (สำหรับ admin)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }
    
    // เฉพาะ admin เท่านั้นที่สามารถอัปเดตสถานะได้
    if (req.user && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update order status' });
      return;
    }

    const order = await OrderModel.findById(id);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // อัปเดตสถานะคำสั่งซื้อ
    const updatedOrder = await OrderModel.updateStatus(id, status);
    
    // สร้างข้อมูลการติดตามใหม่
    await TrackingDataModel.create({
      order_id: id,
      status,
      notes
    });
    
    res.json({ 
      message: 'Order status updated successfully', 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ยกเลิกคำสั่งซื้อ
 */
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await OrderModel.findById(id);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ตรวจสอบว่าเป็นเจ้าของคำสั่งซื้อหรือเป็น admin
    if (req.user && (order.user_id !== req.user.id && req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Not authorized to cancel this order' });
      return;
    }

    // ตรวจสอบว่าคำสั่งซื้อสามารถยกเลิกได้
    const nonCancelableStatuses = ['delivered', 'cancelled'];
    if (nonCancelableStatuses.includes(order.status)) {
      res.status(400).json({ 
        message: `Cannot cancel order with status: ${order.status}` 
      });
      return;
    }

    // อัปเดตสถานะเป็น cancelled
    const updatedOrder = await OrderModel.updateStatus(id, 'cancelled');
    
    // สร้างข้อมูลการติดตามใหม่
    await TrackingDataModel.create({
      order_id: id,
      status: 'Cancelled',
      notes: req.body.reason || 'Order cancelled by user'
    });
    
    res.json({ 
      message: 'Order cancelled successfully', 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};