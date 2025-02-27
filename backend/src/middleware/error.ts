// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any;
}

/**
 * จัดการข้อผิดพลาดที่เกิดขึ้นในแอปพลิเคชัน
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // บันทึกข้อผิดพลาดสำหรับการแก้ไขปัญหา
  console.error('Server Error:', err);

  // ตรวจสอบประเภทของข้อผิดพลาด
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }

  // สถานะโค้ดที่กำหนดโดยตรง หรือใช้ค่าเริ่มต้น 500
  const statusCode = err.statusCode || 500;
  
  // ข้อความข้อผิดพลาด
  const message = err.message || 'Something went wrong';
  
  // ส่งกลับข้อผิดพลาด
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

/**
 * สร้างข้อผิดพลาดที่มีสถานะโค้ดกำหนดเอง
 */
export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};