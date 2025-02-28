import Joi from 'joi';

// Common validation patterns
const patterns = {
  username: new RegExp('^[a-zA-Z0-9_]+$'),
  password: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'),
  phone: new RegExp('^[0-9]{10}$')
};

// Common validation messages
const messages = {
  required: (field: string) => `${field} is required`,
  min: (field: string, limit: number) => `${field} should have a minimum length of ${limit}`,
  max: (field: string, limit: number) => `${field} should have a maximum length of ${limit}`,
  email: 'Please enter a valid email',
  pattern: {
    username: 'Username should only contain alphanumeric characters and underscores',
    password: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    phone: 'Phone number must be a 10-digit number'
  }
};

// Register validation
export const validateRegisterInput = (data: any) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required()
      .pattern(patterns.username)
      .messages({
        'string.base': 'Username should be a string',
        'string.empty': messages.required('Username'),
        'string.min': messages.min('Username', 3),
        'string.max': messages.max('Username', 30),
        'string.pattern.base': messages.pattern.username,
        'any.required': messages.required('Username')
      }),
    email: Joi.string().email().required()
      .messages({
        'string.base': 'Email should be a string',
        'string.empty': messages.required('Email'),
        'string.email': messages.email,
        'any.required': messages.required('Email')
      }),
    password: Joi.string().min(8).required()
      .pattern(patterns.password)
      .messages({
        'string.base': 'Password should be a string',
        'string.empty': messages.required('Password'),
        'string.min': messages.min('Password', 8),
        'string.pattern.base': messages.pattern.password,
        'any.required': messages.required('Password')
      }),
    full_name: Joi.string().min(2).max(50).required()
      .messages({
        'string.base': 'Full name should be a string',
        'string.empty': messages.required('Full name'),
        'string.min': messages.min('Full name', 2),
        'string.max': messages.max('Full name', 50),
        'any.required': messages.required('Full name')
      }),
    phone_number: Joi.string().pattern(patterns.phone).optional()
      .messages({
        'string.pattern.base': messages.pattern.phone
      }),
    address: Joi.string().max(200).optional()
      .messages({
        'string.max': messages.max('Address', 200)
      })
  });

  return schema.validate(data);
};

// Login validation
export const validateLoginInput = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.base': 'Email should be a string',
        'string.empty': messages.required('Email'),
        'string.email': messages.email,
        'any.required': messages.required('Email')
      }),
    password: Joi.string().required()
      .messages({
        'string.base': 'Password should be a string',
        'string.empty': messages.required('Password'),
        'any.required': messages.required('Password')
      })
  });

  return schema.validate(data);
};

// Profile update validation
export const validateProfileUpdateInput = (data: any) => {
  const schema = Joi.object({
    full_name: Joi.string().min(2).max(50).optional()
      .messages({
        'string.min': messages.min('Full name', 2),
        'string.max': messages.max('Full name', 50)
      }),
    phone_number: Joi.string().pattern(patterns.phone).optional()
      .messages({
        'string.pattern.base': messages.pattern.phone
      }),
    address: Joi.string().max(200).optional()
      .messages({
        'string.max': messages.max('Address', 200)
      })
  });

  return schema.validate(data);
};

// Order validation
export const validateOrderInput = (data: any) => {
  const schema = Joi.object({
    sender_name: Joi.string().min(2).max(50).required()
      .messages({
        'string.base': 'Sender name should be a string',
        'string.empty': messages.required('Sender name'),
        'string.min': messages.min('Sender name', 2),
        'string.max': messages.max('Sender name', 50),
        'any.required': messages.required('Sender name')
      }),
    sender_address: Joi.string().min(5).max(200).required()
      .messages({
        'string.base': 'Sender address should be a string',
        'string.empty': messages.required('Sender address'),
        'string.min': messages.min('Sender address', 5),
        'string.max': messages.max('Sender address', 200),
        'any.required': messages.required('Sender address')
      }),
    sender_phone: Joi.string().pattern(patterns.phone).required()
      .messages({
        'string.base': 'Sender phone should be a string',
        'string.empty': messages.required('Sender phone'),
        'string.pattern.base': messages.pattern.phone,
        'any.required': messages.required('Sender phone')
      }),
    recipient_name: Joi.string().min(2).max(50).required()
      .messages({
        'string.base': 'Recipient name should be a string',
        'string.empty': messages.required('Recipient name'),
        'string.min': messages.min('Recipient name', 2),
        'string.max': messages.max('Recipient name', 50),
        'any.required': messages.required('Recipient name')
      }),
    recipient_address: Joi.string().min(5).max(200).required()
      .messages({
        'string.base': 'Recipient address should be a string',
        'string.empty': messages.required('Recipient address'),
        'string.min': messages.min('Recipient address', 5),
        'string.max': messages.max('Recipient address', 200),
        'any.required': messages.required('Recipient address')
      }),
    recipient_phone: Joi.string().pattern(patterns.phone).required()
      .messages({
        'string.base': 'Recipient phone should be a string',
        'string.empty': messages.required('Recipient phone'),
        'string.pattern.base': messages.pattern.phone,
        'any.required': messages.required('Recipient phone')
      }),
    package_weight: Joi.number().min(0.1).required()
      .messages({
        'number.base': 'Package weight must be a number',
        'number.min': 'Package weight must be at least {#limit}',
        'any.required': messages.required('Package weight')
      }),
    package_dimensions: Joi.string().max(50).optional()
      .messages({
        'string.max': messages.max('Package dimensions', 50)
      }),
    special_instructions: Joi.string().max(500).optional()
      .messages({
        'string.max': messages.max('Special instructions', 500)
      }),
    estimated_delivery_date: Joi.date().min('now').optional()
      .messages({
        'date.base': 'Estimated delivery date must be a valid date',
        'date.min': 'Estimated delivery date must be in the future'
      })
  });

  return schema.validate(data);
};

// User validation
export const validateUserInput = (data: any, isUpdate = false) => {
  // Create dynamic schema based on whether it's an update or create
  const schema = Joi.object({
    username: isUpdate 
      ? Joi.string().min(3).max(30).pattern(patterns.username).optional() 
      : Joi.string().min(3).max(30).pattern(patterns.username).required(),
    email: isUpdate 
      ? Joi.string().email().optional() 
      : Joi.string().email().required(),
    password: isUpdate 
      ? Joi.string().min(8).pattern(patterns.password).optional() 
      : Joi.string().min(8).pattern(patterns.password).required(),
    full_name: isUpdate 
      ? Joi.string().min(2).max(50).optional() 
      : Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('admin', 'staff', 'user').optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    phone_number: Joi.string().pattern(patterns.phone).optional(),
    address: Joi.string().max(200).optional()
  });

  return schema.validate(data);
};

// User status validation
export const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required()
    .messages({
      'string.base': 'Status should be a string',
      'any.only': 'Status must be one of: active, inactive',
      'any.required': messages.required('Status')
    })
});

// Tracking event validation
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

// Temperature log validation
export const validateTemperatureLogInput = (data: any) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().min(0).max(100).optional()
  });

  return schema.validate(data);
};

// Export common schemas for middleware
export const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().pattern(patterns.username),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().pattern(patterns.password),
  full_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('admin', 'staff', 'user').optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  phone_number: Joi.string().pattern(patterns.phone).optional(),
  address: Joi.string().max(200).optional()
});