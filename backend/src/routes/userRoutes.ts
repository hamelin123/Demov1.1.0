import express, { Request, Response } from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  // updateUserStatus, <-- ลบบรรทัดนี้ออก
  deleteUser
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { userSchema } from '../utils/validators';

const router = express.Router();

// Routes ที่ทุกคนเข้าถึงได้ (ต้องใช้ authenticate)
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

// Routes สำหรับผู้ดูแลระบบเท่านั้น
// ดึงผู้ใช้ทั้งหมด
router.get('/', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  getAllUsers(req, res);
});

// สร้างผู้ใช้ใหม่
router.post(
  '/', 
  authenticate, 
  authorize(['admin']), 
  validateBody(userSchema),
  (req: Request, res: Response) => {
    createUser(req, res);
  }
);

// ดึงข้อมูลผู้ใช้ตาม ID
router.get('/:id', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  getUserById(req, res);
});

// อัปเดตข้อมูลผู้ใช้ตาม ID
router.put(
  '/:id', 
  authenticate, 
  authorize(['admin']), 
  (req: Request, res: Response) => {
    updateUser(req, res);
  }
);

// ลบเส้นทางนี้เพราะฟังก์ชัน updateUserStatus ถูกคอมเมนต์ไว้
// เปลี่ยนสถานะผู้ใช้ (active/inactive)
// router.patch(
//   '/:id/status', 
//   authenticate, 
//   authorize(['admin']), 
//   validateBody(updateUserStatusSchema),
//   (req: Request, res: Response) => {
//     updateUserStatus(req, res);
//   }
// );

// ลบผู้ใช้
router.delete('/:id', authenticate, authorize(['admin']), (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router;