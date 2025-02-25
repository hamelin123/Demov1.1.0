import { Pool } from 'pg';
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
export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // ตรวจสอบการเชื่อมต่อก่อนสร้างตาราง
    console.log('Database connection established before table creation');

    // เริ่ม transaction
    await client.query('BEGIN');

    // สร้าง extension uuid-ossp หากยังไม่มี
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // สร้างตาราง users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

    // commit transaction
    await client.query('COMMIT');
    console.log('Database tables initialized successfully');
  } catch (error) {
    // rollback ในกรณีที่เกิดข้อผิดพลาด
    await client.query('ROLLBACK');
    console.error('Error initializing database tables:', error);
    
    // บันทึก error อย่างละเอียด
    console.error('Detailed Error:', {
      message: error.message,
      stack: error.stack,
      connectionParams: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        database: process.env.DB_NAME || 'coldchain_db',
        user: process.env.DB_USER || 'postgres'
      }
    });

    throw error;
  } finally {
    // คืน client กลับไปที่ pool
    client.release();
  }
};

// เรียกใช้ Retry Connection
// connectWithRetry();

// Export สำหรับใช้ในส่วนอื่นของแอปพลิเคชัน
export default { db, initializeDatabase };