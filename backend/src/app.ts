import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/error';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Log middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', routes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Cold Chain API is running!' });
});

// Error handling middleware - ต้องใส่ทั้ง 4 parameters ตามลำดับนี้
app.use(errorHandler);

// เริ่มต้นฐานข้อมูล
initializeDatabase()
  .then(() => console.log('Database initialized successfully'))
  .catch(err => console.error('Error initializing database:', err));

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 5, // จำกัด 5 ครั้งต่อ IP
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/auth/login', loginLimiter);
export default app;