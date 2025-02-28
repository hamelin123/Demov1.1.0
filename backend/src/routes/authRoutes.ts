import express from 'express';
import { register, login, refreshToken, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { userSchema } from '../utils/validators';

const router = express.Router();

// Public routes
router.post('/register', validateBody(userSchema), register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;