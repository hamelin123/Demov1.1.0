import express, { Request, Response } from 'express';
import { register, login, refreshToken, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// เส้นทางสำหรับการสมัครสมาชิก
router.post('/register', (req: Request, res: Response) => {
  register(req, res);
});

// เส้นทางสำหรับการเข้าสู่ระบบ
router.post('/login', (req: Request, res: Response) => {
  login(req, res);
});

// เส้นทางสำหรับการรีเฟรช token
router.post('/refresh-token', (req: Request, res: Response) => {
  refreshToken(req, res);
});

// เส้นทางสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน - ใช้ any แทนประเภทที่ถูกต้อง
router.get('/me', authenticate as any, (req: Request, res: Response) => {
  getMe(req, res);
});

export default router;