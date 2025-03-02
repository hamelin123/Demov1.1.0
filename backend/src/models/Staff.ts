// backend/src/models/Staff.ts
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';

export interface StaffAction {
  id: string;
  user_id: string;
  order_id: string;
  action_type: 'temperature_update' | 'status_update' | 'location_update';
  action_details: any;
  created_at: Date;
}

export class StaffActionModel {
  private static pool: Pool = db;

  /**
   * บันทึกการกระทำของพนักงาน
   */
  static async logAction(data: {
    // backend/src/models/Staff.ts (ต่อ)
    user_id: string;
    order_id: string;
    action_type: 'temperature_update' | 'status_update' | 'location_update';
    action_details: any;
  }): Promise<StaffAction> {
    try {
      const result = await this.pool.query(
        `INSERT INTO staff_actions 
        (id, user_id, order_id, action_type, action_details, created_at) 
        VALUES ($1, $2, $3, $4, $5, NOW()) 
        RETURNING *`,
        [
          uuidv4(),
          data.user_id,
          data.order_id,
          data.action_type,
          JSON.stringify(data.action_details)
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error logging staff action:', error);
      throw error;
    }
  }

  /**
   * ดึงประวัติการกระทำของพนักงานตาม Order ID
   */
  static async getActionsByOrderId(orderId: string): Promise<StaffAction[]> {
    try {
      const result = await this.pool.query(
        `SELECT sa.*, u.username, u.full_name 
        FROM staff_actions sa
        JOIN users u ON sa.user_id = u.id
        WHERE sa.order_id = $1 
        ORDER BY sa.created_at DESC`,
        [orderId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error fetching staff actions by order ID:', error);
      throw error;
    }
  }

  /**
   * ดึงประวัติการกระทำของพนักงานตาม User ID
   */
  static async getActionsByUserId(
    userId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<StaffAction[]> {
    try {
      const result = await this.pool.query(
        `SELECT sa.*, o.order_number 
        FROM staff_actions sa
        JOIN orders o ON sa.order_id = o.id
        WHERE sa.user_id = $1 
        ORDER BY sa.created_at DESC
        LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error fetching staff actions by user ID:', error);
      throw error;
    }
  }

  /**
   * นับจำนวนการกระทำของพนักงานตามประเภท
   */
  static async countActionsByType(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ action_type: string; count: number }[]> {
    try {
      const result = await this.pool.query(
        `SELECT action_type, COUNT(*) as count
        FROM staff_actions
        WHERE user_id = $1
          AND created_at BETWEEN $2 AND $3
        GROUP BY action_type`,
        [userId, startDate, endDate]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error counting staff actions by type:', error);
      throw error;
    }
  }
}

// backend/src/models/TemperatureLogExtended.ts
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

  /**
   * รับข้อมูลสถิติอุณหภูมิตาม Order ID
   */
  static async getTemperatureStats(orderId: string): Promise<{
    min: number;
    max: number;
    avg: number;
    count: number;
    alertCount: number;
    lastLocation: string | null;
    lastRecordedBy: string | null;
  }> {
    try {
      const result = await this.pool.query(
        `SELECT 
          MIN(temperature) as min,
          MAX(temperature) as max,
          AVG(temperature) as avg,
          COUNT(*) as count,
          SUM(CASE WHEN is_alert = true THEN 1 ELSE 0 END) as alert_count
        FROM temperature_logs_extended
        WHERE order_id = $1`,
        [orderId]
      );
      
      const latestRecord = await this.findLatestByOrderId(orderId);
      
      if (result.rows.length === 0) {
        return {
          min: 0,
          max: 0,
          avg: 0,
          count: 0,
          alertCount: 0,
          lastLocation: null,
          lastRecordedBy: null
        };
      }
      
      return {
        min: parseFloat(result.rows[0].min) || 0,
        max: parseFloat(result.rows[0].max) || 0,
        avg: parseFloat(result.rows[0].avg) || 0,
        count: parseInt(result.rows[0].count, 10) || 0,
        alertCount: parseInt(result.rows[0].alert_count, 10) || 0,
        lastLocation: latestRecord?.location || null,
        lastRecordedBy: latestRecord?.full_name || null
      };
    } catch (error) {
      console.error('Error getting extended temperature stats:', error);
      throw error;
    }
  }

  /**
   * สร้างกราฟข้อมูลอุณหภูมิตาม Order ID (รายวัน)
   */
  static async getTemperatureChartData(
    orderId: string, 
    days: number = 7
  ): Promise<{ timestamp: string; temperature: number; humidity: number | null }[]> {
    try {
      const result = await this.pool.query(
        `SELECT 
          to_char(timestamp, 'YYYY-MM-DD HH24:MI:SS') as timestamp_str,
          temperature,
          humidity
        FROM temperature_logs_extended
        WHERE order_id = $1
          AND timestamp >= NOW() - INTERVAL '${days} days'
        ORDER BY timestamp ASC`,
        [orderId]
      );
      
      return result.rows.map(row => ({
        timestamp: row.timestamp_str,
        temperature: parseFloat(row.temperature),
        humidity: row.humidity ? parseFloat(row.humidity) : null
      }));
    } catch (error) {
      console.error('Error getting temperature chart data:', error);
      throw error;
    }
  }
}

// backend/src/models/ShipmentStatus.ts
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';

export interface ShipmentStatus {
  id: string;
  order_id: string;
  status: string;
  location: string;
  timestamp: Date;
  notes?: string;
  updated_by: string;
  latitude?: number;
  longitude?: number;
  vehicle_id?: string;
}

export class ShipmentStatusModel {
  private static pool: Pool = db;

  /**
   * สร้างสถานะการขนส่งใหม่
   */
  static async create(data: Omit<ShipmentStatus, 'id' | 'timestamp'>): Promise<ShipmentStatus> {
    try {
      const result = await this.pool.query(
        `INSERT INTO shipment_statuses 
        (id, order_id, status, location, notes, updated_by, latitude, longitude, vehicle_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          uuidv4(),
          data.order_id,
          data.status,
          data.location,
          data.notes || null,
          data.updated_by,
          data.latitude || null,
          data.longitude || null,
          data.vehicle_id || null
        ]
      );

      // อัปเดตสถานะในตาราง orders
      await this.pool.query(
        `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
        [data.status, data.order_id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating shipment status:', error);
      throw error;
    }
  }

  /**
   * ค้นหาสถานะการขนส่งตาม Order ID
   */
  static async findByOrderId(orderId: string): Promise<ShipmentStatus[]> {
    try {
      const result = await this.pool.query(
        `SELECT ss.*, u.username, u.full_name 
        FROM shipment_statuses ss
        LEFT JOIN users u ON ss.updated_by = u.id
        WHERE ss.order_id = $1 
        ORDER BY ss.timestamp DESC`,
        [orderId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error finding shipment statuses by order ID:', error);
      throw error;
    }
  }

  /**
   * ค้นหาสถานะการขนส่งล่าสุดตาม Order ID
   */
  static async findLatestByOrderId(orderId: string): Promise<ShipmentStatus | null> {
    try {
      const result = await this.pool.query(
        `SELECT ss.*, u.username, u.full_name 
        FROM shipment_statuses ss
        LEFT JOIN users u ON ss.updated_by = u.id
        WHERE ss.order_id = $1 
        ORDER BY ss.timestamp DESC 
        LIMIT 1`,
        [orderId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding latest shipment status by order ID:', error);
      throw error;
    }
  }

  /**
   * ค้นหาสถานะการขนส่งล่าสุดตามสถานะ
   */
  static async findByStatus(
    status: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<(ShipmentStatus & { order_number: string })[]> {
    try {
      const result = await this.pool.query(
        `SELECT ss.*, u.username, u.full_name, o.order_number
        FROM shipment_statuses ss
        LEFT JOIN users u ON ss.updated_by = u.id
        JOIN orders o ON ss.order_id = o.id
        WHERE ss.status = $1 
        ORDER BY ss.timestamp DESC 
        LIMIT $2 OFFSET $3`,
        [status, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error finding shipment statuses by status:', error);
      throw error;
    }
  }

  /**
   * ค้นหาสถานะการขนส่งล่าสุดตามตำแหน่ง
   */
  static async findByLocation(
    location: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<(ShipmentStatus & { order_number: string })[]> {
    try {
      const result = await this.pool.query(
        `SELECT ss.*, u.username, u.full_name, o.order_number
        FROM shipment_statuses ss
        LEFT JOIN users u ON ss.updated_by = u.id
        JOIN orders o ON ss.order_id = o.id
        WHERE ss.location ILIKE $1 
        ORDER BY ss.timestamp DESC 
        LIMIT $2 OFFSET $3`,
        [`%${location}%`, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error finding shipment statuses by location:', error);
      throw error;
    }
  }

  /**
   * รวมข้อมูลสถานะการขนส่งและอุณหภูมิล่าสุดสำหรับการแสดงในแดชบอร์ด
   */
  static async getDashboardData(
    limit: number = 50, 
    offset: number = 0
  ): Promise<any[]> {
    try {
      const result = await this.pool.query(
        `WITH latest_statuses AS (
          SELECT DISTINCT ON (order_id) 
            ss.order_id, 
            ss.status, 
            ss.location, 
            ss.timestamp,
            ss.latitude,
            ss.longitude
          FROM shipment_statuses ss
          ORDER BY ss.order_id, ss.timestamp DESC
        ),
        latest_temps AS (
          SELECT DISTINCT ON (order_id) 
            tl.order_id, 
            tl.temperature, 
            tl.humidity, 
            tl.is_alert,
            tl.timestamp as temp_timestamp
          FROM temperature_logs_extended tl
          ORDER BY tl.order_id, tl.timestamp DESC
        )
        SELECT 
          o.id as order_id,
          o.order_number,
          o.sender_name,
          o.recipient_name,
          o.estimated_delivery_date,
          o.user_id as customer_id,
          u.full_name as customer_name,
          ls.status,
          ls.location,
          ls.timestamp as status_timestamp,
          ls.latitude,
          ls.longitude,
          lt.temperature,
          lt.humidity,
          lt.is_alert,
          lt.temp_timestamp
        FROM orders o
        LEFT JOIN latest_statuses ls ON o.id = ls.order_id
        LEFT JOIN latest_temps lt ON o.id = lt.order_id
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY 
          CASE WHEN lt.is_alert = true THEN 0 ELSE 1 END,
          ls.timestamp DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
}