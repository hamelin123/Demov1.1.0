import express, { Request, Response } from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// ดึงข้อมูลโปรไฟล์ของตัวเอง
router.get('/profile', authenticate, (req: Request, res: Response) => {
  getUserProfile(req, res);
});

// อัปเดตข้อมูลโปรไฟล์ของตัวเอง
router.put('/profile', authenticate, (req: Request, res: Response) => {
  updateUserProfile(req, res);
});

// เปลี่ยนรหัสผ่าน
router.post('/change-password', authenticate, (req: Request, res: Response) => {
  changePassword(req, res);
});

// ดึงผู้ใช้ทั้งหมด (เฉพาะ admin)
router.get('/', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  getAllUsers(req, res);
});

// ดึงข้อมูลผู้ใช้ตาม ID (เฉพาะ admin)
router.get('/:id', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  getUserById(req, res);
});

// ลบผู้ใช้ (เฉพาะ admin)
router.delete('/:id', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router;