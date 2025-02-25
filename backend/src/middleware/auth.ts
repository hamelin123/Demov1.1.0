import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

interface TokenPayload {
  id: string;
  role: string;
}

// เพิ่ม properties ให้กับ Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * ตรวจสอบความถูกต้องของ JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // ดึง token จาก header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // ตรวจสอบความถูกต้องของ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
    
    // เพิ่มข้อมูลผู้ใช้ลงใน request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    // ไม่ต้องรอตรวจสอบกับฐานข้อมูล ให้ไปทำงานต่อเลย
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};

/**
 * ตรวจสอบสิทธิ์ของผู้ใช้
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'You do not have permission to access this resource' });
      return;
    }

    next();
  };
};