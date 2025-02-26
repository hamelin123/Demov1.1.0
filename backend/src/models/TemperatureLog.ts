import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';

export interface TemperatureLog {
  id: string;
  order_id: string;
  temperature: number;
  humidity?: number;
  timestamp: Date;
  is_alert: boolean;
}

interface CreateTemperatureLogData {
  order_id: string;
  temperature: number;
  humidity?: number;
  is_alert?: boolean;
}

export class TemperatureLogModel {
  private static pool: Pool = db;

  /**
   * สร้างบันทึกอุณหภูมิใหม่
   */
  static async create(data: CreateTemperatureLogData): Promise<TemperatureLog> {
    const result = await this.pool.query(
      `INSERT INTO temperature_logs 
      (id, order_id, temperature, humidity, is_alert) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [
        uuidv4(),
        data.order_id,
        data.temperature,
        data.humidity || null,
        data.is_alert || false
      ]
    );

    return result.rows[0];
  }

  /**
   * ค้นหาบันทึกอุณหภูมิตาม ID
   */
  static async findById(id: string): Promise<TemperatureLog | null> {
    const result = await this.pool.query('SELECT * FROM temperature_logs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ค้นหาบันทึกอุณหภูมิตาม order_id
   */
  static async findByOrderId(orderId: string): Promise<TemperatureLog[]> {
    const result = await this.pool.query(
      'SELECT * FROM temperature_logs WHERE order_id = $1 ORDER BY timestamp DESC',
      [orderId]
    );
    
    return result.rows;
  }

  /**
   * ค้นหาบันทึกอุณหภูมิล่าสุดตาม order_id
   */
  static async findLatestByOrderId(orderId: string): Promise<TemperatureLog | null> {
    const result = await this.pool.query(
      'SELECT * FROM temperature_logs WHERE order_id = $1 ORDER BY timestamp DESC LIMIT 1',
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ค้นหาการแจ้งเตือนอุณหภูมิ
   */
  static async findAlerts(limit: number = 100, offset: number = 0): Promise<TemperatureLog[]> {
    const result = await this.pool.query(
      'SELECT * FROM temperature_logs WHERE is_alert = true ORDER BY timestamp DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows;
  }

  /**
   * ค้นหาการแจ้งเตือนอุณหภูมิตาม order_id
   */
  static async findAlertsByOrderId(orderId: string): Promise<TemperatureLog[]> {
    const result = await this.pool.query(
      'SELECT * FROM temperature_logs WHERE order_id = $1 AND is_alert = true ORDER BY timestamp DESC',
      [orderId]
    );
    
    return result.rows;
  }

  /**
   * รับข้อมูลสถิติอุณหภูมิตาม order_id
   */
  static async getTemperatureStats(orderId: string): Promise<{
    min: number;
    max: number;
    avg: number;
    count: number;
    alertCount: number;
  }> {
    const result = await this.pool.query(
      `SELECT 
        MIN(temperature) as min,
        MAX(temperature) as max,
        AVG(temperature) as avg,
        COUNT(*) as count,
        SUM(CASE WHEN is_alert = true THEN 1 ELSE 0 END) as alert_count
      FROM temperature_logs
      WHERE order_id = $1`,
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        count: 0,
        alertCount: 0
      };
    }
    
    return {
      min: parseFloat(result.rows[0].min) || 0,
      max: parseFloat(result.rows[0].max) || 0,
      avg: parseFloat(result.rows[0].avg) || 0,
      count: parseInt(result.rows[0].count, 10) || 0,
      alertCount: parseInt(result.rows[0].alert_count, 10) || 0
    };
  }

  /**
   * ลบบันทึกอุณหภูมิ
   */
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM temperature_logs WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}