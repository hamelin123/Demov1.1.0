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
    user_id: string;