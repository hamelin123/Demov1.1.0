// src/config/database.ts
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

// กำหนดค่า connection configuration สำหรับเชื่อมต่อกับ PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  database: process.env.DB_NAME || 'coldchain_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// เพิ่ม Retry Connection
const connectWithRetry = (maxRetries = 5) => {
  let retries = 0;
  
  const attemptConnection = () => {
    pool.connect()
      .then(client => {
        console.log('Connected to PostgreSQL database successfully');
        // ทดสอบการ query เพื่อตรวจสอบว่าการเชื่อมต่อทำงานจริง
        return client.query('SELECT NOW()', [], (err, result) => {
          client.release();
          if (err) {
            throw err;
          }
          console.log('Database query successful:', result.rows[0]);
        });
      })
      .catch(err => {
        retries++;
        console.error(`Connection attempt ${retries} failed:`, err);
        
        if (retries < maxRetries) {
          console.log(`Retrying in 5 seconds...`);
          setTimeout(attemptConnection, 5000);
        } else {
          console.error('Max retries reached. Could not connect to database.');
          console.error('Please check your database connection parameters:');
          console.error({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            database: process.env.DB_NAME || 'coldchain_db',
            user: process.env.DB_USER || 'postgres'
          });
        }
      });
  };

  attemptConnection();
};

export const db = pool;

/**
 * สร้างตารางในฐานข้อมูล
 */
export const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    // สร้างตาราง users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        phone_number VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // สร้างตาราง orders
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(50) NOT NULL,
        sender_name VARCHAR(100) NOT NULL,
        sender_address TEXT NOT NULL,
        sender_phone VARCHAR(20) NOT NULL,
        recipient_name VARCHAR(100) NOT NULL,
        recipient_address TEXT NOT NULL,
        recipient_phone VARCHAR(20) NOT NULL,
        package_weight NUMERIC(8, 2) NOT NULL,
        package_dimensions VARCHAR(50),
        special_instructions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        estimated_delivery_date TIMESTAMP WITH TIME ZONE
      )
    `);

    // สร้างตาราง vehicles
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_number VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        capacity NUMERIC(8, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        driver_name VARCHAR(100),
        driver_phone VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // สร้างตาราง tracking_data
    await client.query(`
      CREATE TABLE IF NOT EXISTS tracking_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        vehicle_id UUID REFERENCES vehicles(id),
        status VARCHAR(50) NOT NULL,
        location TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT
      )
    `);

    // สร้างตาราง temperature_logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS temperature_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        temperature NUMERIC(5, 2) NOT NULL,
        humidity NUMERIC(5, 2),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_alert BOOLEAN DEFAULT FALSE
      )
    `);

    await client.query('COMMIT');
    console.log('All tables created successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', err);
    throw err;
  } finally {
    client.release();
  }
};

/**
 * สร้างข้อมูลตัวอย่าง
 */
export const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // ตรวจสอบว่ามี admin user อยู่แล้วหรือไม่
    const adminCheck = await client.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    
    if (adminCheck.rows.length === 0) {
      // สร้าง admin user
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      const adminId = uuidv4();
      
      await client.query(`
        INSERT INTO users (id, username, email, password, full_name, role)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        adminId,
        'admin',
        'admin@coldchain.com',
        adminPassword,
        'Admin User',
        'admin'
      ]);
      
      console.log('Admin user created');
    }

    // ตรวจสอบว่ามี test user อยู่แล้วหรือไม่
    const userCheck = await client.query("SELECT * FROM users WHERE role = 'user' LIMIT 1");
    
    if (userCheck.rows.length === 0) {
      // สร้าง test user
      const userPassword = await bcrypt.hash('User@123', 10);
      const userId = uuidv4();
      
      await client.query(`
        INSERT INTO users (id, username, email, password, full_name, role, phone_number, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        userId,
        'testuser',
        'user@coldchain.com',
        userPassword,
        'Test User',
        'user',
        '0912345678',
        'Test Address, Bangkok, Thailand'
      ]);
      
      console.log('Test user created');

      // สร้างตัวอย่างคำสั่งซื้อ
      const orderId = uuidv4();
      const orderNumber = `CC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-1234`;
      
      await client.query(`
        INSERT INTO orders (
          id, user_id, order_number, status, sender_name, sender_address, sender_phone,
          recipient_name, recipient_address, recipient_phone, package_weight,
          package_dimensions, special_instructions, estimated_delivery_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        orderId,
        userId,
        orderNumber,
        'In Transit',
        'Test Sender',
        'Sender Address, Bangkok, Thailand',
        '0912345678',
        'Test Recipient',
        'Recipient Address, Chiang Mai, Thailand',
        '0987654321',
        5.5,
        '30x40x20 cm',
        'Handle with care, temperature sensitive',
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 วันจากนี้
      ]);
      
      console.log('Sample order created');

      // สร้างตัวอย่างข้อมูลการติดตาม
      await client.query(`
        INSERT INTO tracking_data (order_id, status, location, notes)
        VALUES ($1, $2, $3, $4)
      `, [
        orderId,
        'Order Created',
        'Bangkok Distribution Center',
        'Order has been received and is being processed'
      ]);

      await client.query(`
        INSERT INTO tracking_data (order_id, status, location, notes, timestamp)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        orderId,
        'In Transit',
        'Bangkok Logistics Hub',
        'Order has left the distribution center',
        new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 ชั่วโมงที่แล้ว
      ]);
      
      console.log('Sample tracking data created');

      // สร้างตัวอย่างบันทึกอุณหภูมิ
      await client.query(`
        INSERT INTO temperature_logs (order_id, temperature, humidity, timestamp)
        VALUES ($1, $2, $3, $4)
      `, [
        orderId,
        4.5,
        65.2,
        new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 ชั่วโมงที่แล้ว
      ]);

      await client.query(`
        INSERT INTO temperature_logs (order_id, temperature, humidity, timestamp)
        VALUES ($1, $2, $3, $4)
      `, [
        orderId,
        5.1,
        63.8,
        new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 ชั่วโมงที่แล้ว
      ]);

      await client.query(`
        INSERT INTO temperature_logs (order_id, temperature, humidity)
        VALUES ($1, $2, $3)
      `, [
        orderId,
        4.8,
        64.5
      ]);
      
      console.log('Sample temperature logs created');

      // สร้างตัวอย่างยานพาหนะ
      const vehicleId = uuidv4();
      
      await client.query(`
        INSERT INTO vehicles (
          id, vehicle_number, type, capacity, status, driver_name, driver_phone
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        vehicleId,
        'TH-12345',
        'Refrigerated Truck',
        1500.0,
        'Active',
        'Driver Name',
        '0912345678'
      ]);
      
      console.log('Sample vehicle created');
    }

    await client.query('COMMIT');
    console.log('Sample data seeded successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', err);
    throw err;
  } finally {
    client.release();
  }
};

/**
 * เริ่มต้นฐานข้อมูล
 */
export const initializeDatabase = async () => {
  try {
    await createTables();
    await seedData();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

// เรียกใช้ Retry Connection เมื่อเริ่มต้นแอพพลิเคชัน
connectWithRetry();

// Export สำหรับใช้ในส่วนอื่นของแอปพลิเคชัน
export default { db, initializeDatabase };