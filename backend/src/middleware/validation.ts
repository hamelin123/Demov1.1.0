import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export interface ValidationError extends Error {
  details?: any[];
}

// Validate request body
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

// Validate request params
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.context?.key,
          message: detail.message
        }))
      });
    }
    
    req.params = value;
    next();
  };
};

// Validate request query
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.context?.key,
          message: detail.message
        }))
      });
    }
    
    req.query = value;
    next();
  };
};