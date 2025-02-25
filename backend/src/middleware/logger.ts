import { Request, Response, NextFunction } from 'express';

/**
 * บันทึกรายละเอียดของ request ที่เข้ามา
 */
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // บันทึกข้อมูลเมื่อส่ง response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${