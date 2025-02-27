import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User';
import { validateProfileUpdateInput, validateUserInput } from '../utils/validators';

/**
 * ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
 */
export const getUserProfile = async (req: Request, res: Response) => {
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
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateProfileUpdateInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    
    // ป้องกันการอัปเดตข้อมูลสำคัญ
    if (req.body.password || req.body.email || req.body.username || req.body.role) {
      res.status(400).json({ 
        message: 'Cannot update password, email, username, or role through this endpoint' 
      });
      return;
    }

    const updatedUser = await UserModel.update(req.user.id, {
      full_name: value.full_name,
      phone_number: value.phone_number,
      address: value.address
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
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
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }

    // ตรวจสอบรหัสผ่านปัจจุบัน
    const user = await UserModel.findById(req.user.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    // ตรวจสอบความซับซ้อนของรหัสผ่านใหม่
    if (newPassword.length < 8) {
      res.status(400).json({ 
        message: 'New password must be at least 8 characters long' 
      });
      return;
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
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'created_at';
    const sortDirection = req.query.sortDirection as string || 'desc';
    
    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const { users, total } = await UserModel.findAllWithPagination(
      limit, 
      offset, 
      searchQuery, 
      sortBy, 
      sortDirection
    );
    
    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({ 
      users: usersWithoutPassword,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * สร้างผู้ใช้ใหม่ (สำหรับ admin)
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateUserInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    // ตรวจสอบว่าอีเมลหรือชื่อผู้ใช้ซ้ำหรือไม่
    const existingEmail = await UserModel.findByEmail(value.email);
    if (existingEmail) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const existingUsername = await UserModel.findByUsername(value.username);
    if (existingUsername) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await UserModel.create({
      ...value,
      password: hashedPassword
    });

    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ดึงข้อมูลผู้ใช้ตาม ID (สำหรับ admin)
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const { id } = req.params;
    
    const user = await UserModel.findById(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
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
 * อัปเดตข้อมูลผู้ใช้ตาม ID (สำหรับ admin)
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const { id } = req.params;
    
    // ตรวจสอบว่าผู้ใช้มีอยู่จริง
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateUserInput(req.body, true); // ส่ง true ให้เป็น isUpdate
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    // ถ้ามีการอัปเดตอีเมล ตรวจสอบว่าซ้ำหรือไม่
    if (value.email && value.email !== existingUser.email) {
      const existingEmail = await UserModel.findByEmail(value.email);
      if (existingEmail) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }
    }

    // ถ้ามีการอัปเดตชื่อผู้ใช้ ตรวจสอบว่าซ้ำหรือไม่
    if (value.username && value.username !== existingUser.username) {
      const existingUsername = await UserModel.findByUsername(value.username);
      if (existingUsername) {
        res.status(400).json({ message: 'Username already taken' });
        return;
      }
    }

    // เตรียมข้อมูลสำหรับการอัปเดต
    const updateData: any = { ...value };
    
    // ถ้ามีการอัปเดตรหัสผ่าน ให้เข้ารหัสก่อน
    if (value.password) {
      updateData.password = await bcrypt.hash(value.password, 10);
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await UserModel.update(id, updateData);

    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * เปลี่ยนสถานะผู้ใช้ (active/inactive)
 */
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      res.status(400).json({ message: 'Invalid status. Must be "active" or "inactive"' });
      return;
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่จริง
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // ป้องกันการเปลี่ยนสถานะของตัวเอง
    if (id === req.user.id) {
      res.status(400).json({ message: 'Cannot change your own status' });
      return;
    }

    // อัปเดตสถานะผู้ใช้
    const updatedUser = await UserModel.update(id, { status });

    // ไม่ส่งข้อมูลรหัสผ่านกลับไป
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({
      message: 'User status updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ลบผู้ใช้ (สำหรับ admin)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const { id } = req.params;
    
    // ป้องกันการลบตัวเอง
    if (id === req.user.id) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }
    
    const result = await UserModel.delete(id);
    
    if (!result) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};