// backend/src/config/initializeDatabase.ts
import { createTables, seedData } from './initDb';
import { runMigration } from '../migrations/runMigration';

/**
 * เริ่มต้นฐานข้อมูล
 */
export const initializeDatabase = async () => {
  try {
    await createTables();
    await seedData();
    
    // เพิ่มการรัน migration
    await runMigration('create_staff_tables.sql');
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

// ถ้าเรียกไฟล์โดยตรง (เช่น node initializeDatabase.js)
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}