import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { TrackingDataModel } from '../models/TrackingData';
import { validateOrderInput } from '../utils/validators';

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });

    const { error, value } = validateOrderInput(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Create order
    const newOrder = await OrderModel.create({ user_id: req.user.id, ...value });

    // Create initial tracking event
    await TrackingDataModel.create({
      order_id: newOrder.id,
      status: 'Order Created',
      notes: 'Order has been received and is being processed'
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check permission
    if (req.user && (order.user_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    // Get tracking data
    const trackingData = await TrackingDataModel.findByOrderId(id);
    res.json({ order, tracking: trackingData });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const orders = await OrderModel.findByUserId(req.user.id);
    res.json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check permission
    if (req.user && (order.user_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Check if order can be updated
    if (order.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Can only update pending orders' });
    }

    // Validate and update
    const { error, value } = validateOrderInput(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedOrder = await OrderModel.update(id, value);
    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) return res.status(400).json({ message: 'Status is required' });
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Not authorized to update order status' });

    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update status and create tracking event
    const updatedOrder = await OrderModel.updateStatus(id, status);
    await TrackingDataModel.create({ order_id: id, status, notes });
    
    res.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check permission
    if (req.user && (order.user_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    const nonCancelableStatuses = ['delivered', 'cancelled'];
    if (nonCancelableStatuses.includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
    }

    // Cancel order and create tracking event
    const updatedOrder = await OrderModel.updateStatus(id, 'cancelled');
    await TrackingDataModel.create({
      order_id: id,
      status: 'Cancelled',
      notes: req.body.reason || 'Order cancelled by user'
    });
    
    res.json({ message: 'Order cancelled successfully', order: updatedOrder });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};