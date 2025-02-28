import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  sender_name: string;
  sender_address: string;
  sender_phone: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  package_weight: number;
  package_dimensions?: string;
  special_instructions?: string;
  created_at: Date;
  updated_at: Date;
  estimated_delivery_date?: Date;
}

interface CreateOrderData {
  user_id: string;
  sender_name: string;
  sender_address: string;
  sender_phone: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  package_weight: number;
  package_dimensions?: string;
  special_instructions?: string;
  estimated_delivery_date?: Date;
}

export class OrderModel {
  private static pool: Pool = db;

  // Generate order number
  private static generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CC-${year}${month}${day}-${random}`;
  }

  // Create new order
  static async create(orderData: CreateOrderData): Promise<Order> {
    const orderNumber = this.generateOrderNumber();
    const result = await this.pool.query(
      `INSERT INTO orders 
      (id, user_id, order_number, status, sender_name, sender_address, sender_phone, 
       recipient_name, recipient_address, recipient_phone, package_weight, 
       package_dimensions, special_instructions, estimated_delivery_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING *`,
      [
        uuidv4(), orderData.user_id, orderNumber, 'pending',
        orderData.sender_name, orderData.sender_address, orderData.sender_phone,
        orderData.recipient_name, orderData.recipient_address, orderData.recipient_phone,
        orderData.package_weight, orderData.package_dimensions,
        orderData.special_instructions, orderData.estimated_delivery_date
      ]
    );
    return result.rows[0];
  }

  // Find order by ID
  static async findById(id: string): Promise<Order | null> {
    const result = await this.pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Find order by order number
  static async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const result = await this.pool.query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Find all orders by user ID
  static async findByUserId(userId: string): Promise<Order[]> {
    const result = await this.pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', 
      [userId]
    );
    return result.rows;
  }

  // Update order status
  static async updateStatus(id: string, status: string): Promise<Order | null> {
    const result = await this.pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  // Update order details
  static async update(id: string, orderData: Partial<CreateOrderData>): Promise<Order | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build dynamic query for fields to update
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (!fields.length) return null;

    // Add updated_at and ID
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await this.pool.query(query, values);
    
    return result.rows.length ? result.rows[0] : null;
  }

  // Delete order
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM orders WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Find all orders (admin)
  static async findAll(limit: number = 100, offset: number = 0): Promise<Order[]> {
    const result = await this.pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }
}