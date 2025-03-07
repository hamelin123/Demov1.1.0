// src/utils/validators.ts
import Joi from 'joi';

/**
 * ตรวจสอบข้อมูลการลงทะเบียน
 */
export const validateRegisterInput = (data: any) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required()
      .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
      .messages({
        'string.base': 'Username should be a string',
        'string.empty': 'Username is required',
        'string.min': 'Username should have a minimum length of {#limit}',
        'string.max': 'Username should have a maximum length of {#limit}',
        'string.pattern.base': 'Username should only contain alphanumeric characters and underscores',
        'any.required': 'Username is required'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.base': 'Email should be a string',
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
      }),
    password: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
      .messages({
        'string.base': 'Password should be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of {#limit}',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    full_name: Joi.string().min(2).max(50).required()
      .messages({
        'string.base': 'Full name should be a string',
        'string.empty': 'Full name is required',
        'string.min': 'Full name should have a minimum length of {#limit}',
        'string.max': 'Full name should have a maximum length of {#limit}',
        'any.required': 'Full name is required'
      }),
    phone_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).optional()
      .messages({
        'string.pattern.base': 'Phone number must be a 10-digit number'
      }),
    address: Joi.string().max(200).optional()
      .messages({
        'string.max': 'Address should have a maximum length of {#limit}'
      }),
    company: Joi.string().max(100).optional()
      .messages({
        'string.max': 'Company name should have a maximum length of {#limit}'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลการล็อกอิน
 */
export const validateLoginInput = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.base': 'Email should be a string',
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
      }),
    password: Joi.string().required()
      .messages({
        'string.base': 'Password should be a string',
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลการอัปเดตโปรไฟล์
 */
export const validateProfileUpdateInput = (data: any) => {
  const schema = Joi.object({
    full_name: Joi.string().min(2).max(50).optional()
      .messages({
        'string.min': 'Full name should have a minimum length of {#limit}',
        'string.max': 'Full name should have a maximum length of {#limit}'
      }),
    phone_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).optional()
      .messages({
        'string.pattern.base': 'Phone number must be a 10-digit number'
      }),
    address: Joi.string().max(200).optional()
      .messages({
        'string.max': 'Address should have a maximum length of {#limit}'
      }),
    company: Joi.string().max(100).optional()
      .messages({
        'string.max': 'Company name should have a maximum length of {#limit}'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลการเปลี่ยนรหัสผ่าน
 */
export const validateChangePasswordInput = (data: any) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'string.base': 'Current password should be a string',
        'string.empty': 'Current password is required',
        'any.required': 'Current password is required'
      }),
    newPassword: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
      .messages({
        'string.base': 'New password should be a string',
        'string.empty': 'New password is required',
        'string.min': 'New password should have a minimum length of {#limit}',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'New password is required'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลการสร้างคำสั่งซื้อ
 */
export const validateOrderInput = (data: any) => {
  const schema = Joi.object({
    sender_name: Joi.string().min(2).max(50).required()
      .messages({
        'string.base': 'Sender name should be a string',
        'string.empty': 'Sender name is required',
        'string.min': 'Sender name should have a minimum length of {#limit}',
        'string.max': 'Sender name should have a maximum length of {#limit}',
        'any.required': 'Sender name is required'
      }),
    sender_address: Joi.string().min(5).max(200).required()
      .messages({
        'string.base': 'Sender address should be a string',
        'string.empty': 'Sender address is required',
        'string.min': 'Sender address should have a minimum length of {#limit}',
        'string.max': 'Sender address should have a maximum length of {#limit}',
        'any.required': 'Sender address is required'
      }),
    sender_phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required()
      .messages({
        'string.base': 'Sender phone should be a string',
        'string.empty': 'Sender phone is required',
        'string.pattern.base': 'Sender phone must be a 10-digit number',
        'any.required': 'Sender phone is required'
      }),
    recipient_name: Joi.string().min(2).max(50).required()
      .messages({
        'string.base': 'Recipient name should be a string',
        'string.empty': 'Recipient name is required',
        'string.min': 'Recipient name should have a minimum length of {#limit}',
        'string.max': 'Recipient name should have a maximum length of {#limit}',
        'any.required': 'Recipient name is required'
      }),
    recipient_address: Joi.string().min(5).max(200).required()
      .messages({
        'string.base': 'Recipient address should be a string',
        'string.empty': 'Recipient address is required',
        'string.min': 'Recipient address should have a minimum length of {#limit}',
        'string.max': 'Recipient address should have a maximum length of {#limit}',
        'any.required': 'Recipient address is required'
      }),
    recipient_phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required()
      .messages({
        'string.base': 'Recipient phone should be a string',
        'string.empty': 'Recipient phone is required',
        'string.pattern.base': 'Recipient phone must be a 10-digit number',
        'any.required': 'Recipient phone is required'
      }),
    package_weight: Joi.number().min(0.1).required()
      .messages({
        'number.base': 'Package weight must be a number',
        'number.min': 'Package weight must be at least {#limit}',
        'any.required': 'Package weight is required'
      }),
    package_dimensions: Joi.string().max(50).optional()
      .messages({
        'string.max': 'Package dimensions should have a maximum length of {#limit}'
      }),
    special_instructions: Joi.string().max(500).optional()
      .messages({
        'string.max': 'Special instructions should have a maximum length of {#limit}'
      }),
    estimated_delivery_date: Joi.date().min('now').optional()
      .messages({
        'date.base': 'Estimated delivery date must be a valid date',
        'date.min': 'Estimated delivery date must be in the future'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลการเพิ่มเหตุการณ์การติดตาม
 */
export const validateTrackingEventInput = (data: any) => {
  const schema = Joi.object({
    orderId: Joi.string().uuid().required()
      .messages({
        'string.base': 'Order ID should be a string',
        'string.empty': 'Order ID is required',
        'string.uuid': 'Order ID must be a valid UUID',
        'any.required': 'Order ID is required'
      }),
    status: Joi.string().required()
      .messages({
        'string.base': 'Status should be a string',
        'string.empty': 'Status is required',
        'any.required': 'Status is required'
      }),
    location: Joi.string().max(100).optional()
      .messages({
        'string.max': 'Location should have a maximum length of {#limit}'
      }),
    notes: Joi.string().max(500).optional()
      .messages({
        'string.max': 'Notes should have a maximum length of {#limit}'
      }),
    vehicleId: Joi.string().uuid().optional()
      .messages({
        'string.uuid': 'Vehicle ID must be a valid UUID'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลการเพิ่มบันทึกอุณหภูมิ
 */
export const validateTemperatureLogInput = (data: any) => {
  const schema = Joi.object({
    orderId: Joi.string().uuid().required()
      .messages({
        'string.base': 'Order ID should be a string',
        'string.empty': 'Order ID is required',
        'string.uuid': 'Order ID must be a valid UUID',
        'any.required': 'Order ID is required'
      }),
    temperature: Joi.number().required()
      .messages({
        'number.base': 'Temperature must be a number',
        'any.required': 'Temperature is required'
      }),
    humidity: Joi.number().min(0).max(100).optional()
      .messages({
        'number.base': 'Humidity must be a number',
        'number.min': 'Humidity must be at least {#limit}',
        'number.max': 'Humidity must be at most {#limit}'
      }),
    location: Joi.string().max(200).optional()
      .messages({
        'string.max': 'Location should have a maximum length of {#limit}'
      }),
    notes: Joi.string().max(500).optional()
      .messages({
        'string.max': 'Notes should have a maximum length of {#limit}'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลการอัปเดตสถานะการขนส่ง
 */
export const validateShipmentStatusInput = (data: any) => {
  const schema = Joi.object({
    orderId: Joi.string().uuid().required()
      .messages({
        'string.base': 'Order ID should be a string',
        'string.empty': 'Order ID is required',
        'string.uuid': 'Order ID must be a valid UUID',
        'any.required': 'Order ID is required'
      }),
    status: Joi.string().required()
      .messages({
        'string.base': 'Status should be a string',
        'string.empty': 'Status is required',
        'any.required': 'Status is required'
      }),
    location: Joi.string().max(200).required()
      .messages({
        'string.base': 'Location should be a string',
        'string.empty': 'Location is required',
        'string.max': 'Location should have a maximum length of {#limit}',
        'any.required': 'Location is required'
      }),
    notes: Joi.string().max(500).optional()
      .messages({
        'string.max': 'Notes should have a maximum length of {#limit}'
      }),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    vehicleId: Joi.string().uuid().optional()
      .messages({
        'string.uuid': 'Vehicle ID must be a valid UUID'
      })
  });

  return schema.validate(data);
};

/**
 * ตรวจสอบข้อมูลผู้ใช้
 */
export const validateUserInput = (data: any, isUpdate = false) => {
  const schema = Joi.object({
    username: isUpdate ? Joi.string().min(3).max(30).optional() : Joi.string().min(3).max(30).required()
      .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
      .messages({
        'string.base': 'Username should be a string',
        'string.empty': 'Username is required',
        'string.min': 'Username should have a minimum length of {#limit}',
        'string.max': 'Username should have a maximum length of {#limit}',
        'string.pattern.base': 'Username should only contain alphanumeric characters and underscores',
        'any.required': 'Username is required'
      }),
    email: isUpdate ? Joi.string().email().optional() : Joi.string().email().required()
      .messages({
        'string.base': 'Email should be a string',
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
      }),
    password: isUpdate ? Joi.string().min(8).optional() : Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
      .messages({
        'string.base': 'Password should be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of {#limit}',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    full_name: isUpdate ? Joi.string().min(2).max(50).optional() : Joi.string().min(2).max(50).required()
      .messages({
        'string.base': 'Full name should be a string',
        'string.empty': 'Full name is required',
        'string.min': 'Full name should have a minimum length of {#limit}',
        'string.max': 'Full name should have a maximum length of {#limit}',
        'any.required': 'Full name is required'
      }),
    role: Joi.string().valid('admin', 'staff', 'user').optional()
      .messages({
        'string.base': 'Role should be a string',
        'any.only': 'Role must be one of: admin, staff, user'
      }),
    status: Joi.string().valid('active', 'inactive').optional()
      .messages({
        'string.base': 'Status should be a string',
        'any.only': 'Status must be one of: active, inactive'
      }),
    phone_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).optional()
      .messages({
        'string.pattern.base': 'Phone number must be a 10-digit number'
      }),
    company: Joi.string().max(100).optional()
      .messages({
        'string.max': 'Company name should have a maximum length of {#limit}'
      }),
    address: Joi.string().max(200).optional()
      .messages({
        'string.max': 'Address should have a maximum length of {#limit}'
      })
  });

  return schema.validate(data);
};

/**
 * Schema สำหรับการอัปเดตสถานะผู้ใช้
 */
export const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required()
    .messages({
      'string.base': 'Status should be a string',
      'any.only': 'Status must be one of: active, inactive',
      'any.required': 'Status is required'
    })
});

/**
 * Export schemas สำหรับใช้ใน middleware
 */
export const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required()
    .pattern(new RegExp('^[a-zA-Z0-9_]+$')),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')),
  full_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('admin', 'staff', 'user').optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  phone_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).optional(),
  company: Joi.string().max(100).optional(),
  address: Joi.string().max(200).optional()
});