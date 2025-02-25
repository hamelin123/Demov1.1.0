import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';

export interface TrackingData {
  id: string;
  order_id: string;
  vehicle_id?: string;
  status: string;
  location?: string;
  timestamp: Date;
  notes?: string;
}

interface CreateTrackingDataInput {
  order_id: string;
  vehicle_id?: string;
  status: string;
  location?: string;
  notes?: string;
}

export class TrackingDataModel {
  private static pool: Pool = db;

  /**
   * สร้างข้อมูลการติดตามใหม่
   */
  static async create(data: CreateTrackingDataInput): Promise<TrackingData> {
    const result = await this.pool.query(
      `INSERT INTO tracking_data 
      (id, order_id, vehicle_id, status, location, notes) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [
        uuidv4(),
        data.order_id,
        data.vehicle_id || null,
        data.status,
        data.location || null,
        data.notes || null
      ]
    );

    return result.rows[0];
  }

  /**
   * ค้นหาข้อมูลการติดตามตาม ID
   */
  static async findById(id: string): Promise<TrackingData | null> {
    const result = await this.pool.query('SELECT * FROM tracking_data WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ค้นหาข้อมูลการติดตามทั้งหมดของคำสั่งซื้อ
   */
  static async findByOrderId(orderId: string): Promise<TrackingData[]> {
    const result = await this.pool.query(
      'SELECT * FROM tracking_data WHERE order_id = $1 ORDER BY timestamp DESC',
      [orderId]
    );
    
    return result.rows;
  }

  /**
   * ค้นหาข้อมูลการติดตามล่าสุดของคำสั่งซื้อ
   */
  static async findLatestByOrderId(orderId: string): Promise<TrackingData | null> {
    const result = await this.pool.query(
      'SELECT * FROM tracking_data WHERE order_id = $1 ORDER BY timestamp DESC LIMIT 1',
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * อัปเดตข้อมูลการติดตาม
   */
  static async update(id: string, data: Partial<CreateTrackingDataInput>): Promise<TrackingData | null> {
    // สร้าง query สำหรับฟิลด์ที่ต้องการอัปเดต
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return null;
    }
    
    // เพิ่ม ID เป็นพารามิเตอร์สุดท้าย
    values.push(id);

    const query = `
      UPDATE tracking_data 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ลบข้อมูลการติดตาม
   */
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM tracking_data WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  /**
   * ค้นหาข้อมูลการติดตามตามสถานะ
   */
  static async findByStatus(status: string, limit: number = 100, offset: number = 0): Promise<TrackingData[]> {
    const result = await this.pool.query(
      'SELECT * FROM tracking_data WHERE status = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );
    
    return result.rows;
  }
}