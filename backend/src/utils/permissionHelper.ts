// backend/src/utils/permissionHelper.ts
export interface User {
    id: string;
    role: string;
  }
  
  export interface PermissionContext {
    orderId?: string;
    userId?: string;
    vehicleId?: string;
    [key: string]: any;
  }
  
  /**
   * ตรวจสอบสิทธิ์การเข้าถึงทรัพยากร
   * @param user ข้อมูลผู้ใช้
   * @param permission สิทธิ์ที่ต้องการตรวจสอบ
   * @param context บริบทเพิ่มเติม
   * @returns ผลการตรวจสอบสิทธิ์
   */
  export const checkPermission = (
    user: User,
    permission: string,
    context: PermissionContext = {}
  ): boolean => {
    // ตรวจสอบว่ามีข้อมูลผู้ใช้หรือไม่
    if (!user) {
      return false;
    }
  
    // Admin มีสิทธิ์ทุกอย่าง
    if (user.role === 'admin') {
      return true;
    }
  
    // Staff permissions
    if (user.role === 'staff') {
      const staffPermissions = [
        'temperature:create',
        'temperature:view',
        'tracking:create',
        'tracking:view',
        'order:view'
      ];
      
      if (staffPermissions.includes(permission)) {
        return true;
      }
    }
  
    // User permissions - เฉพาะข้อมูลของตัวเอง
    if (user.role === 'user' && context.userId === user.id) {
      const userPermissions = [
        'order:view',
        'order:create',
        'order:update', // เฉพาะสถานะ pending
        'order:cancel', // เฉพาะสถานะที่ยังไม่ delivered
        'temperature:view',
        'tracking:view'
      ];
      
      if (userPermissions.includes(permission)) {
        return true;
      }
    }
  
    // ถ้าไม่เข้าเงื่อนไขใดๆ
    return false;
  };