// src/models/TemperatureLogExtended.ts
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';

export interface TemperatureLogExtended {
  id: string;
  order_id: string;
  temperature: number;
  humidity?: number;
  timestamp: Date;
  is_alert: boolean;
  location?: string;
  recorded_by: string;
  notes?: string;
  device_id?: string;
  battery_level?: number;
  full_name?: string;
}

export class TemperatureLogExtendedModel {
  private static pool: Pool = db;

  /**
   * สร้างบันทึกอุณหภูมิใหม่
   */
  static async create(data: Omit<TemperatureLogExtended, 'id' | 'timestamp'>): Promise<TemperatureLogExtended> {
    try {
      const result = await this.pool.query(
        `INSERT INTO temperature_logs_extended 
        (id, order_id, temperature, humidity, is_alert, location, recorded_by, notes, device_id, battery_level) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
        [
          uuidv4(),
          data.order_id,
          data.temperature,
          data.humidity || null,
          data.is_alert,
          data.location || null,
          data.recorded_by,
          data.notes || null,
          data.device_id || null,
          data.battery_level || null
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating extended temperature log:', error);
      throw error;
    }
  }

  /**
   * ค้นหาบันทึกอุณหภูมิตาม Order ID
   */
  static async findByOrderId(orderId: string): Promise<TemperatureLogExtended[]> {
    try {
      const result = await this.pool.query(
        `SELECT tl.*, u.username, u.full_name 
        FROM temperature_logs_extended tl
        LEFT JOIN users u ON tl.recorded_by = u.id
        WHERE tl.order_id = $1 
        ORDER BY tl.timestamp DESC`,
        [orderId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error finding extended temperature logs by order ID:', error);
      throw error;
    }
  }

  /**
   * ค้นหาบันทึกอุณหภูมิล่าสุดตาม Order ID
   */
  static async findLatestByOrderId(orderId: string): Promise<TemperatureLogExtended | null> {
    try {
      const result = await this.pool.query(
        `SELECT tl.*, u.username, u.full_name 
        FROM temperature_logs_extended tl
        LEFT JOIN users u ON tl.recorded_by = u.id
        WHERE tl.order_id = $1 
        ORDER BY tl.timestamp DESC 
        LIMIT 1`,
        [orderId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding latest extended temperature log by order ID:', error);
      throw error;
    }
  }

  /**
   * ค้นหาการแจ้งเตือนอุณหภูมิ
   */
  static async findAlerts(
    limit: number = 50, 
    offset: number = 0
  ): Promise<TemperatureLogExtended[]> {
    try {
      const result = await this.pool.query(
        `SELECT tl.*, u.username, u.full_name, o.order_number
        FROM temperature_logs_extended tl
        LEFT JOIN users u ON tl.recorded_by = u.id
        JOIN orders o ON tl.order_id = o.id
        WHERE tl.is_alert = true 
        ORDER BY tl.timestamp DESC 
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error finding extended temperature alerts:', error);
      throw error;
    }
  }
}