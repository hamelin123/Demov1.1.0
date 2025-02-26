import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User';

/**
 * ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await UserModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * อัปเดตข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { full_name, phone_number, address } = req.body;
    
    // ป้องกันการอัปเดตข้อมูลสำคัญ
    if (req.body.password || req.body.email || req.body.username || req.body.role) {
      return res.status(400).json({ 
        message: 'Cannot update password, email, username, or role through this endpoint' 
      });
    }

    const updatedUser = await UserModel.update(req.user.id, {
      full_name,
      phone_number,
      address
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({ 
      message: 'Profile updated successfully', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * เปลี่ยนรหัสผ่าน
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    // ตรวจสอบรหัสผ่านปัจจุบัน
    const user = await UserModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // ตรวจสอบความซับซ้อนของรหัสผ่านใหม่
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: 'New password must be at least 8 characters long' 
      });
    }

    // เข้ารหัสรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // อัปเดตรหัสผ่าน
    await UserModel.update(req.user.id, { password: hashedPassword });
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงผู้ใช้ทั้งหมด (สำหรับ admin)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // คำสั่งนี้จะทำงานได้เฉพาะเมื่อผ่าน middleware authorize(['admin']) แล้วเท่านั้น
    const limit = parseInt(req.query.limit as string) || 50;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;
    
    const users = await UserModel.findAll(limit, offset);
    
    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({ users: usersWithoutPassword });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงข้อมูลผู้ใช้ตาม ID (สำหรับ admin)
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    // คำสั่งนี้จะทำงานได้เฉพาะเมื่อผ่าน middleware authorize(['admin']) แล้วเท่านั้น
    const { id } = req.params;
    
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ลบผู้ใช้ (สำหรับ admin)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // คำสั่งนี้จะทำงานได้เฉพาะเมื่อผ่าน middleware authorize(['admin']) แล้วเท่านั้น
    const { id } = req.params;
    
    // ป้องกันการลบตัวเอง
    if (req.user && id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const result = await UserModel.delete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};