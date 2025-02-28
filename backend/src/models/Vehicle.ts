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

  // Create vehicle
  static async create(data: CreateVehicleInput): Promise<Vehicle> {
    const result = await this.pool.query(
      `INSERT INTO vehicles 
      (id, vehicle_number, type, capacity, status, driver_name, driver_phone) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        uuidv4(), data.vehicle_number, data.type, data.capacity,
        data.status, data.driver_name || null, data.driver_phone || null
      ]
    );
    return result.rows[0];
  }

  // Find by ID
  static async findById(id: string): Promise<Vehicle | null> {
    const result = await this.pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Find by vehicle number
  static async findByVehicleNumber(vehicleNumber: string): Promise<Vehicle | null> {
    const result = await this.pool.query('SELECT * FROM vehicles WHERE vehicle_number = $1', [vehicleNumber]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Find all vehicles
  static async findAll(limit: number = 100, offset: number = 0): Promise<Vehicle[]> {
    const result = await this.pool.query(
      'SELECT * FROM vehicles ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  // Find vehicles by status
  static async findByStatus(status: string): Promise<Vehicle[]> {
    const result = await this.pool.query(
      'SELECT * FROM vehicles WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  }

  // Update vehicle
  static async update(id: string, data: Partial<CreateVehicleInput>): Promise<Vehicle | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Dynamic query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (!fields.length) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await this.pool.query(query, values);
    
    return result.rows.length ? result.rows[0] : null;
  }

  // Update vehicle status
  static async updateStatus(id: string, status: string): Promise<Vehicle | null> {
    const result = await this.pool.query(
      'UPDATE vehicles SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  // Delete vehicle
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}