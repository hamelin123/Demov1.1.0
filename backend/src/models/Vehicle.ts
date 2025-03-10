import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';

export interface Vehicle {
  id: string;
  vehicle_number: string;
  type: string;
  capacity: number;
  status: string;
  driver_name?: string;
  driver_phone?: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateVehicleInput {
  vehicle_number: string;
  type: string;
  capacity: number;
  status: string;
  driver_name?: string;
  driver_phone?: string;
}

export class VehicleModel {
  private static pool: Pool = db;

  /**
   * สร้างยานพาหนะใหม่
   */
  static async create(data: CreateVehicleInput): Promise<Vehicle> {
    const result = await this.pool.query(
      `INSERT INTO vehicles 
      (id, vehicle_number, type, capacity, status, driver_name, driver_phone) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        uuidv4(),
        data.vehicle_number,
        data.type,
        data.capacity,
        data.status,
        data.driver_name || null,
        data.driver_phone || null
      ]
    );

    return result.rows[0];
  }

  /**
   * ค้นหายานพาหนะตาม ID
   */
  static async findById(id: string): Promise<Vehicle | null> {
    const result = await this.pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ค้นหายานพาหนะตามหมายเลขยานพาหนะ
   */
  static async findByVehicleNumber(vehicleNumber: string): Promise<Vehicle | null> {
    const result = await this.pool.query('SELECT * FROM vehicles WHERE vehicle_number = $1', [vehicleNumber]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ค้นหายานพาหนะทั้งหมด
   */
  static async findAll(limit: number = 100, offset: number = 0): Promise<Vehicle[]> {
    const result = await this.pool.query(
      'SELECT * FROM vehicles ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows;
  }

  /**
   * ค้นหายานพาหนะตามสถานะ
   */
  static async findByStatus(status: string): Promise<Vehicle[]> {
    const result = await this.pool.query(
      'SELECT * FROM vehicles WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    
    return result.rows;
  }

  /**
   * อัปเดตข้อมูลยานพาหนะ
   */
  static async update(id: string, data: Partial<CreateVehicleInput>): Promise<Vehicle | null> {
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

    // เพิ่ม updated_at
    updateFields.push(`updated_at = NOW()`);
    
    // เพิ่ม ID เป็นพารามิเตอร์สุดท้าย
    values.push(id);

    const query = `
      UPDATE vehicles 
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
   * อัปเดตสถานะยานพาหนะ
   */
  static async updateStatus(id: string, status: string): Promise<Vehicle | null> {
    const result = await this.pool.query(
      'UPDATE vehicles SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ลบยานพาหนะ
   */
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}