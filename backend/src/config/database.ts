import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  database: process.env.DB_NAME || 'coldchain_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool(dbConfig);

// Retry connection function
const connectWithRetry = (maxRetries = 5) => {
  let retries = 0;
  
  const attemptConnection = () => {
    pool.connect()
      .then(client => {
        client.query('SELECT NOW()', [], (err, result) => {
          client.release();
          if (err) throw err;
          console.log('Database connected:', result.rows[0]);
        });
      })
      .catch(err => {
        if (++retries < maxRetries) {
          console.log(`Retrying in 5 seconds... (${retries}/${maxRetries})`);
          setTimeout(attemptConnection, 5000);
        } else {
          console.error('Max retries reached. Could not connect to database.');
          console.error('Check connection parameters:', dbConfig);
        }
      });
  };

  attemptConnection();
};

// Combined table creation function
export const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create tables
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS users (
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
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
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
      )`,
      `CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_number VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        capacity NUMERIC(8, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        driver_name VARCHAR(100),
        driver_phone VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS tracking_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        vehicle_id UUID REFERENCES vehicles(id),
        status VARCHAR(50) NOT NULL,
        location TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS temperature_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        temperature NUMERIC(5, 2) NOT NULL,
        humidity NUMERIC(5, 2),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_alert BOOLEAN DEFAULT FALSE
      )`
    ];
    
    for (const query of tableQueries) {
      await client.query(query);
    }
    
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

// Seed data 
export const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Check if admin user exists
    const adminCount = await client.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    
    if (parseInt(adminCount.rows[0].count) === 0) {
      const adminId = uuidv4();
      await client.query(
        `INSERT INTO users (id, username, email, password, full_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [adminId, 'admin', 'admin@coldchain.com', await bcrypt.hash('Admin@123', 10), 'Admin User', 'admin']
      );
      console.log('Admin user created');
    }

    // Check if test user exists
    const userCount = await client.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
    
    if (parseInt(userCount.rows[0].count) === 0) {
      const userId = uuidv4();
      
      // Create test user
      await client.query(
        `INSERT INTO users (id, username, email, password, full_name, role, phone_number, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId, 'testuser', 'user@coldchain.com', 
          await bcrypt.hash('User@123', 10), 'Test User', 'user',
          '0912345678', 'Test Address, Bangkok, Thailand'
        ]
      );
      console.log('Test user created');

      // Create sample order
      const orderId = uuidv4();
      const orderNumber = `CC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-1234`;
      
      await client.query(
        `INSERT INTO orders (
          id, user_id, order_number, status, sender_name, sender_address, sender_phone,
          recipient_name, recipient_address, recipient_phone, package_weight,
          package_dimensions, special_instructions, estimated_delivery_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          orderId, userId, orderNumber, 'In Transit',
          'Test Sender', 'Sender Address, Bangkok, Thailand', '0912345678',
          'Test Recipient', 'Recipient Address, Chiang Mai, Thailand', '0987654321',
          5.5, '30x40x20 cm', 'Handle with care, temperature sensitive',
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        ]
      );
      console.log('Sample order created');

      // Create sample tracking data
      await client.query(
        `INSERT INTO tracking_data (order_id, status, location, notes)
         VALUES ($1, $2, $3, $4)`,
        [orderId, 'Order Created', 'Bangkok Distribution Center', 'Order has been received and is being processed']
      );

      await client.query(
        `INSERT INTO tracking_data (order_id, status, location, notes, timestamp)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          orderId, 'In Transit', 'Bangkok Logistics Hub', 
          'Order has left the distribution center',
          new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        ]
      );
      console.log('Sample tracking data created');

      // Create sample temperature logs
      const tempLogTimes = [
        new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        new Date() // now
      ];
      
      const tempLogs = [
        { temp: 4.5, humidity: 65.2, time: tempLogTimes[0] },
        { temp: 5.1, humidity: 63.8, time: tempLogTimes[1] },
        { temp: 4.8, humidity: 64.5, time: null }
      ];
      
      for (const log of tempLogs) {
        if (log.time) {
          await client.query(
            `INSERT INTO temperature_logs (order_id, temperature, humidity, timestamp)
             VALUES ($1, $2, $3, $4)`,
            [orderId, log.temp, log.humidity, log.time]
          );
        } else {
          await client.query(
            `INSERT INTO temperature_logs (order_id, temperature, humidity)
             VALUES ($1, $2, $3)`,
            [orderId, log.temp, log.humidity]
          );
        }
      }
      console.log('Sample temperature logs created');

      // Create sample vehicle
      const vehicleId = uuidv4();
      await client.query(
        `INSERT INTO vehicles (id, vehicle_number, type, capacity, status, driver_name, driver_phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [vehicleId, 'TH-12345', 'Refrigerated Truck', 1500.0, 'Active', 'Driver Name', '0912345678']
      );
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

export const initializeDatabase = async () => {
  try {
    await createTables();
    await seedData();
    return true;
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

connectWithRetry();
export const db = pool;
export default { db, initializeDatabase };