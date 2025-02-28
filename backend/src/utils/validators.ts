// backend/src/utils/validators.ts
import Joi from 'joi';

// Schema พื้นฐานสำหรับข้อมูลผู้ใช้
const usernameSchema = Joi.string().min(3).max(30).pattern(new RegExp('^[a-zA-Z0-9_]+$'));
const emailSchema = Joi.string().email();
const passwordSchema = Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'));
const fullNameSchema = Joi.string().min(2).max(50);
const phoneSchema = Joi.string().pattern(new RegExp('^[0-9]{10}$'));
const addressSchema = Joi.string().max(200);

// สร้าง validation function ทั้งหมด
export const validateRegisterInput = (data: any) => {
  const schema = Joi.object({
    username: usernameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
    full_name: fullNameSchema.required(),
    phone_number: phoneSchema.optional(),
    address: addressSchema.optional()
  });
  return schema.validate(data);
};

export const validateLoginInput = (data: any) => {
  const schema = Joi.object({
    email: emailSchema.required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

export const validateProfileUpdateInput = (data: any) => {
  const schema = Joi.object({
    full_name: fullNameSchema.optional(),
    phone_number: phoneSchema.optional(),
    address: addressSchema.optional()
  });
  return schema.validate(data);
};

export const validateOrderInput = (data: any) => {
  const schema = Joi.object({
    sender_name: fullNameSchema.required(),
    sender_address: addressSchema.required(),
    sender_phone: phoneSchema.required(),
    recipient_name: fullNameSchema.required(),
    recipient_address: addressSchema.required(),
    recipient_phone: phoneSchema.required(),
    package_weight: Joi.number().min(0.1).required(),
    package_dimensions: Joi.string().max(50).optional(),
    special_instructions: Joi.string().max(500).optional(),
    estimated_delivery_date: Joi.date().min('now').optional()
  });
  return schema.validate(data);
};

export const validateTrackingEventInput = (data: any) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    status: Joi.string().required(),
    location: Joi.string().max(100).optional(),
    notes: Joi.string().max(500).optional(),
    vehicleId: Joi.string().optional()
  });
  return schema.validate(data);
};

export const validateTemperatureLogInput = (data: any) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().min(0).max(100).optional(),
    notes: Joi.string().max(500).optional()
  });
  return schema.validate(data);
};

export const validateUserInput = (data: any, isUpdate = false) => {
  const schema = Joi.object({
    username: isUpdate ? usernameSchema.optional() : usernameSchema.required(),
    email: isUpdate ? emailSchema.optional() : emailSchema.required(),
    password: isUpdate ? passwordSchema.optional() : passwordSchema.required(),
    full_name: isUpdate ? fullNameSchema.optional() : fullNameSchema.required(),
    role: Joi.string().valid('admin', 'staff', 'user').optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    phone_number: phoneSchema.optional(),
    address: addressSchema.optional()
  });
  return schema.validate(data);
};

// Middleware สำหรับตรวจสอบข้อมูลใน request
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.context?.key,
          message: detail.message
        }))
      });
    }
    req.body = value;
    next();
  };
};

// Export schemas สำหรับใช้ใน middleware
export const schemas = {
  user: Joi.object({
    username: usernameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
    full_name: fullNameSchema.required(),
    role: Joi.string().valid('admin', 'staff', 'user').optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    phone_number: phoneSchema.optional(),
    address: addressSchema.optional()
  }),
  login: Joi.object({
    email: emailSchema.required(),
    password: Joi.string().required()
  }),
  updateUserStatus: Joi.object({
    status: Joi.string().valid('active', 'inactive').required()
  }),
  temperatureLog: Joi.object({
    orderId: Joi.string().required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().min(0).max(100).optional(),
    notes: Joi.string().max(500).optional()
  })
};