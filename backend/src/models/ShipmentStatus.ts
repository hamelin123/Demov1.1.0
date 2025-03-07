// src/models/ShipmentStatus.ts
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
}