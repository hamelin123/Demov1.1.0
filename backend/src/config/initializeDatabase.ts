// src/config/initializeDatabase.ts
import { initializeDatabase } from './database';

initializeDatabase()
  .then(() => console.log('Database initialized'))
  .catch(err => console.error('Database initialization failed', err));