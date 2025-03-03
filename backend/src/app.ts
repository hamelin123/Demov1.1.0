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
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use((req, res, next) => { 
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`); 
  next(); 
});

// Routes
app.use('/api', routes);
app.get('/', (req, res) => res.json({ message: 'Cold Chain API is running!' }));
app.use(errorHandler);

// Initialize database
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