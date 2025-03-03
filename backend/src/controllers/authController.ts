import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { validateRegisterInput, validateLoginInput } from '../utils/validators';

// ลบการนำเข้า rateLimit และลบโค้ดการกำหนด loginLimiter ออก

/**
 * สมัครสมาชิกใหม่
 */
export const register = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateRegisterInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingEmail = await UserModel.findByEmail(value.email);
    if (existingEmail) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
    const existingUsername = await UserModel.findByUsername(value.username);
    if (existingUsername) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }

    // สร้างผู้ใช้ใหม่
    const newUser = await UserModel.create(value);

    // สร้าง token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    // สร้าง refresh token
    const refreshToken = jwt.sign(
      { id: newUser.id },
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * เข้าสู่ระบบ
 */
export const login = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateLoginInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    // ตรวจสอบข้อมูลการเข้าสู่ระบบ
    const user = await UserModel.validateCredentials(value.email, value.password);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // บันทึกการล็อกอิน
    await UserModel.logLogin(
      user.id,
      true, // สำเร็จ
      req.ip,
      req.headers['user-agent']
    );

    // สร้าง token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    // สร้าง refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * รีเฟรช token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    // ตรวจสอบความถูกต้องของ refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret') as { id: string };
    
    // ค้นหาผู้ใช้
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // สร้าง token ใหม่
    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

/**
 * ดึงข้อมูลผู้ใช้ปัจจุบัน
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phoneNumber: user.phone_number,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};