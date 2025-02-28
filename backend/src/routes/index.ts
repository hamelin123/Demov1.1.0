import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import orderRoutes from './orderRoutes';
import trackingRoutes from './trackingRoutes';
import temperatureRoutes from './temperatureRoutes';

const router = express.Router();

// Test route
router.get('/test', (req, res) => res.json({ message: 'API is working!' }));

// Register all API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/tracking', trackingRoutes);
router.use('/temperature', temperatureRoutes);

export default router;