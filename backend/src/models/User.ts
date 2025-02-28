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
  status: string;
  phone_number?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

type UserInput = Omit<User, 'id' | 'created_at' | 'updated_at'>;
type UserUpdate = Partial<UserInput>;

export class UserModel {
  private static pool: Pool = db;

  // Create user
  static async create(userData: UserInput): Promise<User> {
    try {
      // Hash password if not already hashed
      const password = userData.password.startsWith('$2b$') ? 
        userData.password : await bcrypt.hash(userData.password, 10);

      const result = await this.pool.query(
        `INSERT INTO users 
        (id, username, email, password, full_name, role, status, phone_number, address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          uuidv4(), userData.username, userData.email, password,
          userData.full_name, userData.role || 'user', userData.status || 'active',
          userData.phone_number || null, userData.address || null
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find users with pagination and search
  static async findAllWithPagination(
    limit: number = 10, 
    offset: number = 0,
    searchQuery: string = '',
    sortBy: string = 'created_at',
    sortDirection: string = 'desc'
  ): Promise<{ users: User[], total: number }> {
    try {
      // Validate sort column
      const validColumns = ['username', 'email', 'full_name', 'role', 'status', 'created_at', 'updated_at'];
      sortBy = validColumns.includes(sortBy) ? sortBy : 'created_at';
      sortDirection = ['asc', 'desc'].includes(sortDirection) ? sortDirection : 'desc';

      let queryParams = [];
      let whereClause = '';
      
      // Add search filter
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

      // Get total count
      const countResult = await this.pool.query(
        `SELECT COUNT(*) FROM users ${whereClause}`,
        queryParams
      );
      
      const total = parseInt(countResult.rows[0].count, 10);

      // Get users with pagination
      const dataParams = [...queryParams, limit, offset];
      const paramOffset = queryParams.length;

      const dataResult = await this.pool.query(
        `SELECT * FROM users 
        ${whereClause} 
        ORDER BY ${sortBy} ${sortDirection} 
        LIMIT $${paramOffset + 1} OFFSET $${paramOffset + 2}`,
        dataParams
      );
      
      return { users: dataResult.rows, total };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Find all users
  static async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const result = await this.pool.query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  // Find by ID
  static async findById(id: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Find by email
  static async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Find by username
  static async findByUsername(username: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Update user
  static async update(id: string, userData: UserUpdate): Promise<User | null> {
    try {
      // Handle password hashing
      if (userData.password && !userData.password.startsWith('$2b$')) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.entries(userData).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && value !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (!fields.length) {
        const user = await this.findById(id);
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

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Delete multiple users
  static async deleteMultiple(ids: string[]): Promise<number> {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
    const result = await this.pool.query(
      `DELETE FROM users WHERE id IN (${placeholders})`,
      ids
    );
    return result.rowCount;
  }

  // Validate credentials
  static async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || user.status === 'inactive') return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  // Update user status
  static async updateStatus(id: string, status: 'active' | 'inactive'): Promise<User | null> {
    const result = await this.pool.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  // Count users by role
  static async countByRole(): Promise<{ role: string; count: number }[]> {
    const result = await this.pool.query('SELECT role, COUNT(*) FROM users GROUP BY role');
    return result.rows.map(row => ({
      role: row.role,
      count: parseInt(row.count, 10)
    }));
  }

  // Count users by date range
  static async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) FROM users WHERE created_at BETWEEN $1 AND $2',
      [startDate, endDate]
    );
    return parseInt(result.rows[0].count, 10);
  }
}