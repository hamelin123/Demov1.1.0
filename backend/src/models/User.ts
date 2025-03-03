import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
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
  company?: string;  // เพิ่ม company
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private static pool: Pool = db;

  /**
   * สร้างผู้ใช้ใหม่
   */
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      // เข้ารหัสรหัสผ่าน (ถ้าไม่ได้เข้ารหัสมาแล้ว)
      const password = userData.password.startsWith('$2b$') ? 
        userData.password : 
        await bcrypt.hash(userData.password, 10);
  
      const result = await this.pool.query(
        `INSERT INTO users 
        (id, username, email, password, full_name, role, phone_number, address, company) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          uuidv4(),
          userData.username,
          userData.email,
          password,
          userData.full_name,
          userData.role || 'user',
          userData.phone_number || null,
          userData.address || null,
          userData.company || null  // เพิ่มพารามิเตอร์ company
        ]
      );
  
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * ค้นหาผู้ใช้ทั้งหมด (สำหรับ admin) พร้อมการแบ่งหน้าและการค้นหา
   */
  static async findAllWithPagination(
    limit: number = 10, 
    offset: number = 0,
    searchQuery: string = '',
    sortBy: string = 'created_at',
    sortDirection: string = 'desc'
  ): Promise<{ users: User[], total: number }> {
    try {
      // ตรวจสอบให้แน่ใจว่าชื่อคอลัมน์ที่จะใช้เรียงลำดับถูกต้อง เพื่อป้องกัน SQL Injection
      const validColumns = ['username', 'email', 'full_name', 'role', 'status', 'created_at', 'updated_at'];
      if (!validColumns.includes(sortBy)) {
        sortBy = 'created_at';
      }
      
      // ตรวจสอบทิศทางการเรียงลำดับ
      if (sortDirection !== 'asc' && sortDirection !== 'desc') {
        sortDirection = 'desc';
      }

      let queryParams = [];
      let whereClause = '';
      
      // ถ้ามีคำค้นหา ให้เพิ่ม WHERE clause
      if (searchQuery) {
        whereClause = `
          WHERE 
            LOWER(username) LIKE LOWER($1) OR
            LOWER(email) LIKE LOWER($1) OR
            LOWER(full_name) LIKE LOWER($1) OR
            LOWER(phone_number) LIKE LOWER($1)
        `;
        queryParams.push(`%${searchQuery}%`);
      }

      // ดึงจำนวนผู้ใช้ทั้งหมดที่ตรงกับเงื่อนไขการค้นหา
      const countResult = await this.pool.query(
        `SELECT COUNT(*) FROM users ${whereClause}`,
        queryParams
      );
      
      const total = parseInt(countResult.rows[0].count, 10);

      // เพิ่มพารามิเตอร์สำหรับ LIMIT และ OFFSET
      const dataQueryParams = [...queryParams];
      if (queryParams.length > 0) {
        dataQueryParams.push(limit, offset);
      } else {
        dataQueryParams.push(limit, offset);
      }

      // ดึงข้อมูลผู้ใช้
      const dataResult = await this.pool.query(
        `SELECT * FROM users 
        ${whereClause} 
        ORDER BY ${sortBy} ${sortDirection} 
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
        dataQueryParams
      );
      
      return { users: dataResult.rows, total };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * ค้นหาผู้ใช้ทั้งหมด
   */
  static async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * ค้นหาผู้ใช้ตาม ID
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * ค้นหาผู้ใช้ตามอีเมล
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * ค้นหาผู้ใช้ตามชื่อผู้ใช้
   */
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  /**
   * อัปเดตข้อมูลผู้ใช้
   */
  static async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const user = await this.findById(id);
      
      if (!user) {
        return null;
      }

      // จัดการรหัสผ่าน (เข้ารหัสถ้าจำเป็น)
      if (userData.password && !userData.password.startsWith('$2b$')) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      // สร้าง query สำหรับ fields ที่ต้องการอัปเดต
      Object.entries(userData).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && value !== undefined) {
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
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * ลบผู้ใช้
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * ลบผู้ใช้หลายคน
   */
  static async deleteMultiple(ids: string[]): Promise<number> {
    try {
      // ใช้ IN clause กับ parametrized query
      const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
      const result = await this.pool.query(
        `DELETE FROM users WHERE id IN (${placeholders})`,
        ids
      );
      return result.rowCount;
    } catch (error) {
      console.error('Error deleting multiple users:', error);
      throw error;
    }
  }

  /**
   * ตรวจสอบการเข้าสู่ระบบ
   */
  static async validateCredentials(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);

      if (!user) {
        return null;
      }

      // ตรวจสอบว่าผู้ใช้อยู่ในสถานะ active
      // if (user.status === 'inactive') {
      //   return null;
      // }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error validating credentials:', error);
      throw error;
    }
  }

  /**
   * เปลี่ยนสถานะผู้ใช้
   */
  static async updateStatus(id: string, status: 'active' | 'inactive'): Promise<User | null> {
    try {
      const result = await this.pool.query(
        'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * ลงทะเบียนการเข้าสู่ระบบสำหรับการตรวจสอบความปลอดภัย
   */
  static async logLogin(userId: string, success: boolean, ipAddress: string, userAgent: string): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO login_logs 
        (user_id, success, ip_address, user_agent) 
        VALUES ($1, $2, $3, $4)`,
        [userId, success, ipAddress, userAgent]
      );
    } catch (error) {
      console.error('Error logging login:', error);
      // ไม่ throw error เพื่อไม่ให้กระทบกับการล็อกอิน
    }
  }

  /**
   * อัปเดตเวลาเข้าสู่ระบบล่าสุด
   */
  static async updateLastLogin(id: string): Promise<void> {
    try {
      await this.pool.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [id]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      // ไม่ throw error เพื่อไม่ให้กระทบกับการล็อกอิน
    }
  }

  /**
   * นับจำนวนผู้ใช้ตามบทบาท
   */
  static async countByRole(): Promise<{ role: string; count: number }[]> {
    try {
      const result = await this.pool.query(
        'SELECT role, COUNT(*) FROM users GROUP BY role'
      );
      
      return result.rows.map(row => ({
        role: row.role,
        count: parseInt(row.count, 10)
      }));
    } catch (error) {
      console.error('Error counting users by role:', error);
      throw error;
    }
  }

  /**
   * นับจำนวนผู้ใช้ที่ลงทะเบียนในช่วงเวลาที่กำหนด
   */
  static async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    try {
      const result = await this.pool.query(
        'SELECT COUNT(*) FROM users WHERE created_at BETWEEN $1 AND $2',
        [startDate, endDate]
      );
      
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error counting users by date range:', error);
      throw error;
    }
  }
}