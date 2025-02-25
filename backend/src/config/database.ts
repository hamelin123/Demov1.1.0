import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// ตั้งค่าการเชื่อมต่อกับฐานข้อมูล PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // แก้จาก 'localhost' เป็น 'postgres'
  host: process.env.DB_HOST || 'host.docker.internal', // สำหรับ Docker
  database: process.env.DB_NAME || 'coldchain_db',
  password: process.env.DB_PASSWORD || 'postgres', // ใช้รหัสผ่านตาม docker-compose
  port: parseInt(process.env.DB_PORT || '5432'),
});

// เพิ่ม Retry Connection
const connectWithRetry = (maxRetries = 5) => {
  let retries = 0;
  
  const attemptConnection = () => {
    pool.connect()
      .then(() => {
        console.log('Connected to PostgreSQL database successfully');
        return pool.query('SELECT NOW()'); // เพิ่มการตรวจสอบการทำงานของฐานข้อมูล
      })
      .then(() => console.log('Database query successful'))
      .catch(err => {
        retries++;
        console.error(`Connection attempt ${retries} failed:`, err);
        
        if (retries < maxRetries) {
          console.log(`Retrying in 5 seconds...`);
          setTimeout(attemptConnection, 5000);
        } else {
          console.error('Max retries reached. Could not connect to database.');
          process.exit(1); // ออกจากโปรแกรมหากเชื่อมต่อไม่สำเร็จ
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
  try {
    // ตรวจสอบการเชื่อมต่อก่อนสร้างตาราง
    await pool.connect();
    console.log('Database connection established before table creation');

    // สร้างตาราง users (และตารางอื่นๆ คงเดิม)
    await pool.query(`
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

    // สร้างตารางอื่นๆ คงเดิม...

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    
    // บันทึก error อย่างละเอียด
    console.error('Detailed Error:', {
      message: error.message,
      stack: error.stack,
      connectionParams: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });

    throw error;
  }
};

// เรียกใช้ Retry Connection
connectWithRetry();