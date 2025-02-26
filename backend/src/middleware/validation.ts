import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export interface ValidationError extends Error {
  details?: any[];
}

/**
 * Middleware สำหรับตรวจสอบความถูกต้องของข้อมูลใน request body
 * @param schema Joi schema สำหรับตรวจสอบข้อมูล
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.context?.key,
          message: detail.message
        }))
      });
    }
    
    // อัปเดต req.body ด้วยข้อมูลที่ผ่านการตรวจสอบแล้ว
    req.body = value;
    next();
  };
};

/**
 * Middleware สำหรับตรวจสอบความถูกต้องของข้อมูลใน request params
 * @param schema Joi schema สำหรับตรวจสอบข้อมูล
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.context?.key,
          message: detail.message
        }))
      });
    }
    
    // อัปเดต req.params ด้วยข้อมูลที่ผ่านการตรวจสอบแล้ว
    req.params = value;
    next();
  };
};

/**
 * Middleware สำหรับตรวจสอบความถูกต้องของข้อมูลใน request query
 * @param schema Joi schema สำหรับตรวจสอบข้อมูล
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.context?.key,
          message: detail.message
        }))
      });
    }
    
    // อัปเดต req.query ด้วยข้อมูลที่ผ่านการตรวจสอบแล้ว
    req.query = value;
    next();
  };
};