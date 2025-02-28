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

  // Create tracking data
  static async create(data: CreateTrackingDataInput): Promise<TrackingData> {
    const result = await this.pool.query(
      `INSERT INTO tracking_data 
      (id, order_id, vehicle_id, status, location, notes) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [
        uuidv4(), data.order_id, data.vehicle_id || null,
        data.status, data.location || null, data.notes || null
      ]
    );
    return result.rows[0];
  }

  // Find by ID
  static async findById(id: string): Promise<TrackingData | null> {
    const result = await this.pool.query('SELECT * FROM tracking_data WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Find all by order ID
  static async findByOrderId(orderId: string): Promise<TrackingData[]> {
    const result = await this.pool.query(
      'SELECT * FROM tracking_data WHERE order_id = $1 ORDER BY timestamp DESC',
      [orderId]
    );
    return result.rows;
  }

  // Find latest by order ID
  static async findLatestByOrderId(orderId: string): Promise<TrackingData | null> {
    const result = await this.pool.query(
      'SELECT * FROM tracking_data WHERE order_id = $1 ORDER BY timestamp DESC LIMIT 1',
      [orderId]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  // Update tracking data
  static async update(id: string, data: Partial<CreateTrackingDataInput>): Promise<TrackingData | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build dynamic query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (!fields.length) return null;
    
    values.push(id);
    const query = `UPDATE tracking_data SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await this.pool.query(query, values);
    
    return result.rows.length ? result.rows[0] : null;
  }

  // Delete tracking data
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM tracking_data WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Find by status
  static async findByStatus(status: string, limit: number = 100, offset: number = 0): Promise<TrackingData[]> {
    const result = await this.pool.query(
      'SELECT * FROM tracking_data WHERE status = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );
    return result.rows;
  }
}