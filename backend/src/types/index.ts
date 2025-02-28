// backend/src/types/index.ts
export interface UserData {
    id: string;
    username: string;
    email: string;
    full_name: string;
    role: 'admin' | 'staff' | 'user';
    status: 'active' | 'inactive';
    phone_number?: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface OrderData {
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
  
  export interface TemperatureLogData {
    id: string;
    order_id: string;
    staff_id?: string;
    temperature: number;
    humidity?: number;
    timestamp: Date;
    is_alert: boolean;
    input_method: 'manual' | 'iot';
    device_id?: string;
    notes?: string;
  }
  
  export interface TrackingData {
    id: string;
    order_id: string;
    vehicle_id?: string;
    status: string;
    location?: string;
    timestamp: Date;
    notes?: string;
  }