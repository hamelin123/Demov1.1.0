// src/models/Staff.ts
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