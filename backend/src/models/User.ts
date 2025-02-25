import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { db } from '../config/database';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone_number?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private static pool: Pool = db;

  /**
   * สร้างผู้ใช้ใหม่
   */
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const result = await this.pool.query(
      `INSERT INTO users 
      (username, email, password, full_name, role, phone_number, address) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        userData.username,
        userData.email,
        hashedPassword,
        userData.full_name,
        userData.role || 'user',
        userData.phone_number,
        userData.address
      ]
    );

    return result.rows[0];
  }

  /**
 * ค้นหาผู้ใช้ทั้งหมด (สำหรับ admin)
 */
  static async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const result = await this.pool.query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows;
  }
  /**
   * ค้นหาผู้ใช้ตาม ID
   */
  static async findById(id: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ค้นหาผู้ใช้ตามอีเมล
   */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * ค้นหาผู้ใช้ตามชื่อผู้ใช้
   */
  static async findByUsername(username: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  /**
   * อัปเดตข้อมูลผู้ใช้
   */
  static async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    
    if (!user) {
      return null;
    }

    // จัดการรหัสผ่าน
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // สร้าง query สำหรับ fields ที่ต้องการอัปเดต
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return user;
    }

    values.push(id);
    const result = await this.pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * ลบผู้ใช้
   */
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  /**
   * ตรวจสอบการเข้าสู่ระบบ
   */
  static async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}