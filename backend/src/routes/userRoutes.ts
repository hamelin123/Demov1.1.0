import express from 'express';
import { 
  getUserProfile, updateUserProfile, changePassword,
  getAllUsers, createUser, getUserById,
  updateUser, updateUserStatus, deleteUser
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { userSchema, updateUserStatusSchema } from '../utils/validators';

const router = express.Router();

// Use authentication for all routes
router.use(authenticate);

// User routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/change-password', changePassword);

// Admin-only routes
router.use(authorize(['admin']));
router.get('/', getAllUsers);
router.post('/', validateBody(userSchema), createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/status', validateBody(updateUserStatusSchema), updateUserStatus);
router.delete('/:id', deleteUser);

export default router;