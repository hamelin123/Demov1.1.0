-- backend/src/migrations/create_staff_tables.sql

-- สร้างตารางบันทึกการกระทำของพนักงาน
CREATE TABLE IF NOT EXISTS staff_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  action_details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตารางบันทึกอุณหภูมิแบบขยาย
CREATE TABLE IF NOT EXISTS temperature_logs_extended (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  temperature NUMERIC(5, 2) NOT NULL,
  humidity NUMERIC(5, 2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_alert BOOLEAN DEFAULT FALSE,
  location VARCHAR(200),
  recorded_by UUID REFERENCES users(id),
  notes TEXT,
  device_id VARCHAR(100),
  battery_level INTEGER
);

-- สร้างตารางสถานะการขนส่ง
CREATE TABLE IF NOT EXISTS shipment_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  updated_by UUID REFERENCES users(id),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  vehicle_id UUID REFERENCES vehicles(id)
);

-- สร้าง Indices สำหรับการค้นหาที่รวดเร็ว
CREATE INDEX idx_staff_actions_user_id ON staff_actions(user_id);
CREATE INDEX idx_staff_actions_order_id ON staff_actions(order_id);
CREATE INDEX idx_temperature_logs_extended_order_id ON temperature_logs_extended(order_id);
CREATE INDEX idx_temperature_logs_extended_is_alert ON temperature_logs_extended(is_alert);
CREATE INDEX idx_shipment_statuses_order_id ON shipment_statuses(order_id);
CREATE INDEX idx_shipment_statuses_status ON shipment_statuses(status);
CREATE INDEX idx_shipment_statuses_location ON shipment_statuses(location);