// backend/src/migrations/runMigration.ts
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'coldchain_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function runMigration(filePath: string) {
  const client = await pool.connect();
  
  try {
    // อ่านไฟล์ SQL
    const sql = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    
    console.log(`Running migration: ${filePath}`);
    
    // เริ่ม transaction
    await client.query('BEGIN');
    
    // รันคำสั่ง SQL
    await client.query(sql);
    
    // ยืนยัน transaction
    await client.query('COMMIT');
    
    console.log(`Migration ${filePath} completed successfully`);
  } catch (err) {
    // ยกเลิก transaction หากเกิดข้อผิดพลาด
    await client.query('ROLLBACK');
    console.error(`Migration ${filePath} failed:`, err);
    throw err;
  } finally {
    client.release();
  }
}

// รันไฟล์ migration
async function main() {
  try {
    await runMigration('create_staff_tables.sql');
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

// เรียกใช้งานเมื่อรันไฟล์โดยตรง
if (require.main === module) {
  main();
}

export { runMigration };