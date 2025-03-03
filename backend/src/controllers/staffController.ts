// backend/src/controllers/staffController.ts
import { Request, Response } from 'express';
import { StaffActionModel } from '../models/Staff';
import { ShipmentStatusModel } from '../models/ShipmentStatus';
import { TemperatureLogExtendedModel } from '../models/TemperatureLogExtended';
import { OrderModel } from '../models/Order';
import { validateShipmentStatusInput, validateTemperatureLogInput } from '../utils/validators';

/**
 * อัปเดตสถานะการขนส่ง
 */
export const updateShipmentStatus = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateShipmentStatusInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { orderId, status, location, notes, latitude, longitude, vehicleId } = value;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // สร้างสถานะการขนส่งใหม่
    const shipmentStatus = await ShipmentStatusModel.create({
      order_id: orderId,
      status,
      location,
      notes,
      updated_by: req.user.id,
      latitude,
      longitude,
      vehicle_id: vehicleId
    });

    // บันทึกการกระทำของพนักงาน
    await StaffActionModel.logAction({
      user_id: req.user.id,
      order_id: orderId,
      action_type: 'status_update',
      action_details: {
        oldStatus: order.status,
        newStatus: status,
        location,
        timestamp: new Date()
      }
    });
    
    res.status(200).json({
      message: 'Shipment status updated successfully',
      shipmentStatus
    });
  } catch (error) {
    console.error('Update shipment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * บันทึกอุณหภูมิใหม่
 */
export const recordTemperature = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateTemperatureLogInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { orderId, temperature, humidity, notes, location } = value;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ตรวจสอบช่วงอุณหภูมิที่กำหนด (จากข้อมูลสินค้าหรือจากคำสั่งซื้อ)
    const minTemp = order.min_temperature || -20; // ค่าเริ่มต้น
    const maxTemp = order.max_temperature || 8;   // ค่าเริ่มต้น

    // ตรวจสอบว่าอุณหภูมิอยู่ในช่วงที่กำหนด
    const isAlert = temperature < minTemp || temperature > maxTemp;

    // บันทึกอุณหภูมิ
    const temperatureLog = await TemperatureLogExtendedModel.create({
      order_id: orderId,
      temperature,
      humidity,
      is_alert: isAlert,
      location: location || null,
      recorded_by: req.user.id,
      notes: notes || null
    });

    // บันทึกการกระทำของพนักงาน
    await StaffActionModel.logAction({
      user_id: req.user.id,
      order_id: orderId,
      action_type: 'temperature_update',
      action_details: {
        temperature,
        humidity,
        isAlert,
        location,
        timestamp: new Date()
      }
    });
    
    res.status(201).json({
      message: 'Temperature recorded successfully',
      temperatureLog,
      isAlert
    });
  } catch (error) {
    console.error('Record temperature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงประวัติการกระทำของพนักงาน
 */
export const getStaffActionHistory = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const userId = req.params.userId || req.user.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    // ดึงประวัติการกระทำ
    const actions = await StaffActionModel.getActionsByUserId(userId, limit, offset);
    
    res.status(200).json({
      actions
    });
  } catch (error) {
    console.error('Get staff action history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงข้อมูลสถิติการทำงานของพนักงาน
 */
export const getStaffPerformanceStats = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const userId = req.params.userId || req.user.id;
    
    // กำหนดช่วงเวลา (30 วันย้อนหลัง)
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    // ดึงสถิติการกระทำตามประเภท
    const actionStats = await StaffActionModel.countActionsByType(
      userId,
      startDate,
      endDate
    );
    
    res.status(200).json({
      userId,
      period: {
        startDate,
        endDate
      },
      stats: actionStats
    });
  } catch (error) {
    console.error('Get staff performance stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};