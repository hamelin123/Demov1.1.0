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
    return `ORDER-${uuidv4().substr(24).toUpperCase()}`;
  }
// backend/src/models/Order.ts